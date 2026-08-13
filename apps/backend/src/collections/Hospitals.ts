import type { CollectionConfig } from 'payload'

import { authenticated, anyone } from '../access'
import { revalidateFrontendTenantPath } from '../hooks/revalidateFrontend'

export const Hospitals: CollectionConfig = {
  slug: 'hospitals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'template'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateFrontendTenantPath],
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
      index: true,
      admin: { description: 'Must match the parent tenant slug' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Hospital tagline or slogan' },
    },
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'aspire-style',
      options: [
        { label: 'Aspire Style', value: 'aspire-style' },
        { label: 'Modern Clinical', value: 'modern-clinical' },
        { label: 'Minimal (coming soon)', value: 'minimal' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main hero banner image' },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'whatsappNumber',
      type: 'text',
    },
    {
      name: 'linqmdBookingSlug',
      type: 'text',
      required: true,
      admin: { description: 'Slug for linqmd.com/hospital/{slug} booking link' },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'line1', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
      ],
    },
  ],
}
