import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6">
      <h1 className="font-serif text-4xl text-brand-ink">Marline</h1>
      <p className="text-brand-ink-soft">
        Public clinic and hospital sites are served from this frontend. Content is managed on the
        Payload backend.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-brand-teal">
        <li>
          <Link href="/clinics/example">/clinics/[slug]</Link>
        </li>
        <li>
          <Link href="/hospitals/example">/hospitals/[slug]</Link>
        </li>
      </ul>
    </main>
  )
}
