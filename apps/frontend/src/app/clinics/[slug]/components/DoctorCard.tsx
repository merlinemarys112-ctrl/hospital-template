import Image from 'next/image'
import React from 'react'

import type { DoctorWithClinicDays } from '../types'
import { mediaAlt, mediaSrc } from './media'

const DAY_LABELS: Record<DoctorWithClinicDays['availableDays'][number], string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

type Props = DoctorWithClinicDays

export function DoctorCard({ doctor, availableDays }: Props) {
  const photoSrc = mediaSrc(doctor.photo, 'square') || mediaSrc(doctor.photo)
  const stats = (doctor.stats || []).map((s) => s.label).filter(Boolean)

  return (
    <article className="grid gap-6 border-t border-brand-line py-10 md:grid-cols-[200px_1fr] md:gap-10 md:py-14">
      <div className="relative mx-auto aspect-square w-44 overflow-hidden md:mx-0 md:w-full">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={mediaAlt(doctor.photo, doctor.name)}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-mist text-brand-teal">
            {doctor.name.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-2xl tracking-tight text-brand-ink md:text-3xl">
          {doctor.name}
        </h3>

        {doctor.tagline && (
          <p className="mt-2 text-base italic text-brand-ink-soft md:text-lg">
            “{doctor.tagline}”
          </p>
        )}

        {typeof doctor.experienceYears === 'number' && (
          <p className="mt-4 font-clinic-mono text-xs uppercase tracking-[0.18em] text-brand-teal">
            {doctor.experienceYears}+ years experience
          </p>
        )}

        {stats.length > 0 && (
          <p className="mt-3 text-sm text-brand-ink-soft">{stats.join(' · ')}</p>
        )}

        {availableDays.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
              Available days
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {availableDays.map((day) => (
                <li
                  key={day}
                  className="border border-brand-line bg-white px-2.5 py-1 text-xs text-brand-ink-soft"
                >
                  {DAY_LABELS[day]}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={`#doctor-${doctor.slug}`}
            className="inline-flex items-center justify-center border border-brand-ink px-5 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
          >
            Know Your Doctor
          </a>
          <a
            href={`#book-${doctor.slug}`}
            className="inline-flex items-center justify-center bg-brand-copper px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-teal-deep"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </article>
  )
}
