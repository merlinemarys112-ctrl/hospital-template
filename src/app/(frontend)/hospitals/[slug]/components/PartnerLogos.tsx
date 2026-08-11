import React from 'react'
import Image from 'next/image'
import { mediaSrc, mediaAlt } from './media'

type Partner = {
  logo?: any
  name?: string | null
  link?: string | null
}

type Props = {
  partners: Partner[]
}

export function PartnerLogos({ partners }: Props) {
  if (!partners || partners.length === 0) return null

  return (
    <section className="bg-brand-paper py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, index) => {
            const logoSrc = mediaSrc(partner.logo)
            const logoAlt = mediaAlt(partner.logo, partner.name || 'Partner logo')

            const content = (
              <div className="flex h-24 items-center justify-center">
                {logoSrc && (
                  <Image
                    src={logoSrc}
                    alt={logoAlt}
                    width={150}
                    height={80}
                    className="max-h-16 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
                  />
                )}
              </div>
            )

            if (partner.link) {
              return (
                <a
                  key={index}
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  {content}
                </a>
              )
            }

            return <div key={index}>{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}
