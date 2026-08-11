import { describe, expect, it } from 'vitest'

import { getUserTenantIds, isSuperAdmin, userHasAccessToAllTenants } from '../../src/access'
import type { User } from '../../src/payload-types'

describe('tenancy access helpers', () => {
  it('identifies super admins', () => {
    const user = { role: 'super_admin' } as User
    expect(isSuperAdmin(user)).toBe(true)
    expect(userHasAccessToAllTenants(user)).toBe(true)
  })

  it('extracts tenant ids from plugin tenants array', () => {
    const user = {
      role: 'admin',
      tenants: [{ tenant: 11 }, { tenant: { id: 22 } }, 33],
    } as unknown as User

    expect(getUserTenantIds(user)).toEqual([11, 22, 33])
  })

  it('returns empty list when unassigned', () => {
    expect(getUserTenantIds({ role: 'admin' } as User)).toEqual([])
  })
})
