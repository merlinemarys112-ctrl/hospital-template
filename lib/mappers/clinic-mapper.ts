import {
  absoluteFileUrl,
  type DrupalClinicResource,
  getRelationshipData,
  type JsonApiResource,
  resolveIncluded,
  resolveIncludedMany,
} from '../drupal-client'
import { parseDrupalAddress } from './parse-address'

export type MappedClinicBanner = {
  desktopBannerUrl: string | null
  mobileBannerUrl: string | null
}

export type MappedWorkingHoursRow = {
  toDoctor: string | null
  clinicDays: string | null
  clinicHours: string | null
  mobileNumber: string | null
  instructions: string | null
  priorityRule: string | null
  specialtyKeyword: string | null
  ageGroup: string | null
  priorityLevel: string | null
  priorityScore: number | null
  appointmentClinicNumber: string | null
}

export type MappedClinic = {
  drupalUuid: string
  drupalTid: number
  name: string
  /** From path.alias, without leading slash */
  slug: string
  description: string | null
  phone: string
  email: string | null
  rating: number | null
  reviewCount: number | null
  priceRange: string | null
  areaServed: string | null
  instructions: string | null
  locationLabel: string | null
  openCloseText: string | null
  colorCode: string | null
  showBlogs: boolean
  showTestimonials: boolean
  address: {
    line1: string
    city: string
    state: string
    postalCode: string
    latitude: number
    longitude: number
  }
  mapHtml: string | null
  /** Clinic logo only — never used as the hero banner */
  logoUrl: string | null
  banners: MappedClinicBanner
  workingHours: MappedWorkingHoursRow[]
  specialities: Array<{ uuid: string; name: string }>
  seo: {
    metaTitle: string | null
    metaDescription: string | null
    metaKeywords: string | null
    crawlingDisabled: boolean
  }
  whatsapp: {
    middlewareToken: string | null
    tokenId: string | null
  }
  clinicSamAi: {
    enabled: boolean
  }
  youtubeVideos: Array<{
    embedUrl: string | null
    title: string | null
    description: string | null
  }>
  /** Raw included paragraphs kept for later section mapping */
  servicesSection: JsonApiResource[]
  specialitiesSection: JsonApiResource[]
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

function slugFromPathAlias(alias: string | null | undefined, fallbackTid: number): string {
  if (!alias) return `clinic-${fallbackTid}`
  return alias.replace(/^\/+/, '').replace(/\/+$/, '') || `clinic-${fallbackTid}`
}

function descriptionToText(description: unknown): string | null {
  if (typeof description === 'string') return description.trim() || null
  if (description && typeof description === 'object') {
    const obj = description as { processed?: string; value?: string }
    return asString(obj.processed) || asString(obj.value)
  }
  return null
}

function fileUrlFromRelationship(
  resource: JsonApiResource,
  field: string,
  included: JsonApiResource[],
): string | null {
  const ref = getRelationshipData(resource, field)
  if (!ref || Array.isArray(ref)) {
    if (Array.isArray(ref) && ref[0]) {
      return absoluteFileUrl(resolveIncluded(ref[0], included))
    }
    return null
  }
  return absoluteFileUrl(resolveIncluded(ref, included))
}

/**
 * Extract desktop/mobile banner URLs from included paragraph--clinic_banner resources.
 * Anonymous JSON:API often omits paragraphs (403) — returns nulls in that case.
 */
function mapBanners(
  bannerParagraphs: JsonApiResource[],
  included: JsonApiResource[],
): MappedClinicBanner {
  const first = bannerParagraphs[0]
  if (!first) {
    return { desktopBannerUrl: null, mobileBannerUrl: null }
  }

  const desktopCandidates = [
    'field_desktop_banner_image',
    'field_clinic_desktop_banner',
    'field_desktop_banner',
    'field_banner_desktop',
  ]
  const mobileCandidates = [
    'field_mobile_banner_image',
    'field_clinic_mobile_banner',
    'field_mobile_banner',
    'field_banner_mobile',
  ]

  let desktopBannerUrl: string | null = null
  let mobileBannerUrl: string | null = null

  for (const field of desktopCandidates) {
    desktopBannerUrl = fileUrlFromRelationship(first, field, included)
    if (desktopBannerUrl) break
  }
  for (const field of mobileCandidates) {
    mobileBannerUrl = fileUrlFromRelationship(first, field, included)
    if (mobileBannerUrl) break
  }

  return { desktopBannerUrl, mobileBannerUrl }
}

function mapWorkingHours(hourParagraphs: JsonApiResource[]): MappedWorkingHoursRow[] {
  return hourParagraphs.map((paragraph) => {
    const attrs = paragraph.attributes as Record<string, unknown>
    return {
      toDoctor: asString(attrs.field_to_doctor) || asString(attrs.field_clinic_hours_to_doctor),
      clinicDays: asString(attrs.field_clinic_days) || asString(attrs.field_days),
      clinicHours: asString(attrs.field_clinic_hours) || asString(attrs.field_hours),
      mobileNumber: asString(attrs.field_mobile_number) || asString(attrs.field_clinic_mobile_number),
      instructions: asString(attrs.field_instructions),
      priorityRule: asString(attrs.field_priority_rule) || asString(attrs.field_priority_rules),
      specialtyKeyword: asString(attrs.field_specialty_keyword),
      ageGroup: asString(attrs.field_age_group),
      priorityLevel: asString(attrs.field_priority_level),
      priorityScore: asNumber(attrs.field_priority_score),
      appointmentClinicNumber:
        asString(attrs.field_appointment_clinic_number) ||
        asString(attrs.field_appointment_number),
    }
  })
}

function mapSeo(seoParagraphs: JsonApiResource[]): MappedClinic['seo'] {
  const first = seoParagraphs[0]
  if (!first) {
    return {
      metaTitle: null,
      metaDescription: null,
      metaKeywords: null,
      crawlingDisabled: false,
    }
  }
  const attrs = first.attributes as Record<string, unknown>
  return {
    metaTitle: asString(attrs.field_meta_title) || asString(attrs.field_seo_meta_title),
    metaDescription:
      asString(attrs.field_meta_description) || asString(attrs.field_seo_meta_description),
    metaKeywords: asString(attrs.field_meta_keywords) || asString(attrs.field_seo_meta_keywords),
    crawlingDisabled: Boolean(attrs.field_crawling || attrs.field_crawling_disabled),
  }
}

function mapYoutube(videos: JsonApiResource[]): MappedClinic['youtubeVideos'] {
  return videos.map((video) => {
    const attrs = video.attributes as Record<string, unknown>
    return {
      embedUrl:
        asString(attrs.field_youtube_embede) ||
        asString(attrs.field_youtube_embed) ||
        asString(attrs.field_youtube_url),
      title: asString(attrs.field_about_video_title) || asString(attrs.field_title),
      description:
        asString(attrs.field_about_video_description) || asString(attrs.field_description),
    }
  })
}

function samAiEnabled(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v === '1' || v === 'true' || v === 'enabled'
  }
  return false
}

/**
 * Map a taxonomy_term--clinic JSON:API resource (+ included) into our sync Clinic type.
 */
export function mapDrupalClinicResource(
  resource: DrupalClinicResource,
  included: JsonApiResource[] = [],
): MappedClinic {
  if (resource.type !== 'taxonomy_term--clinic') {
    throw new Error(`clinic-mapper: expected taxonomy_term--clinic, got ${resource.type}`)
  }

  const attrs = resource.attributes
  const tid = attrs.drupal_internal__tid
  const name = attrs.name?.trim()
  if (!name) {
    throw new Error(`clinic-mapper: clinic ${resource.id} is missing attributes.name`)
  }

  const phone = (attrs.field_clinic_phone_number || '').toString().trim()
  if (!phone) {
    console.warn(`clinic-mapper: clinic ${resource.id} has empty field_clinic_phone_number`)
  }

  const latitude = asNumber(attrs.field_geo_latitude) ?? 0
  const longitude = asNumber(attrs.field_geo_longitude) ?? 0

  const logoRef = getRelationshipData(resource, 'field_clinic_logo')
  const logoResource =
    logoRef && !Array.isArray(logoRef) ? resolveIncluded(logoRef, included) : null
  const logoUrl = absoluteFileUrl(logoResource)

  const specialityRefs = getRelationshipData(resource, 'field_speciality')
  const specialityResources = Array.isArray(specialityRefs)
    ? resolveIncludedMany(specialityRefs, included)
    : specialityRefs
      ? resolveIncludedMany([specialityRefs], included)
      : []

  const specialities = specialityResources.map((term) => ({
    uuid: term.id,
    name: String((term.attributes as { name?: string }).name ?? term.id),
  }))

  const resolveRelMany = (field: string) => {
    const refs = getRelationshipData(resource, field)
    if (Array.isArray(refs)) return resolveIncludedMany(refs, included)
    if (refs) return resolveIncludedMany([refs], included)
    return []
  }

  const bannerParagraphs = resolveRelMany('field_clinic_banners').filter(
    (item) => item.type === 'paragraph--clinic_banner',
  )
  const hourParagraphs = resolveRelMany('field_clinic_working_hours').filter(
    (item) => item.type === 'paragraph--clinic_hours',
  )
  const seoParagraphs = resolveRelMany('field_seo_meta').filter(
    (item) => item.type === 'paragraph--meta_tags' || item.type.includes('meta'),
  )
  const youtubeParagraphs = resolveRelMany('field_youtube_video_clinic')

  const parsedAddress = parseDrupalAddress(attrs.field_address, attrs.field_area_served)

  return {
    drupalUuid: resource.id,
    drupalTid: tid,
    name,
    slug: slugFromPathAlias(attrs.path?.alias, tid),
    description: descriptionToText(attrs.description),
    phone,
    email: attrs.field_clinic_email ?? null,
    rating: asNumber(attrs.field_clinic_rating),
    reviewCount: asNumber(attrs.field_review_count),
    priceRange: attrs.field_price_range ?? null,
    areaServed: attrs.field_area_served ?? null,
    instructions: attrs.field_instructions ?? null,
    locationLabel: asString(attrs.field_clinic_location),
    openCloseText: attrs.field_clinic_open_close_text ?? null,
    colorCode: asString(attrs.field_color_code_clinic),
    showBlogs: Boolean(attrs.field_show_clinic_blogs),
    showTestimonials: Boolean(attrs.field_show_clinic_testimonials),
    address: {
      ...parsedAddress,
      latitude,
      longitude,
    },
    mapHtml: attrs.field_clinic_map ?? null,
    logoUrl,
    banners: mapBanners(bannerParagraphs, included),
    workingHours: mapWorkingHours(hourParagraphs),
    specialities,
    seo: mapSeo(seoParagraphs),
    whatsapp: {
      middlewareToken: asString(attrs.field_whatsapp_middleware_token),
      tokenId: asString(attrs.field_whatsapp_token_id),
    },
    clinicSamAi: {
      enabled: samAiEnabled(attrs.field_clinic_sam_ai),
    },
    youtubeVideos: mapYoutube(youtubeParagraphs),
    servicesSection: resolveRelMany('field_our_services_section'),
    specialitiesSection: resolveRelMany('field_our_specialities_section'),
  }
}
