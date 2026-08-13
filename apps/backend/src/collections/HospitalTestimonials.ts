import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const HospitalTestimonials: CollectionConfig = {
  slug: 'hospital-testimonials',
  admin: {
    useAsTitle: 'patientName',
    defaultColumns: ['patientName', 'rating', 'date'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    { name: 'patientName', type: 'text', required: true },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    { name: 'testimonial', type: 'textarea', required: true },
    { name: 'date', type: 'date' },
    { name: 'treatment', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
