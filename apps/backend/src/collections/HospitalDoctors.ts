import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const HospitalDoctors: CollectionConfig = {
  slug: 'hospital-doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'speciality'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'designation', type: 'text' },
    { name: 'speciality', type: 'text' },
    { name: 'experience', type: 'text' },
    { name: 'qualification', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
    {
      name: 'languages',
      type: 'text',
      admin: { description: 'Languages spoken (comma-separated)' },
    },
  ],
}
