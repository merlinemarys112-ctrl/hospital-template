import { getApiBaseUrl } from '@/lib/env'

export class ApiClientError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

type QueryValue = string | number | boolean | undefined | null

export type ApiQuery = Record<string, QueryValue>

function toSearchParams(query?: ApiQuery): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

type RequestOptions = {
  query?: ApiQuery
  cache?: RequestCache
  next?: NextFetchRequestConfig
  signal?: AbortSignal
}

/**
 * Typed HTTP client bound to NEXT_PUBLIC_API_URL.
 * All frontend to backend traffic must go through this module.
 */
export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = getApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${base}${normalizedPath}${toSearchParams(options.query)}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: options.cache,
    next: options.next,
    signal: options.signal,
  })

  if (!response.ok) {
    let message = 'API ' + response.status + ' for ' + path
    try {
      const body = (await response.json()) as {
        message?: string
        errors?: Array<{ message?: string }>
      }
      message = body.message || body.errors?.[0]?.message || message
    } catch {
      // ignore parse errors
    }
    throw new ApiClientError(message, response.status)
  }

  return (await response.json()) as T
}
