import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'title',
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'clinic',
      type: 'relationship',
      relationTo: 'clinics',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
  ],
}
