import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type {
  Article,
  Clinic,
  DoctorClinicSession,
  Faq,
  Testimonial,
} from '@/payload-types'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { isMedia } from './components/media'
import { getTemplateComponent } from './templates'
import type { ClinicPageData } from './types'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const clinics = await payload.find({
    collection: 'clinics',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return clinics.docs.map(({ slug }) => ({ slug }))
}

export default async function ClinicPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const data = await queryClinicPage(decodedSlug)

  if (!data) notFound()

  const { clinic, doctorSessions, articles, testimonials, faqs } = data

  const Template = getTemplateComponent(clinic.template)

  return (
    <div className="bg-brand-mist">
      <Header clinicName={clinic.name} phone={clinic.phone} logo={clinic.logo} />
      <Template
        clinic={clinic}
        doctorSessions={doctorSessions}
        articles={articles}
        testimonials={testimonials}
        faqs={faqs}
      />
      <Footer clinicName={clinic.name} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const data = await queryClinicPage(decodedSlug)

  if (!data) {
    return { title: 'Clinic not found' }
  }

  const { clinic } = data
  const description = `${clinic.name} — ${clinic.address.line1}, ${clinic.address.city}`

  return {
    title: clinic.name,
    description,
    openGraph: {
      title: clinic.name,
      description,
      images: (() => {
        const og =
          clinic.banners?.desktopBanner || clinic.banners?.mobileBanner || clinic.logo || null
        return isMedia(og) && og.url ? [og.url] : undefined
      })(),
    },
  }
}

const queryClinicPage = cache(async (slug: string): Promise<ClinicPageData | null> => {
  const payload = await getPayloadClient()

  const clinicResult = await payload.find({
    collection: 'clinics',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const clinic = (clinicResult.docs?.[0] as Clinic | undefined) || null
  if (!clinic) return null

  const [sessionsResult, articlesResult, testimonialsResult, faqsResult] = await Promise.all([
    payload.find({
      collection: 'doctor-clinic-sessions',
      depth: 2,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      where: {
        clinic: {
          equals: clinic.id,
        },
      },
    }),
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 12,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedDate',
      where: {
        clinic: {
          equals: clinic.id,
        },
      },
    }),
    payload.find({
      collection: 'testimonials',
      depth: 1,
      limit: 20,
      overrideAccess: false,
      pagination: false,
      where: {
        clinic: {
          equals: clinic.id,
        },
      },
    }),
    payload.find({
      collection: 'faqs',
      depth: 1,
      limit: 20,
      overrideAccess: false,
      pagination: false,
      where: {
        clinic: {
          equals: clinic.id,
        },
      },
    }),
  ])

  return {
    clinic,
    doctorSessions: sessionsResult.docs as DoctorClinicSession[],
    articles: articlesResult.docs as Article[],
    testimonials: testimonialsResult.docs as Testimonial[],
    faqs: faqsResult.docs as Faq[],
  }
})
