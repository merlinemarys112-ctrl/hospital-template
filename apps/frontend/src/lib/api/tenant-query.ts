import { apiGet } from '@/lib/api/client'

type PayloadListResponse<T> = {
  docs: T[]
}

type Id = string | number

type FindForTenantArgs = {
  collection: string
  tenantId: Id
  limit?: number
  depth?: number
  sort?: string
  /** Additional equals constraints ANDed with tenant */
  equals?: Record<string, string | number | boolean>
  tags?: string[]
}

/**
 * Always scopes Payload collection queries to a tenant id.
 * Public pages must use this for all tenant-owned collections.
 */
export async function findForTenant<T>(args: FindForTenantArgs): Promise<T[]> {
  const query: Record<string, string | number | boolean> = {
    limit: args.limit ?? 50,
    depth: args.depth ?? 1,
    pagination: false,
  }

  if (args.sort) query.sort = args.sort

  const extras = args.equals ? Object.entries(args.equals) : []

  if (extras.length === 0) {
    query['where[tenant][equals]'] = args.tenantId
  } else {
    query['where[and][0][tenant][equals]'] = args.tenantId
    extras.forEach(([key, value], index) => {
      query[`where[and][${index + 1}][${key}][equals]`] = value
    })
  }

  const data = await apiGet<PayloadListResponse<T>>(`/api/${args.collection}`, {
    query,
    next: {
      revalidate: 60,
      tags: args.tags ?? [`tenant:${args.tenantId}:${args.collection}`],
    },
  })

  return data.docs
}

/** Fetch the single profile doc for a tenant (clinics / hospitals isGlobal). */
export async function findProfileForTenant<T>(args: {
  collection: 'clinics' | 'hospitals'
  tenantId: Id
  slug: string
  depth?: number
}): Promise<T | null> {
  const docs = await findForTenant<T>({
    collection: args.collection,
    tenantId: args.tenantId,
    limit: 1,
    depth: args.depth ?? 2,
    equals: { slug: args.slug },
    tags: [`tenant:${args.tenantId}:${args.collection}`],
  })
  return docs[0] ?? null
}
