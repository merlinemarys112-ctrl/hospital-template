import type { Doctor, Faq } from '@/types/cms'
import { BadgeCheck } from 'lucide-react'
import React from 'react'

type Props = {
  faq: Faq
}

function doctorName(doctor: Faq['doctor']): string | null {
  if (doctor && typeof doctor === 'object') {
    return (doctor as Doctor).name
  }
  return null
}

export function FAQItem({ faq }: Props) {
  const visited = doctorName(faq.doctor)

  return (
    <article className="border-b border-brand-line py-6">
      <div className="flex flex-wrap items-center gap-3">
        {faq.verifiedPatient && (
          <span className="inline-flex items-center gap-1.5 bg-brand-teal/10 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-teal-deep">
            <BadgeCheck className="size-3.5" aria-hidden />
            Verified Patient
          </span>
        )}
        {(visited || faq.visitReason) && (
          <p className="text-xs text-brand-ink-soft">
            {visited && <span>Visited {visited}</span>}
            {visited && faq.visitReason && <span> · </span>}
            {faq.visitReason && <span>for {faq.visitReason}</span>}
          </p>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold text-brand-ink md:text-lg">
        {faq.question}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft md:text-base">
        {faq.answer}
      </p>
    </article>
  )
}
