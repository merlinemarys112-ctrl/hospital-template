import path from 'path'
import type { Payload } from 'payload'

import type { Media } from '@/payload-types'

function filenameFromUrl(imageUrl: string): string {
  try {
    const pathname = new URL(imageUrl).pathname
    const base = path.basename(pathname)
    return base || `import-${Date.now()}.jpg`
  } catch {
    return `import-${Date.now()}.jpg`
  }
}

/**
 * Reuse an existing Media doc if we've already imported this remote URL (via `sourceUrl`).
 * Otherwise download the image and create a new media record.
 */
export async function getOrUploadMedia(
  payload: Payload,
  imageUrl: string,
  alt: string,
): Promise<Media> {
  const existing = await payload.find({
    collection: 'media',
    where: {
      sourceUrl: {
        equals: imageUrl,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    return existing.docs[0] as Media
  }

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${imageUrl}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const data = Buffer.from(arrayBuffer)
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  const name = filenameFromUrl(imageUrl)

  const media = await payload.create({
    collection: 'media',
    data: {
      alt,
      sourceUrl: imageUrl,
    },
    file: {
      data,
      mimetype: contentType.split(';')[0]?.trim() || 'application/octet-stream',
      name,
      size: data.length,
    },
    overrideAccess: true,
  })

  return media as Media
}
