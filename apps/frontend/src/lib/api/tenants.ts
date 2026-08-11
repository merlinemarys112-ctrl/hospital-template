import type { TenantType } from '@marline/shared'

import { apiGet } from '@/lib/api/client'

export type TenantDoc = {
  id: string | number
  name: string
  slug: string
  type: TenantType
  status: 'active' | 'inactive'
}

type PayloadListResponse<T> = {
  docs: T[]
  totalDocs: number
  hasNextPage: boolean
  page?: number
}

/**
 * Resolve an active tenant by type + slug.
 * This is the only supported entry point for public microsite routing.
 */
export async function resolveTenant(args: {
  type: TenantType
  slug: string
}): Promise<TenantDoc | null> {
  const data = await apiGet<PayloadListResponse<TenantDoc>>('/api/tenants', {
    query: {
      'where[and][0][type][equals]': args.type,
      'where[and][1][slug][equals]': args.slug,
      'where[and][2][status][equals]': 'active',
      limit: 1,
      depth: 0,
    },
    next: { revalidate: 60, tags: [`tenant:${args.type}:${args.slug}`] },
  })

  return data.docs[0] ?? null
}

/** Paginate tenant slugs for generateStaticParams */
export async function listTenantSlugs(type: TenantType, pageSize = 100): Promise<string[]> {
  const slugs: string[] = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const data = await apiGet<PayloadListResponse<Pick<TenantDoc, 'slug'>>>('/api/tenants', {
      query: {
        'where[and][0][type][equals]': type,
        'where[and][1][status][equals]': 'active',
        limit: pageSize,
        page,
        depth: 0,
        select: 'slug',
      },
      next: { revalidate: 300, tags: [`tenants:${type}`] },
    })

    for (const doc of data.docs) {
      if (doc.slug) slugs.push(doc.slug)
    }

    hasNextPage = Boolean(data.hasNextPage)
    page += 1
    if (page > 50) break // hard safety for misconfigured APIs
  }

  return slugs
}
