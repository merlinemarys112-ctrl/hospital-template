import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import { fetchClinicByUuid, fetchClinics, fetchDoctorTeams } from '../lib/drupal-client'
import { getOrUploadMedia } from '../lib/media'
import { mapDrupalClinicResource } from '../lib/mappers/clinic-mapper'
import { mapDrupalDoctorTeam } from '../lib/mappers/doctor-mapper'
import { upsertByField } from '../lib/upsert'

type ImportFailure = {
  context: string
  message: string
}

type Summary = {
  clinicsCreated: number
  clinicsUpdated: number
  doctorsCreated: number
  doctorsUpdated: number
  sessionsCreated: number
  sessionsUpdated: number
  failures: ImportFailure[]
}

async function main() {
  const payload = await getPayload({ config })
  const summary: Summary = {
    clinicsCreated: 0,
    clinicsUpdated: 0,
    doctorsCreated: 0,
    doctorsUpdated: 0,
    sessionsCreated: 0,
    sessionsUpdated: 0,
    failures: [],
  }

  console.log('Fetching Drupal clinics via JSON:API…')
  const clinicList = await fetchClinics()
  console.log(`Found ${clinicList.data.length} clinic(s)`)

  for (const listEntry of clinicList.data) {
    const contextBase = `clinic ${listEntry.id} (tid=${listEntry.attributes.drupal_internal__tid})`

    try {
      console.log(`\n→ Processing ${contextBase}`)

      const detail = await fetchClinicByUuid(listEntry.id)
      const mapped = mapDrupalClinicResource(detail.data, detail.included)

      if (!mapped.slug) {
        throw new Error('Mapped clinic has no slug (path.alias missing)')
      }
      if (!mapped.phone) {
        throw new Error('Mapped clinic has no phone (field_clinic_phone_number empty)')
      }

      const logoMedia = mapped.logoUrl
        ? await getOrUploadMedia(payload, mapped.logoUrl, `${mapped.name} logo`)
        : null

      const desktopBannerMedia = mapped.banners.desktopBannerUrl
        ? await getOrUploadMedia(
            payload,
            mapped.banners.desktopBannerUrl,
            `${mapped.name} desktop banner`,
          )
        : null

      const mobileBannerMedia = mapped.banners.mobileBannerUrl
        ? await getOrUploadMedia(
            payload,
            mapped.banners.mobileBannerUrl,
            `${mapped.name} mobile banner`,
          )
        : null

      if (!logoMedia && !desktopBannerMedia && !mobileBannerMedia) {
        console.warn(
          `  ⚠ ${contextBase}: no logo/banner media resolved (Drupal paragraphs may be private)`,
        )
      }

      const clinicResult = await upsertByField(payload, 'clinics', 'slug', mapped.slug, {
        drupalUuid: mapped.drupalUuid,
        drupalTid: mapped.drupalTid,
        name: mapped.name,
        slug: mapped.slug,
        description: mapped.description,
        phone: mapped.phone,
        email: mapped.email,
        instructions: mapped.instructions,
        locationLabel: mapped.locationLabel,
        openCloseText: mapped.openCloseText,
        rating: mapped.rating,
        reviewCount: mapped.reviewCount,
        priceRange: mapped.priceRange,
        areaServed: mapped.areaServed,
        colorCode: mapped.colorCode,
        showBlogs: mapped.showBlogs,
        showTestimonials: mapped.showTestimonials,
        logo: logoMedia?.id ?? null,
        banners: {
          desktopBanner: desktopBannerMedia?.id ?? null,
          mobileBanner: mobileBannerMedia?.id ?? null,
        },
        address: mapped.address,
        mapHtml: mapped.mapHtml,
        workingHours: mapped.workingHours,
        seo: mapped.seo,
        whatsapp: mapped.whatsapp,
        clinicSamAi: mapped.clinicSamAi,
        youtubeVideos: mapped.youtubeVideos,
      })

      if (clinicResult.created) summary.clinicsCreated += 1
      else summary.clinicsUpdated += 1
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`✗ ${contextBase}: ${message}`)
      summary.failures.push({ context: contextBase, message })
    }
  }

  console.log('\nFetching Drupal doctor teams via JSON:API…')
  try {
    const teams = await fetchDoctorTeams()
    console.log(
      `Found ${teams.data.length} team node(s), ${teams.doctorTeamMembers.length} member paragraph(s)`,
    )

    for (const team of teams.data) {
      const teamContext = `doctor team ${team.id}`
      try {
        const doctors = mapDrupalDoctorTeam(team, teams.included)

        for (const mappedDoctor of doctors) {
          const doctorContext = `${teamContext} / ${mappedDoctor.drupalParagraphId}`
          try {
            if (!mappedDoctor.photoUrl) {
              console.warn(
                `  ⚠ ${doctorContext}: no photoUrl — skipping (Payload Doctor.photo is required)`,
              )
              continue
            }

            const slug =
              mappedDoctor.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') || `doctor-${mappedDoctor.drupalInternalId}`

            const photo = await getOrUploadMedia(
              payload,
              mappedDoctor.photoUrl,
              mappedDoctor.photoAlt || mappedDoctor.name,
            )

            const doctorResult = await upsertByField(payload, 'doctors', 'slug', slug, {
              name: mappedDoctor.name,
              slug,
              photo: photo.id,
              tagline: mappedDoctor.speciality || mappedDoctor.qualification || null,
            })

            if (doctorResult.created) summary.doctorsCreated += 1
            else summary.doctorsUpdated += 1

            // TODO: clinic↔team link unresolved — see fetchClinicByUuidRaw(); clinicDrupalUuid stays null
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            console.error(`  ✗ ${doctorContext}: ${message}`)
            summary.failures.push({ context: doctorContext, message })
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`✗ ${teamContext}: ${message}`)
        summary.failures.push({ context: teamContext, message })
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`✗ doctor teams fetch: ${message}`)
    summary.failures.push({ context: 'doctor teams fetch', message })
  }

  console.log('\n========== Import summary ==========')
  console.log(`Clinics created: ${summary.clinicsCreated}`)
  console.log(`Clinics updated: ${summary.clinicsUpdated}`)
  console.log(`Doctors created: ${summary.doctorsCreated}`)
  console.log(`Doctors updated: ${summary.doctorsUpdated}`)
  console.log(`Sessions created: ${summary.sessionsCreated}`)
  console.log(`Sessions updated: ${summary.sessionsUpdated}`)

  if (summary.failures.length > 0) {
    console.log(`\nFailures (${summary.failures.length}):`)
    for (const failure of summary.failures) {
      console.log(`  - [${failure.context}] ${failure.message}`)
    }
  } else {
    console.log('\nNo failures.')
  }

  process.exit(summary.failures.length > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal import error:', err)
  process.exit(1)
})
