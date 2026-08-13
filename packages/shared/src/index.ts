import { z } from 'zod'

/** Discriminator for clinic vs hospital tenants */
export const TenantTypeSchema = z.enum(['clinic', 'hospital'])
export type TenantType = z.infer<typeof TenantTypeSchema>

export const TenantStatusSchema = z.enum(['active', 'inactive'])
export type TenantStatus = z.infer<typeof TenantStatusSchema>

/** Public tenant summary returned by API list/detail helpers */
export const PublicTenantSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  slug: z.string(),
  type: TenantTypeSchema,
  status: TenantStatusSchema,
})
export type PublicTenant = z.infer<typeof PublicTenantSchema>

/** Standard API error envelope for the frontend client */
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  status: z.number().optional(),
})
export type ApiError = z.infer<typeof ApiErrorSchema>

export const CLINIC_ROUTE_PREFIX = '/clinics' as const
export const HOSPITAL_ROUTE_PREFIX = '/hospitals' as const

export function tenantPublicPath(type: TenantType, slug: string): string {
  return type === 'clinic' ? `${CLINIC_ROUTE_PREFIX}/${slug}` : `${HOSPITAL_ROUTE_PREFIX}/${slug}`
}
