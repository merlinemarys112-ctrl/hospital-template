import type { Speciality } from '@/types/cms'
import Image from 'next/image'
import React from 'react'

import { isMedia, mediaAlt, mediaSrc } from './media'

type Props = {
  specialities: Speciality[]
}

export function SpecialitiesGrid({ specialities }: Props) {
  return (
    <section id="specialities" className="scroll-mt-28 bg-brand-paper py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl tracking-tight text-brand-ink md:text-4xl">
            Our Specialities
          </h2>
          <p className="mt-3 text-brand-ink-soft">
            Please choose the speciality of interest
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {specialities.map((speciality) => {
            const iconSrc = isMedia(speciality.icon)
              ? mediaSrc(speciality.icon, 'thumbnail') || mediaSrc(speciality.icon)
              : ''

            return (
              <li key={speciality.id} className="group text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-brand-line bg-brand-mist transition-transform duration-300 group-hover:-translate-y-1 md:size-20">
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt={mediaAlt(speciality.icon, speciality.name)}
                      width={40}
                      height={40}
                      className="size-8 object-contain md:size-10"
                    />
                  ) : (
                    <span className="font-clinic-mono text-sm text-brand-teal">
                      {speciality.name?.slice(0, 2).toUpperCase() || 'SP'}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-medium text-brand-ink md:text-base">
                  {speciality.name || 'Speciality'}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
