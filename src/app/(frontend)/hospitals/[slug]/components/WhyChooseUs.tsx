import React from 'react'
import Image from 'next/image'
import { mediaSrc, mediaAlt } from './media'

type Feature = {
  icon?: any
  title: string
  blurb?: string | null
}

type Props = {
  features: Feature[]
}

export function WhyChooseUs({ features }: Props) {
  if (!features || features.length === 0) return null

  return (
    <section className="bg-brand-mist py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
            Why Choose Us
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const iconSrc = mediaSrc(feature.icon)
            const iconAlt = mediaAlt(feature.icon, feature.title)

            return (
              <div
                key={index}
                className="rounded-lg bg-brand-paper p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {iconSrc && (
                  <div className="mb-4 h-16 w-16">
                    <Image
                      src={iconSrc}
                      alt={iconAlt}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-brand-ink">{feature.title}</h3>
                {feature.blurb && (
                  <p className="mt-2 text-brand-ink-soft">{feature.blurb}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
