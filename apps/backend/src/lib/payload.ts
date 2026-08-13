import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Shared Payload Local API client.
 * `getPayload` already dedupes by config; keep a module-level promise so
 * concurrent callers in the same process share one init in dev.
 */
let payloadPromise: Promise<Payload> | null = null

export function getPayloadClient(): Promise<Payload> {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config })
  }
  return payloadPromise
}
