import type { CollectionConfig } from 'payload'

export const Specialities: CollectionConfig = {
  slug: 'specialities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'icon'],
  },
  access: {
    read: () => true,
  },
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
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
