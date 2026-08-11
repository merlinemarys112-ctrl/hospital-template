import type { Media } from '@/types/cms'
import { getMediaUrl } from '@/lib/media-url'

export function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function mediaSrc(
  value: number | Media | null | undefined,
  size?: keyof NonNullable<Media['sizes']>,
): string {
  if (!isMedia(value)) return ''
  const sized = size ? value.sizes?.[size]?.url : undefined
  return getMediaUrl(sized || value.url, value.updatedAt)
}

export function mediaAlt(value: number | Media | null | undefined, fallback: string | null | undefined = ''): string {
  if (!isMedia(value)) return fallback || ''
  return value.alt || fallback || ''
}
