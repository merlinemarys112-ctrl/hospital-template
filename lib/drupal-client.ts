const DEFAULT_BASE_URL = 'https://www.linqmd.com'

const CLINIC_TYPE = 'taxonomy_term--clinic'
const DOCTOR_TEAM_TYPE = 'node--doctor_s_team'
const DOCTOR_TEAM_MEMBER_TYPE = 'paragraph--doctor_team'

const CLINIC_INCLUDE = [
  'field_clinic_banners',
  'field_clinic_banners.field_desktop_banner_image',
  'field_clinic_banners.field_mobile_banner_image',
  'field_clinic_logo',
  'field_clinic_working_hours',
  'field_our_services_section',
  'field_our_specialities_section',
  'field_speciality',
  'field_seo_meta',
  'field_youtube_video_clinic',
  'field_symptom_collector',
  'field_bot_language_configuration',
].join(',')

// ---------------------------------------------------------------------------
// JSON:API base shapes
// ---------------------------------------------------------------------------

export type JsonApiResourceIdentifier = {
  type: string
  id: string
  meta?: {
    alt?: string
    width?: number
    height?: number
    [key: string]: unknown
  }
}

export type JsonApiRelationship =
  | { data: JsonApiResourceIdentifier | null }
  | { data: JsonApiResourceIdentifier[] | null }

export type JsonApiResource<TAttributes = Record<string, unknown>> = {
  type: string
  id: string
  attributes: TAttributes
  relationships?: Record<string, JsonApiRelationship>
  links?: Record<string, unknown>
}

export type JsonApiDocument<TData> = {
  data: TData
  included?: JsonApiResource[]
  links?: {
    self?: { href?: string } | string
    next?: { href?: string } | string
    prev?: { href?: string } | string
  }
  meta?: Record<string, unknown>
  errors?: Array<{ title?: string; detail?: string; status?: string }>
}

// ---------------------------------------------------------------------------
// Confirmed clinic attributes (taxonomy_term--clinic)
// ---------------------------------------------------------------------------

export type DrupalClinicAttributes = {
  name: string
  description?: unknown
  weight?: number
  status?: boolean
  path?: {
    alias?: string | null
    pid?: number | null
    langcode?: string | null
  } | null
  drupal_internal__tid: number
  field_address?: string | null
  field_area_served?: string | null
  field_clinic_email?: string | null
  field_clinic_phone_number?: string | null
  field_clinic_rating?: number | string | null
  field_geo_latitude?: number | string | null
  field_geo_longitude?: number | string | null
  field_price_range?: string | null
  field_review_count?: number | string | null
  field_instructions?: string | null
  field_clinic_open_close_text?: string | null
  /** Raw iframe HTML string */
  field_clinic_map?: string | null
  field_show_clinic_blogs?: boolean | null
  field_show_clinic_testimonials?: boolean | null
  field_clinic_location?: string | null
  field_clinic_sam_ai?: boolean | string | number | null
  field_color_code_clinic?: string | null
  field_whatsapp_middleware_token?: string | null
  field_whatsapp_token_id?: string | null
  [key: string]: unknown
}

export type DrupalClinicResource = JsonApiResource<DrupalClinicAttributes>

/**
 * Doctor team node — wrapper only. Per-doctor fields live on
 * paragraph--doctor_team members (field names unconfirmed).
 */
export type DrupalDoctorTeamAttributes = {
  title?: string
  status?: boolean
  path?: {
    alias?: string | null
  } | null
  drupal_internal__nid?: number
  [key: string]: unknown
}

export type DrupalDoctorTeamResource = JsonApiResource<DrupalDoctorTeamAttributes>

/**
 * Unconfirmed paragraph--doctor_team attributes.
 * TODO: replace with a strict interface once a real payload is inspected.
 */
export type DrupalDoctorTeamMemberAttributes = Record<string, unknown>

export type DrupalDoctorTeamMemberResource = JsonApiResource<DrupalDoctorTeamMemberAttributes>

export type DrupalFileAttributes = {
  filename?: string
  filemime?: string
  filesize?: number
  uri?: {
    value?: string
    url?: string
  } | null
  url?: string
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Client helpers
// ---------------------------------------------------------------------------

export function getDrupalBaseUrl(): string {
  return (process.env.DRUPAL_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
}

function linkHref(link: { href?: string } | string | undefined): string | null {
  if (!link) return null
  if (typeof link === 'string') return link
  return link.href ?? null
}

async function jsonApiFetch<TData>(urlOrPath: string): Promise<JsonApiDocument<TData>> {
  const baseUrl = getDrupalBaseUrl()
  const url = urlOrPath.startsWith('http')
    ? urlOrPath
    : `${baseUrl}${urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(`Drupal JSON:API network failure for ${url}: ${message}`)
  }

  if (!response.ok) {
    console.error(`[drupal-client] ${response.status} ${url}`)
    throw new Error(`Drupal JSON:API request failed (${response.status}) for ${url}`)
  }

  const json = (await response.json()) as JsonApiDocument<TData>

  if (json.errors?.length) {
    const detail = json.errors.map((e) => e.detail || e.title || 'unknown').join('; ')
    throw new Error(`Drupal JSON:API error response for ${url}: ${detail}`)
  }

  return json
}

/**
 * Resolve a JSON:API relationship data ref against the document's `included` array.
 */
export function resolveIncluded(
  ref: JsonApiResourceIdentifier | null | undefined,
  included: JsonApiResource[] | undefined,
): JsonApiResource | null {
  if (!ref || !included?.length) return null
  return included.find((item) => item.type === ref.type && item.id === ref.id) ?? null
}

export function resolveIncludedMany(
  refs: JsonApiResourceIdentifier[] | null | undefined,
  included: JsonApiResource[] | undefined,
): JsonApiResource[] {
  if (!refs?.length) return []
  return refs
    .map((ref) => resolveIncluded(ref, included))
    .filter((item): item is JsonApiResource => item !== null)
}

export function getRelationshipData(
  resource: JsonApiResource,
  field: string,
): JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null {
  const rel = resource.relationships?.[field]
  if (!rel) return null
  return rel.data
}

function assertResourceType(resource: JsonApiResource, expected: string, context: string): void {
  if (resource.type !== expected) {
    throw new Error(
      `Unexpected JSON:API type in ${context}: expected "${expected}", got "${resource.type}" (id=${resource.id})`,
    )
  }
}

async function fetchAllPages<TResource extends JsonApiResource>(
  initialPath: string,
  expectedType: string,
): Promise<{ data: TResource[]; included: JsonApiResource[] }> {
  const data: TResource[] = []
  const includedByKey = new Map<string, JsonApiResource>()

  let nextUrl: string | null = initialPath

  while (nextUrl) {
    const doc: JsonApiDocument<TResource[]> = await jsonApiFetch<TResource[]>(nextUrl)
    const pageData = Array.isArray(doc.data) ? doc.data : []

    for (const item of pageData) {
      assertResourceType(item, expectedType, 'collection page')
      data.push(item)
    }

    for (const item of doc.included ?? []) {
      includedByKey.set(`${item.type}:${item.id}`, item)
    }

    nextUrl = linkHref(doc.links?.next)
  }

  return { data, included: Array.from(includedByKey.values()) }
}

/**
 * Absolute URL for a Drupal file--file resource (relative paths joined to base URL).
 */
export function absoluteFileUrl(file: JsonApiResource | null): string | null {
  if (!file || file.type !== 'file--file') return null
  const attrs = file.attributes as DrupalFileAttributes
  const raw =
    (typeof attrs.url === 'string' && attrs.url) ||
    (typeof attrs.uri?.url === 'string' && attrs.uri.url) ||
    null

  if (!raw) return null
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return `${getDrupalBaseUrl()}${raw.startsWith('/') ? raw : `/${raw}`}`
}

// ---------------------------------------------------------------------------
// Public fetch API
// ---------------------------------------------------------------------------

export type ClinicListResult = {
  data: DrupalClinicResource[]
  included: JsonApiResource[]
}

export type ClinicDetailResult = {
  data: DrupalClinicResource
  included: JsonApiResource[]
}

export type DoctorTeamsResult = {
  data: DrupalDoctorTeamResource[]
  included: JsonApiResource[]
  /** Convenience: included entries with type paragraph--doctor_team */
  doctorTeamMembers: DrupalDoctorTeamMemberResource[]
}

/** Fetch all clinics (taxonomy_term--clinic), following links.next pagination. */
export async function fetchClinics(): Promise<ClinicListResult> {
  const path = `/jsonapi/taxonomy_term/clinic`
  return fetchAllPages<DrupalClinicResource>(path, CLINIC_TYPE)
}

/** Fetch one clinic by UUID with related banners, logo, hours, services, specialities. */
export async function fetchClinicByUuid(uuid: string): Promise<ClinicDetailResult> {
  const path = `/jsonapi/taxonomy_term/clinic/${uuid}?include=${encodeURIComponent(CLINIC_INCLUDE)}`
  const doc = await jsonApiFetch<DrupalClinicResource>(path)

  if (!doc.data || Array.isArray(doc.data)) {
    throw new Error(`Expected a single clinic resource for uuid=${uuid}`)
  }

  assertResourceType(doc.data, CLINIC_TYPE, `fetchClinicByUuid(${uuid})`)

  return {
    data: doc.data,
    included: doc.included ?? [],
  }
}

/**
 * Fetch a single clinic WITHOUT ?include= and dump every relationship key.
 * Used to investigate where clinic ↔ doctor_s_team linkage lives (not on the team side).
 */
export async function fetchClinicByUuidRaw(uuid: string): Promise<DrupalClinicResource> {
  const path = `/jsonapi/taxonomy_term/clinic/${uuid}`
  const doc = await jsonApiFetch<DrupalClinicResource>(path)

  if (!doc.data || Array.isArray(doc.data)) {
    throw new Error(`Expected a single clinic resource for uuid=${uuid}`)
  }

  assertResourceType(doc.data, CLINIC_TYPE, `fetchClinicByUuidRaw(${uuid})`)

  const relationshipKeys = Object.keys(doc.data.relationships ?? {})
  console.log(`[drupal-client] DEBUG clinic ${uuid} relationship keys:`, relationshipKeys)
  console.log(
    `[drupal-client] DEBUG clinic ${uuid} full relationships block:`,
    JSON.stringify(doc.data.relationships ?? {}, null, 2),
  )

  return doc.data
}

/**
 * Fetch all doctor team nodes with member paragraphs + doctor images included.
 * Nested include pulls file--file so photo URLs resolve without a second request.
 */
export async function fetchDoctorTeams(): Promise<DoctorTeamsResult> {
  const path = `/jsonapi/node/doctor_s_team?include=${encodeURIComponent(
    'field_doctor_team_member,field_doctor_team_member.field_doctor_image',
  )}`
  const { data, included } = await fetchAllPages<DrupalDoctorTeamResource>(path, DOCTOR_TEAM_TYPE)

  const doctorTeamMembers = included.filter(
    (item): item is DrupalDoctorTeamMemberResource => item.type === DOCTOR_TEAM_MEMBER_TYPE,
  )

  return { data, included, doctorTeamMembers }
}
