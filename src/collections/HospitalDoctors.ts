import type { CollectionConfig } from 'payload'

import { hospitalRelatedScopedAccess } from '../access/hospital-access'

export const HospitalDoctors: CollectionConfig = {
  slug: 'hospital-doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'speciality', 'hospital'],
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
        description: 'Hospital this doctor belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'designation',
      type: 'text',
      admin: { description: 'Doctor designation or title' },
    },
    {
      name: 'speciality',
      type: 'text',
      admin: { description: 'Doctor speciality' },
    },
    {
      name: 'experience',
      type: 'text',
      admin: { description: 'Years of experience' },
    },
    {
      name: 'qualification',
      type: 'text',
      admin: { description: 'Medical qualification' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Doctor profile image' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Doctor bio or description' },
    },
    {
      name: 'languages',
      type: 'text',
      admin: { description: 'Languages spoken (comma-separated)' },
    },
  ],
}
