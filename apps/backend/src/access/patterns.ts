import type { Access } from 'payload'

import { authenticated, anyone } from '../access'

/** Public read + authenticated mutations (tenant plugin layers isolation). */
export const publicReadAuthenticatedWrite = {
  read: anyone as Access,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
} as const
