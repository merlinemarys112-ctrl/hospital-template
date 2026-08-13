import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { Plugin } from 'payload'

import { userHasAccessToAllTenants } from '@/access'
import type { User } from '@/payload-types'

const tenantCollections = {
  // Note: clinics/hospitals cannot use isGlobal:true — other tenant-scoped
  // collections relate to them (articles.clinic, etc.) which the plugin forbids.
  clinics: {},
  hospitals: {},
  doctors: {},
  'doctor-clinic-sessions': {},
  specialities: {},
  services: {},
  articles: {},
  testimonials: {},
  faqs: {},
  'hospital-doctors': {},
  'hospital-specialities': {},
  'hospital-testimonials': {},
  blogs: {},
  'gallery-images': {},
  media: {},
} as const

/**
 * Platform plugins. Multi-tenant is the foundation for 100+ clinics/hospitals.
 */
export const plugins: Plugin[] = [
  multiTenantPlugin({
    tenantsSlug: 'tenants',
    collections: { ...tenantCollections },
    userHasAccessToAllTenants: (user) => userHasAccessToAllTenants(user as User),
    // Platform operators should see every tenant in the Tenants collection list
    useTenantsListFilter: false,
  }),
]
