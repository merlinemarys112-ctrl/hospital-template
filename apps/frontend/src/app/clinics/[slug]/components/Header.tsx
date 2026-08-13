import type { Media } from '@/types/cms'
import { Phone } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { mediaAlt, mediaSrc } from './media'

type NavItem = {
  label: string
  href: string
}

type Props = {
  clinicName: string
  phone: string
  logo?: (number | null) | Media
  navItems?: NavItem[]
}

const defaultNav: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Our Specialities', href: '#specialities' },
  { label: 'Our Services', href: '#services' },
  { label: 'Latest News & Articles', href: '#articles' },
  { label: "FAQ's", href: '#faqs' },
]

export function Header({ clinicName, phone, logo, navItems = defaultNav }: Props) {
  const logoSrc = mediaSrc(logo, 'medium') || mediaSrc(logo)

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/80 bg-brand-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <a href="#home" className="flex items-center gap-3">
          {logoSrc && (
            <div className="relative h-8 w-auto shrink-0 md:h-10">
              <Image
                src={logoSrc}
                alt={mediaAlt(logo, clinicName)}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          )}
          <span className="font-serif text-lg font-medium tracking-tight text-brand-ink md:text-xl">
            {clinicName}
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Clinic sections">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-brand-ink-soft transition-colors hover:text-brand-teal"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="inline-flex items-center gap-2 rounded-sm border border-brand-teal/25 bg-brand-mist px-3 py-2 text-sm font-medium text-brand-teal-deep transition-colors hover:border-brand-teal hover:bg-white"
        >
          <Phone className="size-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">{phone}</span>
          <span className="sm:hidden">Call</span>
        </a>
      </div>

      <nav
        className="flex gap-4 overflow-x-auto border-t border-brand-line/60 px-4 py-2 lg:hidden"
        aria-label="Clinic sections mobile"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-xs text-brand-ink-soft"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
