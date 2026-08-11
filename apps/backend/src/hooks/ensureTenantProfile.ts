import type { CollectionAfterChangeHook } from 'payload'

type TenantDoc = {
  id: string | number
  name: string
  slug: string
  type: 'clinic' | 'hospital'
  status?: string
}

/**
 * After a tenant is created, ensure a matching clinic/hospital profile exists
 * so the public microsite URL does not 404.
 */
export const ensureTenantProfile: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const tenant = doc as TenantDoc
  if (!tenant?.id || !tenant.slug || !tenant.type) return doc

  const collection = tenant.type === 'hospital' ? 'hospitals' : 'clinics'

  try {
    const existing = await req.payload.find({
      collection: collection as 'hospitals' | 'clinics',
      where: {
        and: [
          { tenant: { equals: tenant.id } },
          { slug: { equals: tenant.slug } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) return doc

    if (tenant.type === 'hospital') {
      await req.payload.create({
        collection: 'hospitals',
        data: {
          tenant: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          template: 'aspire-style',
          phone: '+91 00000 00000',
          linqmdBookingSlug: tenant.slug,
          address: {
            line1: 'Address TBD',
            city: 'City',
            state: 'State',
            postalCode: '000000',
            latitude: 0,
            longitude: 0,
          },
        },
        overrideAccess: true,
        req,
      })
    } else {
      await req.payload.create({
        collection: 'clinics',
        data: {
          tenant: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          template: 'classic-teal',
          phone: '+91 00000 00000',
          address: {
            line1: 'Address TBD',
            city: 'City',
            state: 'State',
            postalCode: '000000',
            latitude: 0,
            longitude: 0,
          },
        } as never,
        overrideAccess: true,
        req,
      })
    }

    req.payload.logger.info(
      `Created stub ${collection} profile for tenant ${tenant.slug}`,
    )
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: `Failed to create stub ${collection} for tenant ${tenant.slug}`,
    })
  }

  return doc
}
