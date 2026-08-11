import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'admin',
      options: [
        { label: 'Super Admin', value: 'super_admin' },
        { label: 'Admin', value: 'admin' },
      ],
      admin: {
        description: 'Super admins can manage all hospitals regardless of access mode.',
      },
    },
    {
      name: 'assignedHospitals',
      type: 'relationship',
      relationTo: 'hospitals',
      hasMany: true,
      admin: {
        description: 'Hospitals this user can manage (only used in dedicated access mode)',
      },
    },
  ],
  timestamps: true,
}
