import type { CollectionConfig } from 'payload'

import { hospitalScopedAccess } from '../access/hospital-access'

export const Hospitals: CollectionConfig = {
  slug: 'hospitals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'template', 'accessMode'],
  },
  access: {
    read: () => true,
    create: hospitalScopedAccess,
    update: hospitalScopedAccess,
    delete: hospitalScopedAccess,
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
      admin: { description: 'e.g. aspire-childrens' },
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
        { label: 'Minimal (coming soon)', value: 'minimal' },
      ],
      admin: {
        description: 'Controls which site template renders this hospital.',
      },
    },
    {
      name: 'accessMode',
      type: 'select',
      required: true,
      defaultValue: 'centralized',
      options: [
        { label: 'Centralized (Global Admin)', value: 'centralized' },
        { label: 'Dedicated (Hospital-Specific Admin)', value: 'dedicated' },
      ],
      admin: {
        description: 'Centralized: Any admin can manage this hospital. Dedicated: Only assigned hospital admins can manage.',
      },
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
      admin: { description: 'Hospital phone number' },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      admin: { description: 'WhatsApp number for contact' },
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
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
      ],
    },
  ],
}
