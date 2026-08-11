import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

type Body = {
  secret?: string
  path?: string
  tag?: string
}

/**
 * On-demand revalidation endpoint called by the backend after content changes.
 * Auth: Authorization Bearer REVALIDATE_SECRET or body.secret.
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected) {
    return NextResponse.json({ message: 'REVALIDATE_SECRET not configured' }, { status: 500 })
  }

  const auth = request.headers.get('authorization')
  const body = (await request.json().catch(() => ({}))) as Body
  const provided = auth?.startsWith('Bearer ') ? auth.slice(7) : body.secret

  if (provided !== expected) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (body.path) revalidatePath(body.path)
  if (body.tag) revalidateTag(body.tag, 'max')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
