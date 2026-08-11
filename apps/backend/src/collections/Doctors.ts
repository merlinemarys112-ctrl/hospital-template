import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tagline', 'experienceYears'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'experienceYears',
      type: 'number',
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'specialities',
      type: 'relationship',
      relationTo: 'specialities',
      hasMany: true,
    },
    {
      name: 'bio',
      type: 'richText',
    },
  ],
}
