import type { CollectionConfig } from 'payload'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Gallery image' },
    },
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
      admin: { description: 'Image category' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Image description or caption' },
    },
  ],
}
