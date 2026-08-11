import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { resolveTenant, listTenantSlugs } from '@/lib/api/tenants'
import { findForTenant, findProfileForTenant } from '@/lib/api/tenant-query'
import type {
  Blog,
  GalleryImage,
  Hospital,
  HospitalDoctor,
  HospitalPageData,
  HospitalSpeciality,
  HospitalTestimonial,
} from '@/types/cms'

import { getTemplateComponent } from './templates'

type Args = {
  params: Promise<{ slug?: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await listTenantSlugs('hospital')
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export default async function HospitalPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const data = await queryHospitalPage(decodeURIComponent(slug))
  if (!data) notFound()

  const { hospital, doctors, specialities, galleryImages, blogs, testimonials } = data
  const Template = getTemplateComponent(hospital.template)

  return (
    <div className="bg-brand-mist">
      <Template
        hospital={hospital}
        doctors={doctors}
        specialities={specialities}
        galleryImages={galleryImages}
        blogs={blogs}
        testimonials={testimonials}
      />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const data = await queryHospitalPage(decodeURIComponent(slug))
  if (!data) return { title: 'Hospital not found' }

  const { hospital } = data
  const description = `${hospital.name} — ${hospital.address.line1}, ${hospital.address.city}`
  const hero = hospital.heroImage

  return {
    title: hospital.name,
    description,
    openGraph: {
      title: hospital.name,
      description,
      images:
        hero && typeof hero !== 'number' && hero.url ? [hero.url] : undefined,
    },
  }
}

const queryHospitalPage = cache(async (slug: string): Promise<HospitalPageData | null> => {
  const tenant = await resolveTenant({ type: 'hospital', slug })
  if (!tenant) return null

  const hospital = await findProfileForTenant<Hospital>({
    collection: 'hospitals',
    tenantId: tenant.id,
    slug,
    depth: 2,
  })
  if (!hospital) return null

  const [doctors, specialities, galleryImages, blogs, testimonials] = await Promise.all([
    findForTenant<HospitalDoctor>({
      collection: 'hospital-doctors',
      tenantId: tenant.id,
      depth: 1,
      limit: 50,
    }),
    findForTenant<HospitalSpeciality>({
      collection: 'hospital-specialities',
      tenantId: tenant.id,
      depth: 1,
      limit: 20,
    }),
    findForTenant<GalleryImage>({
      collection: 'gallery-images',
      tenantId: tenant.id,
      depth: 1,
      limit: 30,
    }),
    findForTenant<Blog>({
      collection: 'blogs',
      tenantId: tenant.id,
      depth: 1,
      limit: 12,
      sort: '-publishedDate',
    }),
    findForTenant<HospitalTestimonial>({
      collection: 'hospital-testimonials',
      tenantId: tenant.id,
      depth: 1,
      limit: 20,
    }),
  ])

  return { hospital, doctors, specialities, galleryImages, blogs, testimonials }
})
