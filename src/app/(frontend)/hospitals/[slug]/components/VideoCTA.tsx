'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { mediaSrc, mediaAlt } from './media'

type VideoCTA = {
  backgroundImage?: any
  videoLink?: string | null
  headline?: string | null
}

type Props = {
  videoCTA: VideoCTA
}

export function VideoCTA({ videoCTA }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  if (!videoCTA) return null

  const bgSrc = mediaSrc(videoCTA.backgroundImage)
  const bgAlt = mediaAlt(videoCTA.backgroundImage, 'Video CTA background')

  return (
    <section className="relative py-20">
      {bgSrc && (
        <div className="absolute inset-0">
          <Image
            src={bgSrc}
            alt={bgAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-ink/80" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        {videoCTA.headline && (
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            {videoCTA.headline}
          </h2>
        )}

        {videoCTA.videoLink && (
          <button
            onClick={() => setIsOpen(true)}
            className="mt-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-teal text-white transition-colors hover:bg-brand-teal-deep"
            aria-label="Play video"
          >
            <svg
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {isOpen && videoCTA.videoLink && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative h-[80vh] w-[90vw] max-w-5xl">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -right-12 top-0 text text-white hover:text-brand-teal"
                aria-label="Close video"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <iframe
                src={videoCTA.videoLink}
                className="h-full w-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
