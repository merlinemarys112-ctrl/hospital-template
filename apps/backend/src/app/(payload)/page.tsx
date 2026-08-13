import { redirect } from 'next/navigation'

/** Backend is API + Admin only. Public site lives on the frontend app. */
export default function RootPage() {
  redirect('/admin')
}
