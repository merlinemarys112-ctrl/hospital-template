import type { CollectionConfig } from 'payload'

import { publicReadAuthenticatedWrite } from '../access/patterns'

export const DoctorClinicSessions: CollectionConfig = {
  slug: 'doctor-clinic-sessions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['doctor', 'clinic', 'consultationDuration'],
  },
  access: publicReadAuthenticatedWrite,
  fields: [
    {
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      required: true,
      index: true,
    },
    {
      name: 'clinic',
      type: 'relationship',
      relationTo: 'clinics',
      required: true,
      index: true,
    },
    {
      name: 'consultationDuration',
      type: 'number',
      required: true,
      admin: { description: 'Minutes per consultation at this clinic' },
    },
    {
      name: 'availableDays',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Monday', value: 'mon' },
        { label: 'Tuesday', value: 'tue' },
        { label: 'Wednesday', value: 'wed' },
        { label: 'Thursday', value: 'thu' },
        { label: 'Friday', value: 'fri' },
        { label: 'Saturday', value: 'sat' },
        { label: 'Sunday', value: 'sun' },
      ],
    },
    {
      name: 'blockedDates',
      type: 'array',
      admin: { description: 'Dates blocked for THIS doctor at THIS clinic only' },
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'reason', type: 'text' },
      ],
    },
  ],
  indexes: [
    {
      fields: ['doctor', 'clinic'],
      unique: true,
    },
  ],
}
