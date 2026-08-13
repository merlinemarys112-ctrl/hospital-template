import type { Service } from '@/types/cms'
import Image from 'next/image'
import React from 'react'

import { mediaAlt, mediaSrc } from './media'

type Props = {
  services: Service[]
}

export function ServicesGrid({ services }: Props) {
  return (
    <section id="services" className="scroll-mt-28 bg-brand-mist py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-serif text-3xl tracking-tight text-brand-ink md:text-4xl">
          Our Services
        </h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageSrc = mediaSrc(service.image, 'medium') || mediaSrc(service.image)

            return (
              <li key={service.id} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-line">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={mediaAlt(service.image, service.name)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <p className="mt-3 text-base font-medium text-brand-ink">{service.name}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
