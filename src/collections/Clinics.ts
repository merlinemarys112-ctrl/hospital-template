import type { CollectionConfig } from 'payload'

const botLanguageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Telugu', value: 'te' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Amharic', value: 'am' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Assamese', value: 'as' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Dhivehi', value: 'dv' },
  { label: 'French', value: 'fr' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Konkani', value: 'kok' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Nigerian Pidgin', value: 'pcm' },
  { label: 'Odia', value: 'or' },
  { label: 'Sinhala', value: 'si' },
  { label: 'Spanish', value: 'es' },
  { label: 'Swahili', value: 'sw' },
]

export const Clinics: CollectionConfig = {
  slug: 'clinics',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'rating', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'drupalUuid',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Drupal taxonomy_term--clinic UUID',
        readOnly: true,
      },
    },
    {
      name: 'drupalTid',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Drupal internal tid',
        readOnly: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
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
              admin: { description: 'e.g. synapse-neuro-center' },
            },
            {
              name: 'template',
              type: 'select',
              required: true,
              defaultValue: 'classic-teal',
              options: [
                { label: 'Classic (Teal)', value: 'classic-teal' },
                { label: 'Minimal (coming soon)', value: 'minimal' },
              ],
              admin: {
                description: 'Controls which page layout renders this clinic.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              admin: { description: 'Clinic phone / SMS number' },
            },
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'instructions',
              type: 'textarea',
            },
            {
              name: 'locationLabel',
              type: 'text',
              admin: { description: 'Drupal field_clinic_location (e.g. Jayanagar-Synapse Neuro Center)' },
            },
            {
              name: 'openCloseText',
              type: 'text',
              admin: { description: 'Clinic Open Close Text' },
            },
            {
              name: 'rating',
              type: 'number',
              min: 0,
              max: 5,
            },
            {
              name: 'reviewCount',
              type: 'number',
              min: 0,
            },
            {
              name: 'priceRange',
              type: 'text',
            },
            {
              name: 'areaServed',
              type: 'text',
            },
            {
              name: 'colorCode',
              type: 'text',
              admin: { description: 'Drupal field_color_code_clinic' },
            },
            {
              name: 'showBlogs',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'showTestimonials',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'specialities',
              type: 'relationship',
              relationTo: 'specialities',
              hasMany: true,
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Clinic Logo (not the hero banner)' },
            },
            {
              name: 'banners',
              type: 'group',
              fields: [
                {
                  name: 'desktopBanner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Large desktop banner (landing hero)' },
                },
                {
                  name: 'mobileBanner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Mobile banner image' },
                },
              ],
            },
          ],
        },
        {
          label: 'Address & Map',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'line1', type: 'text', required: true },
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Parsed from Drupal free-text address when missing',
                  },
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
              name: 'mapHtml',
              type: 'textarea',
              admin: { description: 'Raw Google Maps iframe HTML from Drupal' },
            },
          ],
        },
        {
          label: 'Working Hours',
          fields: [
            {
              name: 'workingHours',
              type: 'array',
              labels: { singular: 'Clinic Hours', plural: 'Clinic Working Hours' },
              fields: [
                {
                  name: 'toDoctor',
                  type: 'text',
                  admin: { description: 'Doctor label / reference from Drupal "To Doctor"' },
                },
                { name: 'clinicDays', type: 'text' },
                { name: 'clinicHours', type: 'text' },
                { name: 'mobileNumber', type: 'text' },
                { name: 'instructions', type: 'textarea' },
                {
                  name: 'priorityRule',
                  type: 'textarea',
                  admin: { description: 'Priority rules for voice AI' },
                },
                { name: 'specialtyKeyword', type: 'text' },
                { name: 'ageGroup', type: 'text' },
                { name: 'priorityLevel', type: 'text' },
                { name: 'priorityScore', type: 'number' },
                {
                  name: 'appointmentClinicNumber',
                  type: 'text',
                  admin: { description: 'RFA / receptionist appointment number' },
                },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'specialitiesSection',
              type: 'group',
              label: 'Our Specialities Section',
              fields: [
                { name: 'mainTitle', type: 'text' },
                { name: 'subMainTitle', type: 'text' },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    { name: 'title', type: 'text' },
                    { name: 'shortDescription', type: 'textarea' },
                    { name: 'logo', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
            {
              name: 'servicesSection',
              type: 'group',
              label: 'Our Services Section',
              fields: [
                { name: 'mainTitle', type: 'text' },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    { name: 'title', type: 'text' },
                    { name: 'logo', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
            {
              name: 'youtubeVideos',
              type: 'array',
              label: 'Youtube Video',
              fields: [
                { name: 'embedUrl', type: 'text' },
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'metaTitle', type: 'text' },
                { name: 'metaDescription', type: 'textarea' },
                { name: 'metaKeywords', type: 'text' },
                {
                  name: 'crawlingDisabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'Drupal SEO meta → crawling Disable' },
                },
              ],
            },
          ],
        },
        {
          label: 'Integrations',
          fields: [
            {
              name: 'whatsapp',
              type: 'group',
              label: 'WhatsApp',
              fields: [
                {
                  name: 'middlewareToken',
                  type: 'text',
                  admin: { description: 'Whatsapp middleware token' },
                },
                {
                  name: 'tokenId',
                  type: 'text',
                  admin: { description: 'Whatsapp token ID' },
                },
              ],
            },
            {
              name: 'clinicSamAi',
              type: 'group',
              label: 'Clinic SAM AI',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'Drupal field_clinic_sam_ai' },
                },
              ],
            },
            {
              name: 'symptomCollector',
              type: 'group',
              label: 'Symptom collector',
              fields: [
                { name: 'toDoctor', type: 'text' },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Symptom collector video (mp4)' },
                },
                {
                  name: 'botLanguages',
                  type: 'select',
                  hasMany: true,
                  options: botLanguageOptions,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
