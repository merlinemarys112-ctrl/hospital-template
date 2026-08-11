import React from 'react'

type Props = {
  clinicName: string
}

export function Footer({ clinicName }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-brand-line bg-brand-ink py-8 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm md:flex-row md:items-center md:justify-between md:px-6">
        <p className="font-serif text-base text-white">
          {clinicName}
        </p>
        <p>© {year} {clinicName}. All rights reserved.</p>
      </div>
    </footer>
  )
}
