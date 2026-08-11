import type { User } from '@/payload-types'

export { anyone } from './anyone'
export { authenticated } from './authenticated'
export { authenticatedOrPublished } from './authenticatedOrPublished'

/** Super admins manage the entire platform */
export const isSuperAdmin = (user: User | null | undefined): boolean =>
  Boolean(user && user.role === 'super_admin')

/**
 * Extract tenant IDs assigned via the multi-tenant plugin `tenants` array field.
 */
export function getUserTenantIds(user: User | null | undefined): Array<string | number> {
  if (!user) return []

  const tenants = (user as User & { tenants?: Array<{ tenant?: unknown } | string | number> })
    .tenants
  if (!Array.isArray(tenants) || tenants.length === 0) return []

  return tenants
    .map((row) => {
      if (row == null) return null
      if (typeof row === 'string' || typeof row === 'number') return row
      const tenant = row.tenant
      if (tenant == null) return null
      if (typeof tenant === 'object' && tenant !== null && 'id' in tenant) {
        return (tenant as { id: string | number }).id
      }
      if (typeof tenant === 'string' || typeof tenant === 'number') return tenant
      return null
    })
    .filter((id): id is string | number => id !== null)
}

export const userHasAccessToAllTenants = (user: User | null | undefined): boolean =>
  isSuperAdmin(user)
