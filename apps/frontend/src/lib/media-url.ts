import { getApiBaseUrl } from '@/lib/env'

/**
 * Build an absolute media URL against the backend API host.
 * Optional cacheBust (updatedAt) mirrors Payload media cache-busting.
 */
export function getMediaUrl(
  pathOrUrl: string | null | undefined,
  cacheBust?: string | null,
): string {
  if (!pathOrUrl) return ''

  let url = pathOrUrl
  if (!/^https?:\/\//i.test(url)) {
    const base = getApiBaseUrl()
    url = `${base}${url.startsWith('/') ? url : `/${url}`}`
  }

  if (cacheBust) {
    const join = url.includes('?') ? '&' : '?'
    return `${url}${join}t=${encodeURIComponent(cacheBust)}`
  }

  return url
}
