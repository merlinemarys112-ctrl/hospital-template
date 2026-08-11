import React from 'react'
import Image from 'next/image'

import type {
  Blog,
  GalleryImage,
  Hospital,
  HospitalDoctor,
  HospitalSpeciality,
  HospitalTestimonial,
} from '@/types/cms'
import { mediaSrc, mediaAlt } from '../components/media'

type Props = {
  hospital: Hospital
  doctors: HospitalDoctor[]
  specialities: HospitalSpeciality[]
  galleryImages: GalleryImage[]
  blogs: Blog[]
  testimonials: HospitalTestimonial[]
}

export default function AspireStyleTemplate({
  hospital,
  doctors,
  specialities,
  galleryImages,
  blogs,
  testimonials,
}: Props) {
  const heroSrc = mediaSrc(hospital.heroImage)
  const heroAlt = mediaAlt(hospital.heroImage, `${hospital.name} hero`)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-brand-teal">
        {heroSrc && (
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-brand-teal/70" />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="font-serif text-4xl font-bold md:text-6xl">{hospital.name}</h1>
            {hospital.tagline && (
              <p className="mt-4 text-xl font-light">{hospital.tagline}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-brand-paper py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-8 text-brand-ink">
            {hospital.phone && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Phone:</span>
                <a href={`tel:${hospital.phone}`} className="text-brand-teal hover:underline">
                  {hospital.phone}
                </a>
              </div>
            )}
            {hospital.whatsappNumber && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">WhatsApp:</span>
                <a
                  href={`https://wa.me/${hospital.whatsappNumber}`}
                  className="text-brand-teal hover:underline"
                >
                  {hospital.whatsappNumber}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Address:</span>
              <span>
                {hospital.address.line1}, {hospital.address.city}, {hospital.address.state}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialities */}
      {specialities.length > 0 && (
        <section className="bg-brand-mist py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-ink">Our Specialities</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {specialities.map((speciality) => (
                <div
                  key={speciality.id}
                  className="rounded-lg bg-brand-paper p-6 shadow-sm"
                >
                  {speciality.icon && (
                    <div className="mb-4 h-16 w-16">
                      <Image
                        src={mediaSrc(speciality.icon) || ''}
                        alt={mediaAlt(speciality.icon, speciality.name)}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-brand-ink">{speciality.name}</h3>
                  {speciality.description && (
                    <p className="mt-2 text-brand-ink-soft">{speciality.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {doctors.length > 0 && (
        <section className="bg-brand-paper py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-ink">Our Doctors</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="rounded-lg bg-brand-mist p-6 shadow-sm">
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
                  <h3 className="text-xl font-semibold text-brand-ink">{doctor.name}</h3>
                  {doctor.designation && (
                    <p className="text-brand-teal">{doctor.designation}</p>
                  )}
                  {doctor.speciality && (
                    <p className="mt-1 text-sm text-brand-ink-soft">{doctor.speciality}</p>
                  )}
                  {doctor.experience && (
                    <p className="mt-1 text-sm text-brand-ink-soft">
                      Experience: {doctor.experience}
                    </p>
                  )}
                  {doctor.qualification && (
                    <p className="mt-1 text-sm text-brand-ink-soft">{doctor.qualification}</p>
                  )}
                  {doctor.description && (
                    <p className="mt-2 text-sm text-brand-ink-soft">{doctor.description}</p>
                  )}
                  {doctor.languages && (
                    <p className="mt-2 text-xs text-brand-ink-soft">
                      Languages: {doctor.languages}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="bg-brand-mist py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-ink">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg bg-brand-paper shadow-sm">
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
                    {image.category && (
                      <span className="inline-block mt-2 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                        {image.category}
                      </span>
                    )}
                    {image.description && (
                      <p className="mt-2 text-sm text-brand-ink-soft">{image.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blogs */}
      {blogs.length > 0 && (
        <section className="bg-brand-paper py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-ink">Latest Blogs</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <article key={blog.id} className="rounded-lg bg-brand-mist p-6 shadow-sm">
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
                  <h3 className="text-xl font-semibold text-brand-ink">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="mt-2 text-brand-ink-soft">{blog.excerpt}</p>
                  )}
                  {blog.author && (
                    <p className="mt-2 text-sm text-brand-ink-soft">By {blog.author}</p>
                  )}
                  {blog.publishedDate && (
                    <p className="mt-1 text-xs text-brand-ink-soft">
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </p>
                  )}
                  {blog.category && (
                    <span className="inline-block mt-2 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal">
                      {blog.category}
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-brand-mist py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-ink">Patient Testimonials</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-lg bg-brand-paper p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-4">
                    {testimonial.image && (
                      <div className="h-16 w-16 overflow-hidden rounded-full">
                        <Image
                          src={mediaSrc(testimonial.image) || ''}
                          alt={mediaAlt(testimonial.image, testimonial.patientName)}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-brand-ink">{testimonial.patientName}</h3>
                      {testimonial.rating && (
                        <div className="flex text-yellow-500">
                          {'★'.repeat(testimonial.rating)}
                          {'☆'.repeat(5 - testimonial.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-brand-ink-soft italic">&ldquo;{testimonial.testimonial}&rdquo;</p>
                  {testimonial.treatment && (
                    <p className="mt-2 text-sm text-brand-ink-soft">
                      Treatment: {testimonial.treatment}
                    </p>
                  )}
                  {testimonial.date && (
                    <p className="mt-1 text-xs text-brand-ink-soft">
                      {new Date(testimonial.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer with Booking Link */}
      <footer className="bg-brand-ink py-8 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h3 className="font-serif text-2xl font-bold">{hospital.name}</h3>
          <p className="mt-2 text-brand-ink-soft">
            {hospital.address.line1}, {hospital.address.city}, {hospital.address.state}{' '}
            {hospital.address.postalCode}
          </p>
          {hospital.linqmdBookingSlug && (
            <a
              href={`https://linqmd.com/hospital/${hospital.linqmdBookingSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-brand-teal px-6 py-3 font-semibold hover:bg-brand-teal-deep"
            >
              Book Appointment
            </a>
          )}
        </div>
      </footer>
    </div>
  )
}
