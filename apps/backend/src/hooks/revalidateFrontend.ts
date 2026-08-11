import type { CollectionAfterChangeHook } from 'payload'
import { tenantPublicPath, type TenantType } from '@marline/shared'

import { getBackendEnv } from '@/lib/env'

type TenantDoc = {
  id: string | number
  slug?: string | null
  type?: TenantType | null
}

/**
 * Ask the frontend to revalidate a tenant public path after content changes.
 * Failures are logged and never block the CMS write.
 */
export const revalidateFrontendTenantPath: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
}) => {
  const env = getBackendEnv()
  const secret = process.env.REVALIDATE_SECRET
  if (!env.frontendURL || !secret) return doc

  try {
    let path: string | null = null

    if (String(collection.slug) === 'tenants') {
      const tenant = doc as TenantDoc
      if (tenant.slug && tenant.type) {
        path = tenantPublicPath(tenant.type, tenant.slug)
      }
    } else {
      const tenantRef = (doc as { tenant?: string | number | TenantDoc | null }).tenant
      if (tenantRef != null) {
        const tenantId = typeof tenantRef === 'object' ? tenantRef.id : tenantRef
        const tenant = (await req.payload.findByID({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          collection: 'tenants' as any,
          id: tenantId,
          depth: 0,
          overrideAccess: true,
        })) as TenantDoc

        if (tenant?.slug && tenant?.type) {
          path = tenantPublicPath(tenant.type, tenant.slug)
        }
      }
    }

    if (!path) return doc

    await fetch(`${env.frontendURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        path,
        tag: `tenant:${(doc as { tenant?: unknown }).tenant ?? (doc as TenantDoc).id}`,
      }),
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Frontend revalidation failed' })
  }

  return doc
}
