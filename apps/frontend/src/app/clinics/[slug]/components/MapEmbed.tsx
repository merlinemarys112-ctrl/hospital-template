import React from 'react'

type Props = {
  latitude: number
  longitude: number
  clinicName: string
}

export function MapEmbed({ latitude, longitude, clinicName }: Props) {
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`

  return (
    <section id="map" className="bg-brand-paper py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-serif text-3xl tracking-tight text-brand-ink md:text-4xl">
          Find Us
        </h2>
        <p className="mt-2 text-sm text-brand-ink-soft">{clinicName}</p>

        <div className="mt-8 overflow-hidden border border-brand-line">
          <iframe
            title={`Map showing location of ${clinicName}`}
            src={src}
            className="h-[320px] w-full md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
