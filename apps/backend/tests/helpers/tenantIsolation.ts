import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload, TypedUser } from 'payload'
import { expect } from 'vitest'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const FIXTURE_PNG = path.resolve(__dirname, '../fixtures/pixel.png')

export const SCOPED_COLLECTIONS = [
  'clinics',
  'hospitals',
  'doctors',
  'doctor-clinic-sessions',
  'specialities',
  'services',
  'articles',
  'testimonials',
  'faqs',
  'hospital-doctors',
  'hospital-specialities',
  'hospital-testimonials',
  'blogs',
  'gallery-images',
  'media',
] as const

export type ScopedCollection = (typeof SCOPED_COLLECTIONS)[number]

export const lexicalParagraph = (text = 'isolation test') => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export type IsolationFixture = {
  tenantA: { id: number; slug: string; type: 'clinic' }
  tenantB: { id: number; slug: string; type: 'hospital' }
  clinicA: { id: number; slug: string }
  /** Clinics-collection profile owned by tenant B (needed for legacy clinic FK under B). */
  clinicOwnedByB: { id: number; slug: string }
  hospitalB: { id: number; slug: string }
  adminA: TypedUser
  adminB: TypedUser
  superAdmin: TypedUser
  tokenA: string
  tokenB: string
  tokenSuper: string
  mediaA: { id: number }
  mediaB: { id: number }
}

function fieldNames(collection: { fields?: unknown[] }): string[] {
  const names: string[] = []
  const walk = (fields: unknown[]) => {
    for (const field of fields) {
      if (!field || typeof field !== 'object') continue
      const f = field as Record<string, unknown>
      if (typeof f.name === 'string') names.push(f.name)
      if (Array.isArray(f.fields)) walk(f.fields)
      if (Array.isArray(f.tabs)) {
        for (const tab of f.tabs as Array<{ fields?: unknown[] }>) {
          if (Array.isArray(tab.fields)) walk(tab.fields)
        }
      }
      if (f.type === 'group' && Array.isArray(f.fields)) walk(f.fields as unknown[])
      if (f.type === 'array' && Array.isArray(f.fields)) walk(f.fields as unknown[])
    }
  }
  walk(collection.fields || [])
  return names
}

/**
 * Hard-fail if multi-tenant plugin wiring is incomplete.
 * Throws with the exact missing collection/field — never skip.
 */
export function assertMultiTenantPluginConfigured(payload: Payload): void {
  const config = payload.config
  const slugs = config.collections.map((c) => c.slug)

  if (!slugs.includes('tenants')) {
    throw new Error(
      'multi-tenant plugin misconfigured: collections does not include `tenants`',
    )
  }

  const pluginPresent = (config.plugins || []).some((plugin) => {
    const name = (plugin as { name?: string }).name || ''
    return name.toLowerCase().includes('multi-tenant') || name.toLowerCase().includes('multitenant')
  })

  // Plugin may not expose a stable name; also accept evidence of injection on users/collections
  const users = config.collections.find((c) => c.slug === 'users')
  if (!users) {
    throw new Error('multi-tenant plugin misconfigured: users collection missing')
  }
  const userFields = fieldNames(users)
  if (!userFields.includes('tenants')) {
    throw new Error(
      'multi-tenant plugin misconfigured: users collection is missing `tenants` array field',
    )
  }

  for (const slug of SCOPED_COLLECTIONS) {
    const collection = config.collections.find((c) => c.slug === slug)
    if (!collection) {
      throw new Error(
        `multi-tenant plugin misconfigured: scoped collection \`${slug}\` is not registered`,
      )
    }
    const names = fieldNames(collection)
    if (!names.includes('tenant')) {
      throw new Error(
        `multi-tenant plugin misconfigured: collection \`${slug}\` is missing injected \`tenant\` field`,
      )
    }
  }

  if (!pluginPresent) {
    // Still OK if fields were injected (some Payload builds omit plugin.name)
    // but log via throw only when fields missing — already checked above.
  }
}

async function login(
  payload: Payload,
  email: string,
  password: string,
): Promise<{ user: TypedUser; token: string }> {
  const result = await payload.login({
    collection: 'users',
    data: { email, password },
  })
  if (!result.token || !result.user) {
    throw new Error(`Login failed for ${email}`)
  }
  return { user: result.user as TypedUser, token: result.token }
}

async function createMedia(
  payload: Payload,
  tenantId: number,
  user: TypedUser,
  suffix: string,
): Promise<{ id: number }> {
  const buffer = fs.readFileSync(FIXTURE_PNG)
  const doc = await payload.create({
    collection: 'media',
    data: {
      alt: `pixel-${suffix}`,
      tenant: tenantId,
    },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name: `pixel-${suffix}.png`,
      size: buffer.length,
    },
    user,
    overrideAccess: false,
  })
  return { id: doc.id as number }
}

const address = {
  line1: '1 Test Street',
  city: 'Bengaluru',
  state: 'KA',
  postalCode: '560001',
  latitude: 12.97,
  longitude: 77.59,
}

/**
 * Seed Tenant A (clinic) + Tenant B (hospital), three users, and shared media.
 */
export async function seedIsolationWorld(payload: Payload): Promise<IsolationFixture> {
  const suffix = `${Date.now()}`

  const tenantA = await payload.create({
    collection: 'tenants',
    data: {
      name: `Clinic Tenant A ${suffix}`,
      slug: `clinic-a-${suffix}`,
      type: 'clinic',
      status: 'active',
    },
    overrideAccess: true,
  })

  const tenantB = await payload.create({
    collection: 'tenants',
    data: {
      name: `Hospital Tenant B ${suffix}`,
      slug: `hospital-b-${suffix}`,
      type: 'hospital',
      status: 'active',
    },
    overrideAccess: true,
  })

  const password = 'IsolationTest123!'

  const superAdminDoc = await payload.create({
    collection: 'users',
    data: {
      name: 'Super Admin',
      email: `super-${suffix}@example.com`,
      password,
      role: 'super_admin',
    },
    overrideAccess: true,
  })

  const adminADoc = await payload.create({
    collection: 'users',
    data: {
      name: 'Admin A',
      email: `admin-a-${suffix}@example.com`,
      password,
      role: 'admin',
      tenants: [{ tenant: tenantA.id }],
    },
    overrideAccess: true,
  })

  const adminBDoc = await payload.create({
    collection: 'users',
    data: {
      name: 'Admin B',
      email: `admin-b-${suffix}@example.com`,
      password,
      role: 'admin',
      tenants: [{ tenant: tenantB.id }],
    },
    overrideAccess: true,
  })

  const { user: superAdmin, token: tokenSuper } = await login(
    payload,
    superAdminDoc.email,
    password,
  )
  const { user: adminA, token: tokenA } = await login(payload, adminADoc.email, password)
  const { user: adminB, token: tokenB } = await login(payload, adminBDoc.email, password)

  const mediaA = await createMedia(payload, tenantA.id as number, superAdmin, `a-${suffix}`)
  const mediaB = await createMedia(payload, tenantB.id as number, superAdmin, `b-${suffix}`)

  const clinicA = await payload.create({
    collection: 'clinics',
    data: {
      tenant: tenantA.id,
      name: `Clinic Profile A ${suffix}`,
      slug: tenantA.slug,
      phone: '9999999999',
      template: 'classic-teal',
      address,
    },
    user: superAdmin,
    overrideAccess: false,
  })

  const hospitalB = await payload.create({
    collection: 'hospitals',
    data: {
      tenant: tenantB.id,
      name: `Hospital Profile B ${suffix}`,
      slug: tenantB.slug,
      phone: '8888888888',
      template: 'aspire-style',
      linqmdBookingSlug: `book-${suffix}`,
      address,
    },
    user: superAdmin,
    overrideAccess: false,
  })

  const clinicOwnedByB = await payload.create({
    collection: 'clinics',
    data: {
      tenant: tenantB.id,
      name: `Clinic Doc On Tenant B ${suffix}`,
      slug: `clinic-on-b-${suffix}`,
      phone: '8777777777',
      template: 'classic-teal',
      address,
    },
    user: superAdmin,
    overrideAccess: false,
  })

  return {
    tenantA: { id: tenantA.id as number, slug: tenantA.slug, type: 'clinic' },
    tenantB: { id: tenantB.id as number, slug: tenantB.slug, type: 'hospital' },
    clinicA: { id: clinicA.id as number, slug: clinicA.slug },
    clinicOwnedByB: { id: clinicOwnedByB.id as number, slug: clinicOwnedByB.slug },
    hospitalB: { id: hospitalB.id as number, slug: hospitalB.slug },
    adminA,
    adminB,
    superAdmin,
    tokenA,
    tokenB,
    tokenSuper,
    mediaA,
    mediaB,
  }
}

type CreateCtx = {
  payload: Payload
  fixture: IsolationFixture
  tenantId: number
  user: TypedUser
  overrides?: Record<string, unknown>
  label?: string
}

/**
 * Minimal valid document for each scoped collection under a tenant.
 */
export async function createDoc(
  collection: ScopedCollection,
  ctx: CreateCtx,
): Promise<{ id: number }> {
  const { payload, fixture, tenantId, user, overrides = {}, label } = ctx
  const uniq = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const tag = `${label || collection}-${uniq}`
  const mediaId = tenantId === fixture.tenantA.id ? fixture.mediaA.id : fixture.mediaB.id
  const clinicId =
    tenantId === fixture.tenantA.id ? fixture.clinicA.id : fixture.clinicOwnedByB.id

  let data: Record<string, unknown> = { tenant: tenantId }

  switch (collection) {
    case 'media': {
      const buffer = fs.readFileSync(FIXTURE_PNG)
      const doc = await payload.create({
        collection: 'media',
        data: { alt: tag, tenant: tenantId, ...overrides },
        file: {
          data: buffer,
          mimetype: 'image/png',
          name: `${tag}.png`,
          size: buffer.length,
        },
        user,
        overrideAccess: false,
      })
      return { id: doc.id as number }
    }
    case 'clinics':
      data = {
        ...data,
        name: tag,
        slug: `clinic-${tag}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60),
        phone: '9000000000',
        template: 'classic-teal',
        address,
        ...overrides,
      }
      break
    case 'hospitals':
      data = {
        ...data,
        name: tag,
        slug: `hospital-${tag}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60),
        phone: '9000000001',
        template: 'aspire-style',
        linqmdBookingSlug: `book-${tag}`.slice(0, 40),
        address,
        ...overrides,
      }
      break
    case 'doctors':
      data = {
        ...data,
        name: tag,
        slug: `doc-${tag}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60),
        photo: mediaId,
        ...overrides,
      }
      break
    case 'specialities':
      data = {
        ...data,
        name: tag,
        slug: `spec-${tag}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60),
        icon: mediaId,
        ...overrides,
      }
      break
    case 'services':
      data = {
        ...data,
        name: tag,
        image: mediaId,
        ...overrides,
      }
      break
    case 'articles':
      data = {
        ...data,
        title: tag,
        slug: `art-${tag}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60),
        coverImage: mediaId,
        excerpt: 'excerpt',
        clinic: clinicId,
        publishedDate: new Date().toISOString(),
        ...overrides,
      }
      break
    case 'testimonials':
      data = {
        ...data,
        title: tag,
        patientName: 'Patient',
        review: 'Great care',
        clinic: clinicId,
        ...overrides,
      }
      break
    case 'faqs':
      data = {
        ...data,
        question: tag,
        answer: 'Answer',
        clinic: clinicId,
        ...overrides,
      }
      break
    case 'doctor-clinic-sessions': {
      const doctor = await createDoc('doctors', {
        payload,
        fixture,
        tenantId,
        user,
        label: `session-doc-${tag}`,
      })
      data = {
        ...data,
        doctor: doctor.id,
        clinic: clinicId,
        consultationDuration: 15,
        availableDays: ['mon', 'wed'],
        ...overrides,
      }
      break
    }
    case 'hospital-doctors':
      data = {
        ...data,
        name: tag,
        speciality: 'General',
        ...overrides,
      }
      break
    case 'hospital-specialities':
      data = {
        ...data,
        name: tag,
        ...overrides,
      }
      break
    case 'hospital-testimonials':
      data = {
        ...data,
        patientName: 'Patient',
        testimonial: tag,
        ...overrides,
      }
      break
    case 'blogs':
      data = {
        ...data,
        title: tag,
        slug: `blog-${tag}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60),
        content: lexicalParagraph(tag),
        ...overrides,
      }
      break
    case 'gallery-images':
      data = {
        ...data,
        title: tag,
        image: mediaId,
        category: 'other',
        ...overrides,
      }
      break
    default:
      throw new Error(`No createDoc factory for ${collection}`)
  }

  const doc = await payload.create({
    collection,
    data,
    user,
    overrideAccess: false,
  })
  return { id: doc.id as number }
}

/**
 * Assert a read result is empty / not found — not a leaking 403 with a body.
 */
export function assertEmptyOrNotFound(result: {
  status?: number
  docs?: unknown[]
  doc?: unknown
  id?: unknown
  message?: string
  errors?: unknown
}): void {
  if (typeof result.status === 'number') {
    // Prefer not-found / empty over forbidden-with-payload
    if (result.status === 403) {
      expect.fail(
        'Received 403 Forbidden — isolation should prefer empty/404 so existence is not leaked',
      )
    }
    expect([404, 400]).toContain(result.status)
    return
  }

  if (Array.isArray(result.docs)) {
    expect(result.docs.length).toBe(0)
    return
  }

  expect(result.doc ?? result.id ?? null).toBeFalsy()
}

export async function restJson(
  baseUrl: string,
  method: string,
  apiPath: string,
  opts: { token?: string; body?: unknown; query?: Record<string, string | number | boolean> } = {},
): Promise<{ status: number; body: Record<string, unknown> }> {
  const params = new URLSearchParams()
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      params.set(k, String(v))
    }
  }
  const qs = params.toString()
  const url = `${baseUrl}${apiPath}${qs ? `?${qs}` : ''}`
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (opts.token) headers.Authorization = `JWT ${opts.token}`
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(url, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  })

  let body: Record<string, unknown> = {}
  try {
    body = (await res.json()) as Record<string, unknown>
  } catch {
    body = {}
  }
  return { status: res.status, body }
}

/** Collect numeric ids appearing anywhere in a JSON tree. */
export function collectIds(value: unknown, out = new Set<number>()): Set<number> {
  if (value == null) return out
  if (typeof value === 'number' && Number.isFinite(value)) {
    out.add(value)
    return out
  }
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, out)
    return out
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === 'id' && typeof v === 'number') out.add(v)
      else collectIds(v, out)
    }
  }
  return out
}
