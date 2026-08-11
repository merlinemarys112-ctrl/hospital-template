import type { Testimonial } from '@/types/cms'
import React from 'react'

type Props = {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: Props) {
  return (
    <article className="border-l-2 border-brand-signal bg-white/70 py-5 pl-5 pr-2">
      <h3 className="font-serif text-lg tracking-tight text-brand-ink">
        {testimonial.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft md:text-base">
        {testimonial.review}
      </p>
      <p className="mt-4 font-clinic-mono text-xs uppercase tracking-[0.14em] text-brand-teal-deep">
        — {testimonial.patientName}
      </p>
    </article>
  )
}
