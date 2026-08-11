import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { resolveTenant, listTenantSlugs } from '@/lib/api/tenants'
import { findForTenant, findProfileForTenant } from '@/lib/api/tenant-query'
import type {
  Article,
  Clinic,
  ClinicPageData,
  DoctorClinicSession,
  Faq,
  Testimonial,
} from '@/types/cms'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { isMedia } from './components/media'
import { getTemplateComponent } from './templates'

type Args = {
  params: Promise<{ slug?: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await listTenantSlugs('clinic')
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export default async function ClinicPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const data = await queryClinicPage(decodeURIComponent(slug))
  if (!data) notFound()

  const { clinic, doctorSessions, articles, testimonials, faqs } = data
  const Template = getTemplateComponent(clinic.template || 'classic-teal')

  return (
    <div className="bg-brand-mist">
      <Header clinicName={clinic.name} phone={clinic.phone} logo={clinic.logo} />
      <Template
        clinic={clinic}
        doctorSessions={doctorSessions}
        articles={articles}
        testimonials={testimonials}
        faqs={faqs}
      />
      <Footer clinicName={clinic.name} />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const data = await queryClinicPage(decodeURIComponent(slug))
  if (!data) return { title: 'Clinic not found' }

  const { clinic } = data
  const description = `${clinic.name} — ${clinic.address.line1}, ${clinic.address.city}`
  const og = clinic.banners?.desktopBanner || clinic.banners?.mobileBanner || clinic.logo || null

  return {
    title: clinic.name,
    description,
    openGraph: {
      title: clinic.name,
      description,
      images: isMedia(og) && og.url ? [og.url] : undefined,
    },
  }
}

const queryClinicPage = cache(async (slug: string): Promise<ClinicPageData | null> => {
  const tenant = await resolveTenant({ type: 'clinic', slug })
  if (!tenant) return null

  const clinic = await findProfileForTenant<Clinic>({
    collection: 'clinics',
    tenantId: tenant.id,
    slug,
    depth: 2,
  })
  if (!clinic) return null

  const [doctorSessions, articles, testimonials, faqs] = await Promise.all([
    findForTenant<DoctorClinicSession>({
      collection: 'doctor-clinic-sessions',
      tenantId: tenant.id,
      depth: 2,
      limit: 50,
    }),
    findForTenant<Article>({
      collection: 'articles',
      tenantId: tenant.id,
      depth: 1,
      limit: 12,
      sort: '-publishedDate',
    }),
    findForTenant<Testimonial>({
      collection: 'testimonials',
      tenantId: tenant.id,
      depth: 1,
      limit: 20,
    }),
    findForTenant<Faq>({
      collection: 'faqs',
      tenantId: tenant.id,
      depth: 1,
      limit: 20,
    }),
  ])

  return { clinic, doctorSessions, articles, testimonials, faqs }
})
