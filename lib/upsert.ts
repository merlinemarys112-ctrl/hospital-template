import type { CollectionSlug, DataFromCollectionSlug, Payload } from 'payload'

export type UpsertResult<TCollection extends CollectionSlug> = {
  doc: DataFromCollectionSlug<TCollection>
  created: boolean
}

/**
 * Find a document by a unique field value; update it if present, otherwise create it.
 * Returns the resulting doc and whether it was newly created (useful for import summaries).
 */
export async function upsertByField<TCollection extends CollectionSlug>(
  payload: Payload,
  collection: TCollection,
  field: string,
  value: string,
  data: Record<string, unknown>,
): Promise<UpsertResult<TCollection>> {
  const existing = await payload.find({
    collection,
    where: {
      [field]: {
        equals: value,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const found = existing.docs[0]

  if (found) {
    const doc = await payload.update({
      collection,
      id: found.id,
      data: data as never,
      overrideAccess: true,
    })

    return { doc, created: false }
  }

  const doc = await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
  })

  return { doc, created: true }
}
