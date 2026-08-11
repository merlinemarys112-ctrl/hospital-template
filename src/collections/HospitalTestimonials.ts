import type { CollectionConfig } from 'payload'

import { hospitalRelatedScopedAccess } from '../access/hospital-access'

export const HospitalTestimonials: CollectionConfig = {
  slug: 'hospital-testimonials',
  admin: {
    useAsTitle: 'patientName',
    defaultColumns: ['patientName', 'rating', 'date', 'hospital'],
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
        description: 'Hospital this testimonial belongs to',
      },
    },
    {
      name: 'patientName',
      type: 'text',
      required: true,
      admin: { description: 'Patient name' },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: { description: 'Rating out of 5' },
    },
    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
      admin: { description: 'Patient testimonial text' },
    },
    {
      name: 'date',
      type: 'date',
      admin: { description: 'Date of testimonial' },
    },
    {
      name: 'treatment',
      type: 'text',
      admin: { description: 'Treatment or service received' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Patient photo (optional)' },
    },
  ],
}
