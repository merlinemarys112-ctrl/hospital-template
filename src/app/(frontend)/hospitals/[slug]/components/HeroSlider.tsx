'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { mediaSrc, mediaAlt } from './media'

type HeroSlide = {
  headline: string
  subtext?: string | null
  phone?: string | null
  cta1Text?: string | null
  cta1Link?: string | null
  cta2Text?: string | null
  cta2Link?: string | null
  heroIcon?: any
}

type Props = {
  slides: HeroSlide[]
}

export function HeroSlider({ slides }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  if (!slides || slides.length === 0) return null

  const slide = slides[currentSlide]
  const iconSrc = mediaSrc(slide.heroIcon)
  const iconAlt = mediaAlt(slide.heroIcon, 'Hero icon')

  return (
    <section className="relative h-[80vh] min-h-[600px] bg-brand-teal">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal to-brand-teal-deep" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center text-white">
              <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
                {slide.headline}
              </h1>
              {slide.subtext && (
                <p className="mt-6 text-lg text-brand-mist md:text-xl">
                  {slide.subtext}
                </p>
              )}
              {slide.phone && (
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-brand-mist">Call us:</span>
                  <a
                    href={`tel:${slide.phone}`}
                    className="text-2xl font-bold text-white hover:underline"
                  >
                    {slide.phone}
                  </a>
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                {slide.cta1Text && slide.cta1Link && (
                  <a
                    href={slide.cta1Link}
                    className="rounded-full bg-white px-8 py-3 font-semibold text-brand-teal hover:bg-brand-mist"
                  >
                    {slide.cta1Text}
                  </a>
                )}
                {slide.cta2Text && slide.cta2Link && (
                  <a
                    href={slide.cta2Link}
                    className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10"
                  >
                    {slide.cta2Text}
                  </a>
                )}
              </div>
            </div>

            {/* Right: Hero Icon */}
            {iconSrc && (
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-[400px]">
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
