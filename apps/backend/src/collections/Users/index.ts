import type { CollectionConfig } from 'payload'

import { authenticated, isSuperAdmin } from '../../access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
    read: authenticated,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (!data || operation !== 'create') return data
        // First platform user must be super_admin or Tenants admin UI is inaccessible.
        const existing = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
        })
        if (existing.totalDocs === 0) {
          data.role = 'super_admin'
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'super_admin',
      // Required so multi-tenant plugin access (userHasAccessToAllTenants) sees role on req.user
      saveToJWT: true,
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin', value: 'admin' },
      ],
      admin: {
        description: 'Super admins see all tenants. Admins only see assigned tenants.',
      },
      access: {
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
    },
  ],
  timestamps: true,
}
