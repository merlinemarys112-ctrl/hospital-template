import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Facilities', value: 'facilities' },
        { label: 'Events', value: 'events' },
        { label: 'Awards', value: 'awards' },
        { label: 'Team', value: 'team' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'description', type: 'textarea' },
  ],
}
