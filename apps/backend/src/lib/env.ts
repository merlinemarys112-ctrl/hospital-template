import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PAYLOAD_SECRET: z.string().min(8, 'PAYLOAD_SECRET must be at least 8 characters'),
  PAYLOAD_PUBLIC_SERVER_URL: z
    .string()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  NEXT_PUBLIC_SERVER_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().optional(),
  CORS_ORIGINS: z.string().optional(),
  CSRF_ORIGINS: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  PREVIEW_SECRET: z.string().optional(),
  DRUPAL_BASE_URL: z.string().url().optional(),
})

export type BackendEnv = z.infer<typeof EnvSchema> & {
  serverURL: string
  corsOrigins: string[]
  csrfOrigins: string[]
  frontendURL: string | undefined
}

let cached: BackendEnv | null = null

function splitOrigins(value: string | undefined, fallback: string[]): string[] {
  if (!value?.trim()) return fallback
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Fail-fast env validation for the Payload backend.
 * Call once at config boot; subsequent calls return the cached result.
 */
export function getBackendEnv(): BackendEnv {
  if (cached) return cached

  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`Invalid backend environment: ${details}`)
  }

  const data = parsed.data
  const serverURL =
    data.PAYLOAD_PUBLIC_SERVER_URL ||
    data.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000'

  const frontendURL = data.FRONTEND_URL || 'http://localhost:3001'
  const corsOrigins = splitOrigins(data.CORS_ORIGINS, [frontendURL, serverURL])
  const csrfOrigins = splitOrigins(data.CSRF_ORIGINS, corsOrigins)

  cached = {
    ...data,
    serverURL,
    corsOrigins,
    csrfOrigins,
    frontendURL,
  }

  return cached
}

/** Test-only: clear cached env so a new DATABASE_URL can take effect. */
export function resetBackendEnvCache(): void {
  cached = null
}
