import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'
import { ensureTenantProfile } from '../hooks/ensureTenantProfile'
import { revalidateFrontendTenantPath } from '../hooks/revalidateFrontend'

/**
 * Root tenant entity. Clinics and hospitals are profiles (isGlobal) keyed by tenant.
 * Slug is globally unique across both types so public URLs never collide.
 */
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    group: 'Platform',
    defaultColumns: ['name', 'slug', 'type', 'status'],
    description: 'Isolation root for clinic and hospital microsites. Create tenants here first.',
  },
  access: {
    // Public can read active tenants (frontend). Mutations require login;
    // multi-tenant plugin further scopes by super_admin / assigned tenants.
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [ensureTenantProfile, revalidateFrontendTenantPath],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment, e.g. aspire-childrens or synapse-neuro-center',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Clinic', value: 'clinic' },
        { label: 'Hospital', value: 'hospital' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      index: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Optional custom domain for future host-based routing',
      },
    },
  ],
  timestamps: true,
}
