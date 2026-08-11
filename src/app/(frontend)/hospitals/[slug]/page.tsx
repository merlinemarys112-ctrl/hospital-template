import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { getPayloadClient } from '@/lib/payload'
import type {
  Blog,
  GalleryImage,
  Hospital,
  HospitalDoctor,
  HospitalSpeciality,
  HospitalTestimonial,
} from '@/payload-types'

import { getTemplateComponent } from './templates'
import type { HospitalPageData } from './types'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const hospitals = await payload.find({
    collection: 'hospitals',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return hospitals.docs.map(({ slug }) => ({ slug }))
}

export default async function HospitalPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const data = await queryHospitalPage(decodedSlug)

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
  const decodedSlug = decodeURIComponent(slug)
  const data = await queryHospitalPage(decodedSlug)

  if (!data) {
    return { title: 'Hospital not found' }
  }

  const { hospital } = data
  const description = `${hospital.name} — ${hospital.address.line1}, ${hospital.address.city}`

  return {
    title: hospital.name,
    description,
    openGraph: {
      title: hospital.name,
      description,
      images: hospital.heroImage && typeof hospital.heroImage !== 'number' && hospital.heroImage.url ? [hospital.heroImage.url] : undefined,
    },
  }
}

const queryHospitalPage = cache(async (slug: string): Promise<HospitalPageData | null> => {
  const payload = await getPayloadClient()

  const hospitalResult = await payload.find({
    collection: 'hospitals',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const hospital = (hospitalResult.docs?.[0] as Hospital | undefined) || null
  if (!hospital) return null

  const [doctorsResult, specialitiesResult, galleryResult, blogsResult, testimonialsResult] =
    await Promise.all([
      payload.find({
        collection: 'hospital-doctors',
        depth: 1,
        limit: 50,
        overrideAccess: false,
        pagination: false,
      }),
      payload.find({
        collection: 'hospital-specialities',
        depth: 1,
        limit: 20,
        overrideAccess: false,
        pagination: false,
      }),
      payload.find({
        collection: 'gallery-images',
        depth: 1,
        limit: 30,
        overrideAccess: false,
        pagination: false,
      }),
      payload.find({
        collection: 'blogs',
        depth: 1,
        limit: 12,
        overrideAccess: false,
        pagination: false,
        sort: '-publishedDate',
      }),
      payload.find({
        collection: 'hospital-testimonials',
        depth: 1,
        limit: 20,
        overrideAccess: false,
        pagination: false,
      }),
    ])

  return {
    hospital,
    doctors: doctorsResult.docs as HospitalDoctor[],
    specialities: specialitiesResult.docs as HospitalSpeciality[],
    galleryImages: galleryResult.docs as GalleryImage[],
    blogs: blogsResult.docs as Blog[],
    testimonials: testimonialsResult.docs as HospitalTestimonial[],
  }
})
