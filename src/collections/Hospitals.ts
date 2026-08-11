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
        { label: 'Modern Clinical (Medilo)', value: 'modern-clinical' },
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
    {
      name: 'heroSlides',
      type: 'array',
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
          admin: { description: 'Slide headline' },
        },
        {
          name: 'subtext',
          type: 'textarea',
          admin: { description: 'Slide subtext or description' },
        },
        {
          name: 'phone',
          type: 'text',
          admin: { description: 'Phone number for CTA' },
        },
        {
          name: 'cta1Text',
          type: 'text',
          admin: { description: 'First CTA button text' },
        },
        {
          name: 'cta1Link',
          type: 'text',
          admin: { description: 'First CTA button link' },
        },
        {
          name: 'cta2Text',
          type: 'text',
          admin: { description: 'Second CTA button text' },
        },
        {
          name: 'cta2Link',
          type: 'text',
          admin: { description: 'Second CTA button link' },
        },
        {
          name: 'heroIcon',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Hero icon image' },
        },
      ],
      admin: { description: 'Hero slider slides (3 recommended)' },
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Stat label (e.g., "Years of Experience")' },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'Stat value (e.g., "26+")' },
        },
      ],
      admin: { description: 'Counter stats (4 recommended)' },
    },
    {
      name: 'whyChooseUs',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Feature icon' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Feature title' },
        },
        {
          name: 'blurb',
          type: 'textarea',
          admin: { description: 'Feature description' },
        },
      ],
      admin: { description: 'Why choose us features (6 recommended)' },
    },
    {
      name: 'videoCTA',
      type: 'group',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Video CTA background image' },
        },
        {
          name: 'videoLink',
          type: 'text',
          admin: { description: 'Video URL (YouTube/Vimeo)' },
        },
        {
          name: 'headline',
          type: 'text',
          admin: { description: 'Video CTA headline' },
        },
      ],
      admin: { description: 'Video CTA section' },
    },
    {
      name: 'serviceOfferings',
      type: 'blocks',
      blocks: [
        {
          slug: 'service-tab',
          interfaceName: 'ServiceTab',
          fields: [
            {
              name: 'tabLabel',
              type: 'text',
              required: true,
              admin: { description: 'Tab label (e.g., "Cardiology")' },
            },
            {
              name: 'heading',
              type: 'text',
              required: true,
              admin: { description: 'Section heading' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Section image' },
            },
            {
              name: 'checklist',
              type: 'array',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  admin: { description: 'Checklist item' },
                },
              ],
            },
          ],
        },
      ],
      admin: { description: 'Flexible service offering tabs (4 recommended)' },
    },
    {
      name: 'partnerLogos',
      type: 'array',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Partner logo' },
        },
        {
          name: 'name',
          type: 'text',
          admin: { description: 'Partner name (for alt text)' },
        },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'Partner website link' },
        },
      ],
      admin: { description: 'Partner/client logos' },
    },
  ],
}
