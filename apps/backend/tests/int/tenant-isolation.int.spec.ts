import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  SCOPED_COLLECTIONS,
  assertEmptyOrNotFound,
  assertMultiTenantPluginConfigured,
  createDoc,
  restJson,
  seedIsolationWorld,
  type IsolationFixture,
  type ScopedCollection,
} from '../helpers/tenantIsolation'

/**
 * Tenant isolation suite — runs against docker postgres-test (marline_test).
 * Failures indicate real access-control gaps; do not loosen assertions.
 */

const REST_BASE = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

let payload: Payload
let fixture: IsolationFixture
let restAvailable = false

async function asUserFind(
  collection: ScopedCollection,
  user: IsolationFixture['adminA'],
  where?: Record<string, unknown>,
) {
  return payload.find({
    collection,
    user,
    overrideAccess: false,
    depth: 0,
    limit: 100,
    where: where as never,
  })
}

async function asUserFindByID(
  collection: ScopedCollection,
  id: number,
  user: IsolationFixture['adminA'],
) {
  try {
    return await payload.findByID({
      collection,
      id,
      user,
      overrideAccess: false,
      depth: 0,
    })
  } catch {
    return null
  }
}

describe('tenant isolation', () => {
  beforeAll(async () => {
    if (process.env.ISOLATION_TEST !== '1') {
      throw new Error(
        'ISOLATION_TEST=1 is required. Run via `pnpm test:isolation` so DATABASE_URL points at marline_test.',
      )
    }

    payload = await getPayload({ config })
    assertMultiTenantPluginConfigured(payload)
    fixture = await seedIsolationWorld(payload)

    try {
      const health = await fetch(`${REST_BASE}/api/tenants?limit=1`)
      restAvailable = health.ok || health.status === 200 || health.status === 403
    } catch {
      restAvailable = false
    }
  }, 120_000)

  afterAll(async () => {
    // Payload postgres pool — best-effort shutdown
    try {
      await payload.db.destroy?.()
    } catch {
      // ignore
    }
  })

  it('hard-fail gate already asserted in beforeAll (plugin + tenant fields)', () => {
    expect(fixture.tenantA.id).toBeTruthy()
    expect(fixture.tenantB.id).toBeTruthy()
  })

  describe.each(SCOPED_COLLECTIONS)('collection: %s', (collection) => {
    it(`isolates CRUD for ${collection}`, async () => {
      // Skip re-creating clinics/hospitals profiles that seed already created when
      // unique slug conflicts are likely — still create an extra doc under A.
      let created: { id: number }
      try {
        created = await createDoc(collection, {
          payload,
          fixture,
          tenantId: fixture.tenantA.id,
          user: fixture.adminA,
          label: `iso-a-${collection}`,
        })
      } catch {
        created = await createDoc(collection, {
          payload,
          fixture,
          tenantId: fixture.tenantA.id,
          user: fixture.superAdmin,
          label: `iso-a-super-${collection}`,
        })
      }

      // adminA can read
      const readA = await asUserFindByID(collection, created.id, fixture.adminA)
      expect(readA).toBeTruthy()
      expect((readA as { id: number }).id).toBe(created.id)

      // adminA can update
      const patch =
        collection === 'faqs'
          ? { answer: 'updated-by-a' }
          : collection === 'testimonials'
            ? { review: 'updated-by-a' }
            : collection === 'hospital-testimonials'
              ? { testimonial: 'updated-by-a' }
              : collection === 'blogs'
                ? { excerpt: 'updated-by-a' }
                : collection === 'articles'
                  ? { excerpt: 'updated-by-a' }
                  : collection === 'media'
                    ? { alt: 'updated-by-a' }
                    : collection === 'doctor-clinic-sessions'
                      ? { consultationDuration: 20 }
                      : collection === 'gallery-images'
                        ? { title: `updated-${collection}` }
                        : collection === 'specialities' ||
                            collection === 'services' ||
                            collection === 'doctors' ||
                            collection === 'clinics' ||
                            collection === 'hospitals' ||
                            collection === 'hospital-doctors' ||
                            collection === 'hospital-specialities'
                          ? { name: `updated-${collection}` }
                          : { title: `updated-${collection}` }

      const updated = await payload.update({
        collection,
        id: created.id,
        data: patch,
        user: fixture.adminA,
        overrideAccess: false,
      })
      expect(updated.id).toBe(created.id)

      // adminB cannot read (empty/null — not a leaking 403 body)
      const readB = await asUserFindByID(collection, created.id, fixture.adminB)
      assertEmptyOrNotFound({ doc: readB, id: readB ? (readB as { id: number }).id : null })

      // adminB cannot update
      await expect(
        payload.update({
          collection,
          id: created.id,
          data: {},
          user: fixture.adminB,
          overrideAccess: false,
        }),
      ).rejects.toBeTruthy()

      // adminB cannot delete
      await expect(
        payload.delete({
          collection,
          id: created.id,
          user: fixture.adminB,
          overrideAccess: false,
        }),
      ).rejects.toBeTruthy()

      // superAdmin can read/update
      const readSuper = await asUserFindByID(collection, created.id, fixture.superAdmin)
      expect(readSuper).toBeTruthy()

      await payload.update({
        collection,
        id: created.id,
        data: patch,
        user: fixture.superAdmin,
        overrideAccess: false,
      })

      // Public read scoped by tenant filter must not mix B
      const publicA = await payload.find({
        collection,
        overrideAccess: false,
        depth: 0,
        limit: 100,
        where: { tenant: { equals: fixture.tenantA.id } },
      })
      for (const doc of publicA.docs) {
        const tenantRef = (doc as { tenant?: number | { id: number } }).tenant
        const tid = typeof tenantRef === 'object' && tenantRef ? tenantRef.id : tenantRef
        expect(tid).toBe(fixture.tenantA.id)
        expect(tid).not.toBe(fixture.tenantB.id)
      }

      // REST checks when API server is reachable
      if (restAvailable) {
        const restReadA = await restJson(REST_BASE, 'GET', `/api/${collection}/${created.id}`, {
          token: fixture.tokenA,
        })
        expect(restReadA.status).toBe(200)

        const restReadB = await restJson(REST_BASE, 'GET', `/api/${collection}/${created.id}`, {
          token: fixture.tokenB,
        })
        if (restReadB.status === 200 && restReadB.body?.id) {
          expect.fail(
            `REST leaked ${collection}/${created.id} to adminB (status 200). Access control gap.`,
          )
        }
        assertEmptyOrNotFound({
          status: restReadB.status,
          docs: Array.isArray(restReadB.body.docs) ? (restReadB.body.docs as unknown[]) : undefined,
          id: restReadB.body.id,
        })
      }

      // adminA delete (cleanup)
      await payload.delete({
        collection,
        id: created.id,
        user: fixture.adminA,
        overrideAccess: false,
      })
    }, 60_000)
  })

  describe('list/find regression (no explicit tenant where)', () => {
    const listCollections: ScopedCollection[] = ['doctors', 'articles', 'gallery-images']

    it.each(listCollections)(
      'adminA find() on %s returns only Tenant A docs',
      async (collection) => {
        const docA = await createDoc(collection, {
          payload,
          fixture,
          tenantId: fixture.tenantA.id,
          user: fixture.superAdmin,
          label: `list-a-${collection}`,
        })
        const docB = await createDoc(collection, {
          payload,
          fixture,
          tenantId: fixture.tenantB.id,
          user: fixture.superAdmin,
          label: `list-b-${collection}`,
        })

        const listed = await asUserFind(collection, fixture.adminA)
        const ids = listed.docs.map((d) => d.id as number)

        expect(ids).toContain(docA.id)
        expect(ids).not.toContain(docB.id)

        for (const doc of listed.docs) {
          const tenantRef = (doc as { tenant?: number | { id: number } }).tenant
          const tid = typeof tenantRef === 'object' && tenantRef ? tenantRef.id : tenantRef
          // Plugin may omit tenant in select; when present must be A
          if (tid != null) expect(tid).toBe(fixture.tenantA.id)
        }
      },
      60_000,
    )
  })

  describe('legacy FK drift', () => {
    /**
     * If this fails, access checks are reading the legacy `clinic` FK instead of
     * the plugin `tenant` field somewhere.
     */
    const driftCollections: ScopedCollection[] = [
      'articles',
      'faqs',
      'testimonials',
      'doctor-clinic-sessions',
    ]

    it.each(driftCollections)(
      '%s access follows plugin tenant, not legacy clinic FK',
      async (collection) => {
        // Create a valid Tenant-B-owned doc first.
        const base = await createDoc(collection, {
          payload,
          fixture,
          tenantId: fixture.tenantB.id,
          user: fixture.superAdmin,
          label: `drift-base-${collection}`,
        })

        // Plugin relationship filters reject mismatched clinic via Local API even with
        // overrideAccess:true. Force a bad backfill at the DB layer to simulate drift.
        const { default: pg } = await import('pg')
        const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
        await client.connect()
        try {
          // Payload postgres table names typically match collection slugs with underscores
          const table = collection.replace(/-/g, '_')
          await client.query(`UPDATE "${table}" SET clinic_id = $1 WHERE id = $2`, [
            fixture.clinicA.id,
            base.id,
          ])
        } finally {
          await client.end()
        }

        // Confirm stored shape: tenant still B, clinic FK now A
        const stored = await payload.findByID({
          collection,
          id: base.id,
          depth: 0,
          overrideAccess: true,
        })
        const storedTenant =
          typeof stored.tenant === 'object' && stored.tenant
            ? (stored.tenant as { id: number }).id
            : stored.tenant
        const storedClinic =
          typeof (stored as { clinic?: unknown }).clinic === 'object' &&
          (stored as { clinic?: { id: number } }).clinic
            ? (stored as { clinic: { id: number } }).clinic.id
            : (stored as { clinic?: number }).clinic
        expect(storedTenant).toBe(fixture.tenantB.id)
        expect(storedClinic).toBe(fixture.clinicA.id)

        const readA = await asUserFindByID(collection, base.id, fixture.adminA)
        assertEmptyOrNotFound({ doc: readA })

        const readB = await asUserFindByID(collection, base.id, fixture.adminB)
        expect(readB).toBeTruthy()
      },
      60_000,
    )
  })

  describe('frontend resolveTenant -> findForTenant regression', () => {
    it('clinic A REST shape never includes Tenant B ids', async () => {
      await createDoc('doctors', {
        payload,
        fixture,
        tenantId: fixture.tenantA.id,
        user: fixture.superAdmin,
        label: 'fe-doc-a',
      })
      await createDoc('doctors', {
        payload,
        fixture,
        tenantId: fixture.tenantB.id,
        user: fixture.superAdmin,
        label: 'fe-doc-b',
      })
      await createDoc('articles', {
        payload,
        fixture,
        tenantId: fixture.tenantA.id,
        user: fixture.superAdmin,
        label: 'fe-art-a',
      })
      await createDoc('articles', {
        payload,
        fixture,
        tenantId: fixture.tenantB.id,
        user: fixture.superAdmin,
        label: 'fe-art-b',
      })

      // Mirror apps/frontend/src/lib/api/tenants.ts resolveTenant
      const tenants = await payload.find({
        collection: 'tenants',
        depth: 0,
        limit: 1,
        overrideAccess: false,
        where: {
          and: [
            { type: { equals: 'clinic' } },
            { slug: { equals: fixture.tenantA.slug } },
            { status: { equals: 'active' } },
          ],
        },
      })
      expect(tenants.docs[0]?.id).toBe(fixture.tenantA.id)

      // Mirror findForTenant for clinics + related content at depth 2
      const related: ScopedCollection[] = [
        'clinics',
        'doctors',
        'doctor-clinic-sessions',
        'articles',
        'testimonials',
        'faqs',
      ]

      for (const collection of related) {
        const docs = await payload.find({
          collection,
          depth: 2,
          limit: 50,
          pagination: false,
          overrideAccess: false,
          where: { tenant: { equals: fixture.tenantA.id } },
        })

        for (const doc of docs.docs) {
          const tenantRef = (doc as { tenant?: number | { id: number } }).tenant
          const tid = typeof tenantRef === 'object' && tenantRef ? tenantRef.id : tenantRef
          expect(tid, `${collection} doc ${doc.id} missing/wrong tenant`).toBe(fixture.tenantA.id)
          expect(tid).not.toBe(fixture.tenantB.id)
        }
      }

      if (restAvailable) {
        const resolve = await restJson(REST_BASE, 'GET', '/api/tenants', {
          query: {
            'where[and][0][type][equals]': 'clinic',
            'where[and][1][slug][equals]': fixture.tenantA.slug,
            'where[and][2][status][equals]': 'active',
            limit: 1,
            depth: 0,
          },
        })
        expect(resolve.status).toBe(200)
        const docs = (resolve.body.docs as Array<{ id: number }>) || []
        expect(docs[0]?.id).toBe(fixture.tenantA.id)

        const doctors = await restJson(REST_BASE, 'GET', '/api/doctors', {
          query: {
            'where[tenant][equals]': fixture.tenantA.id,
            depth: 2,
            limit: 50,
            pagination: false,
          },
        })
        const doctorDocs = (doctors.body.docs as Array<{ tenant?: number | { id: number } }>) || []
        for (const doc of doctorDocs) {
          const tenantRef = doc.tenant
          const tid = typeof tenantRef === 'object' && tenantRef ? tenantRef.id : tenantRef
          if (tid != null) expect(tid).toBe(fixture.tenantA.id)
        }
      }
    }, 90_000)
  })
})
