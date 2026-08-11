import type { Clinic, Media } from '@/payload-types'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { mediaAlt, mediaSrc } from './media'

type Props = {
  name: string
  rating?: number | null
  address: Clinic['address']
  /** Prefer desktop banner; callers may fall back to mobile banner */
  heroImage?: (number | null) | Media
}

function formatAddress(address: Clinic['address']) {
  const parts = [address.line1, address.city, address.state, address.postalCode].filter(
    (part) => part && part !== 'Unknown' && part !== '000000',
  )
  return parts.join(', ')
}

export function Hero({ name, rating, address, heroImage }: Props) {
  const heroSrc = mediaSrc(heroImage, 'xlarge') || mediaSrc(heroImage)
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`

  return (
    <section id="home" className="relative overflow-hidden bg-brand-ink text-white">
      {/* Design risk: EEG-style signal line + clinical datum rail */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-brand-signal to-transparent opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-8 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='32' viewBox='0 0 120 32' fill='none'%3E%3Cpath d='M0 16 H20 L28 8 L36 24 L44 12 L52 20 L60 16 H120' stroke='%231F8A7E' stroke-width='1.2'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center top',
          animation: 'clinic-signal 8s linear infinite',
        }}
      />

      <div className="relative min-h-[70vh] md:min-h-[78vh]">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={mediaAlt(heroImage, name)}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-teal-deep" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/55 to-brand-ink/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(31,138,126,0.25),transparent_50%)]" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-28 md:min-h-[78vh] md:px-6 md:pb-14">
          <div className="max-w-2xl">
            <p className="mb-3 font-clinic-mono text-[11px] uppercase tracking-[0.28em] text-brand-signal">
              Neurology · Precision Care
            </p>

            <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              {name}
            </h1>

            <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
              Focused neurological care with clear guidance, measured expertise, and a calm clinical
              setting.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {typeof rating === 'number' && (
                <div className="inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <Star className="size-4 fill-brand-copper text-brand-copper" />
                  <span className="font-clinic-mono text-sm tracking-wide">
                    {rating.toFixed(1)}
                    <span className="text-white/50"> / 5.0</span>
                  </span>
                </div>
              )}

              <div className="flex min-w-0 items-start gap-2 text-sm text-white/85">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-signal" />
                <div>
                  <p>{formatAddress(address)}</p>
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-medium text-brand-signal underline-offset-4 hover:underline"
                  >
                    View on map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes clinic-signal {
          from { background-position: 0 top; }
          to { background-position: 120px top; }
        }
      `}</style>
    </section>
  )
}
