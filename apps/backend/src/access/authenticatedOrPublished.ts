import type { Access } from 'payload'

import { authenticated } from './authenticated'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}
