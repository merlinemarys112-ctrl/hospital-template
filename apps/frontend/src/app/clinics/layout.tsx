import { Figtree, Fraunces, IBM_Plex_Mono } from 'next/font/google'
import React from 'react'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export default function ClinicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${figtree.variable} ${plexMono.variable} clinic-shell min-h-screen bg-brand-mist font-clinic-sans text-brand-ink antialiased`}
      data-clinic-page
    >
      {children}
    </div>
  )
}
