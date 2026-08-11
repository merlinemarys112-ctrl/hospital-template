import { z } from 'zod'

const FrontendEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url({
    message: 'NEXT_PUBLIC_API_URL must be a valid absolute URL to the Payload backend',
  }),
  REVALIDATE_SECRET: z.string().optional(),
})

export type FrontendEnv = z.infer<typeof FrontendEnvSchema>

let cached: FrontendEnv | null = null

/** Fail-fast env for the public frontend. */
export function getFrontendEnv(): FrontendEnv {
  if (cached) return cached

  const parsed = FrontendEnvSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  })

  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    throw new Error(`Invalid frontend environment: ${details}`)
  }

  cached = parsed.data
  return cached
}

export function getApiBaseUrl(): string {
  return getFrontendEnv().NEXT_PUBLIC_API_URL.replace(/\/$/, '')
}
