import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const HospitalSpecialities: CollectionConfig = {
  slug: 'hospital-specialities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'icon', type: 'upload', relationTo: 'media' },
  ],
}
