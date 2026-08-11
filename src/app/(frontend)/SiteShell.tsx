'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

export function SiteShell({ header, footer, children }: Props) {
  const pathname = usePathname()
  const isClinicPage = pathname?.startsWith('/clinics/')

  if (isClinicPage) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  )
}
