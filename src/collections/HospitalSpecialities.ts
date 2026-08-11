import type { CollectionConfig } from 'payload'

import { hospitalRelatedScopedAccess } from '../access/hospital-access'

export const HospitalSpecialities: CollectionConfig = {
  slug: 'hospital-specialities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'hospital'],
  },
  access: {
    read: () => true,
    create: hospitalRelatedScopedAccess,
    update: hospitalRelatedScopedAccess,
    delete: hospitalRelatedScopedAccess,
  },
  fields: [
    {
      name: 'hospital',
      type: 'relationship',
      relationTo: 'hospitals',
      required: true,
      admin: {
        description: 'Hospital this speciality belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Speciality description' },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Speciality icon' },
    },
  ],
}
