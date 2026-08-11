'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { mediaSrc, mediaAlt } from './media'

type ServiceTab = {
  tabLabel: string
  heading: string
  image?: any
  checklist?: Array<{ item: string }>
}

type Props = {
  serviceOfferings: ServiceTab[]
}

export function TabbedServiceOfferings({ serviceOfferings }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  if (!serviceOfferings || serviceOfferings.length === 0) return null

  const activeContent = serviceOfferings[activeTab]
  const imageSrc = mediaSrc(activeContent.image)
  const imageAlt = mediaAlt(activeContent.image, activeContent.heading)

  return (
    <section className="bg-brand-mist py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
            Our Services
          </h2>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 border-b border-brand-line pb-4">
          {serviceOfferings.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`rounded-full px-6 py-2 font-semibold transition-colors ${
                index === activeTab
                  ? 'bg-brand-teal text-white'
                  : 'bg-brand-paper text-brand-ink hover:bg-brand-line'
              }`}
            >
              {tab.tabLabel}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          {imageSrc && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center">
            <h3 className="font-serif text-2xl font-bold text-brand-ink">
              {activeContent.heading}
            </h3>

            {activeContent.checklist && activeContent.checklist.length > 0 && (
              <ul className="mt-6 space-y-3">
                {activeContent.checklist.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 flex-shrink-0 text-brand-teal"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-brand-ink-soft">{item.item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
