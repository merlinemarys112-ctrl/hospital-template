import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type {
  Blog,
  GalleryImage,
  Hospital,
  HospitalDoctor,
  HospitalSpeciality,
  HospitalTestimonial,
} from '@/types/cms'
import { mediaSrc, mediaAlt } from '../components/media'

import { HeroSlider } from '../components/HeroSlider'
import { CountersStrip } from '../components/CountersStrip'
import { WhyChooseUs } from '../components/WhyChooseUs'
import { VideoCTA } from '../components/VideoCTA'
import { PartnerLogos } from '../components/PartnerLogos'
import { TabbedServiceOfferings } from '../components/TabbedServiceOfferings'

type Props = {
  hospital: Hospital
  doctors: HospitalDoctor[]
  specialities: HospitalSpeciality[]
  galleryImages: GalleryImage[]
  blogs: Blog[]
  testimonials: HospitalTestimonial[]
}

export default function MediloStyleTemplate({
  hospital,
  doctors,
  specialities,
  galleryImages,
  blogs,
  testimonials,
}: Props) {
  // Type assertions for new fields
  const heroSlides = (hospital as any).heroSlides || []
  const stats = (hospital as any).stats || []
  const whyChooseUs = (hospital as any).whyChooseUs || []
  const videoCTA = (hospital as any).videoCTA || null
  const serviceOfferings = (hospital as any).serviceOfferings || []
  const partnerLogos = (hospital as any).partnerLogos || []

  return (
    <div className="min-h-screen bg-brand-mist">
      {/* 1. Hero Slider */}
      {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* 2. About/CTA Split */}
      <section className="bg-brand-paper py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Image */}
            {hospital.heroImage && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={mediaSrc(hospital.heroImage) || ''}
                  alt={mediaAlt(hospital.heroImage, hospital.name)}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Right: Content */}
            <div className="flex flex-col justify-center">
              {hospital.tagline && (
                <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
                  {hospital.tagline}
                </h2>
              )}
              {stats.length > 0 && (
                <div className="mt-8">
                  {stats.slice(0, 1).map((stat: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-brand-teal">{stat.value}</div>
                      <div className="text-brand-ink-soft">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 text-brand-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-brand-ink-soft">
                    World-class healthcare facilities with state-of-the-art equipment
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 text-brand-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-brand-ink-soft">
                    Experienced team of doctors and medical professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Counters Strip */}
      {stats.length > 0 && <CountersStrip stats={stats} />}

      {/* 4. Services Grid */}
      {specialities.length > 0 && (
        <section className="bg-brand-paper py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
                Our Services
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {specialities.slice(0, 8).map((speciality, index) => (
                <div
                  key={speciality.id}
                  className="group rounded-lg bg-brand-mist p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-white font-bold">
                    {index + 1}
                  </div>
                  {speciality.icon && (
                    <div className="mb-4 h-16">
                      <Image
                        src={mediaSrc(speciality.icon) || ''}
                        alt={mediaAlt(speciality.icon, speciality.name)}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-brand-ink">{speciality.name}</h3>
                  {speciality.description && (
                    <p className="mt-2 text-sm text-brand-ink-soft">{speciality.description}</p>
                  )}
                  <Link
                    href="#services"
                    className="mt-4 inline-block text-sm font-semibold text-brand-teal hover:underline"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Doctor Team Carousel */}
      {doctors.length > 0 && (
        <section className="bg-brand-mist py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
                Our Doctors
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {doctors.slice(0, 8).map((doctor) => (
                <div key={doctor.id} className="rounded-lg bg-brand-paper p-6 shadow-sm">
                  {doctor.image && (
                    <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={mediaSrc(doctor.image) || ''}
                        alt={mediaAlt(doctor.image, doctor.name)}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-brand-ink">{doctor.name}</h3>
                  {doctor.designation && (
                    <p className="text-brand-teal">{doctor.designation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Partner Logos */}
      {partnerLogos.length > 0 && <PartnerLogos partners={partnerLogos} />}

      {/* 7. Why Choose Us */}
      {whyChooseUs.length > 0 && <WhyChooseUs features={whyChooseUs} />}

      {/* 8. Portfolio/Gallery */}
      {galleryImages.length > 0 && (
        <section className="bg-brand-paper py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
                Our Gallery
              </h2>
            </div>
            {/* Filter Tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {['All', 'Dental', 'Cardiology', 'Neurology', 'Medical'].map((filter) => (
                <button
                  key={filter}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-brand-teal hover:text-white"
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {galleryImages.slice(0, 6).map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg bg-brand-mist shadow-sm">
                  <div className="aspect-video">
                    <Image
                      src={mediaSrc(image.image) || ''}
                      alt={mediaAlt(image.image, image.title)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-ink">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Video CTA */}
      {videoCTA && <VideoCTA videoCTA={videoCTA} />}

      {/* 10. Tabbed Service Offerings */}
      {serviceOfferings.length > 0 && (
        <TabbedServiceOfferings serviceOfferings={serviceOfferings} />
      )}

      {/* 11. Appointment CTA */}
      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-center text-white">
              <h2 className="font-serif text-3xl font-bold md:text-4xl">
                Book Your Appointment
              </h2>
              <p className="mt-4 text-brand-mist">
                Schedule your visit with our expert doctors today
              </p>
              {hospital.linqmdBookingSlug && (
                <a
                  href={`https://linqmd.com/hospital/${hospital.linqmdBookingSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-brand-teal hover:bg-brand-mist"
                >
                  Send Request
                </a>
              )}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-[300px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-32 w-32 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Blog List */}
      {blogs.length > 0 && (
        <section className="bg-brand-mist py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-ink md:text-4xl">
                Latest Blogs
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {blogs.slice(0, 4).map((blog) => (
                <article key={blog.id} className="rounded-lg bg-brand-paper p-6 shadow-sm">
                  {blog.featuredImage && (
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={mediaSrc(blog.featuredImage) || ''}
                        alt={mediaAlt(blog.featuredImage, blog.title)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {blog.publishedDate && (
                    <p className="text-xs text-brand-ink-soft">
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </p>
                  )}
                  <h3 className="mt-2 text-lg font-semibold text-brand-ink">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="mt-2 text-sm text-brand-ink-soft">{blog.excerpt}</p>
                  )}
                  {blog.author && (
                    <p className="mt-2 text-xs text-brand-ink-soft">By {blog.author}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. Footer */}
      <footer className="bg-brand-ink py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Contact Info */}
            <div>
              <h3 className="font-serif text-xl font-bold">{hospital.name}</h3>
              <p className="mt-4 text-brand-mist">
                {hospital.address.line1}
                <br />
                {hospital.address.city}, {hospital.address.state} {hospital.address.postalCode}
              </p>
              {hospital.phone && (
                <p className="mt-2 text-brand-mist">
                  <a href={`tel:${hospital.phone}`} className="hover:text-brand-teal">
                    {hospital.phone}
                  </a>
                </p>
              )}
              {hospital.whatsappNumber && (
                <p className="mt-2 text-brand-mist">
                  <a
                    href={`https://wa.me/${hospital.whatsappNumber}`}
                    className="hover:text-brand-teal"
                  >
                    WhatsApp: {hospital.whatsappNumber}
                  </a>
                </p>
              )}
            </div>

            {/* Service Links */}
            <div>
              <h4 className="mb-4 font-semibold">Services</h4>
              <ul className="space-y-2 text-brand-mist">
                {specialities.slice(0, 5).map((speciality) => (
                  <li key={speciality.id}>
                    <Link href="#" className="hover:text-brand-teal">
                      {speciality.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-brand-mist">
                <li>
                  <Link href="#" className="hover:text-brand-teal">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-brand-teal">
                    Our Doctors
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-brand-teal">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-brand-teal">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recent Posts */}
            <div>
              <h4 className="mb-4 font-semibold">Recent Posts</h4>
              <ul className="space-y-2 text-brand-mist">
                {blogs.slice(0, 3).map((blog) => (
                  <li key={blog.id}>
                    <Link href="#" className="hover:text-brand-teal">
                      {blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-line pt-8 text-center text-brand-mist">
            <p>&copy; {new Date().getFullYear()} {hospital.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
