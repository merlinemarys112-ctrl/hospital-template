import type { Clinic, Doctor, DoctorClinicSession, Article, Testimonial, Faq, Service, Speciality } from '@/payload-types'

import { ArticleCard } from '../components/ArticleCard'
import { DoctorCard } from '../components/DoctorCard'
import { FAQItem } from '../components/FAQItem'
import { Hero } from '../components/Hero'
import { MapEmbed } from '../components/MapEmbed'
import { ServicesGrid } from '../components/ServicesGrid'
import { SpecialitiesGrid } from '../components/SpecialitiesGrid'
import { TestimonialCard } from '../components/TestimonialCard'
import type { DoctorWithClinicDays } from '../types'

type Props = {
  clinic: Clinic
  doctorSessions: DoctorClinicSession[]
  articles: Article[]
  testimonials: Testimonial[]
  faqs: Faq[]
}

const TESTIMONIAL_FILTERS = ['All', 'Treatment', 'Staff', 'Facilities', 'Wait Time']
const FAQ_TABS = ['All', 'Consultation', 'Procedures', 'Billing', 'Follow-up']

export default function ClassicTealTemplate({
  clinic,
  doctorSessions,
  articles,
  testimonials,
  faqs,
}: Props) {
  const specialities = (clinic.specialities || []).filter(
    (item): item is Speciality => typeof item === 'object' && item !== null,
  )

  const services = (clinic.services || []).filter(
    (item): item is Service => typeof item === 'object' && item !== null,
  )

  const doctorsWithDays: DoctorWithClinicDays[] = doctorSessions
    .map((session) => {
      const doctor = session.doctor
      if (typeof doctor !== 'object' || doctor === null) return null
      return {
        doctor: doctor as Doctor,
        availableDays: session.availableDays,
      }
    })
    .filter((item): item is DoctorWithClinicDays => Boolean(item))

  const testimonialTags = Array.from(
    new Set(
      testimonials.flatMap((t) => (t.tags || []).map((entry) => entry.tag).filter(Boolean)),
    ),
  )
  const filterTags = testimonialTags.length > 0 ? ['All', ...testimonialTags] : TESTIMONIAL_FILTERS

  return (
    <>
      <Hero
        name={clinic.name}
        rating={clinic.rating}
        address={clinic.address}
        heroImage={clinic.banners?.desktopBanner || clinic.banners?.mobileBanner || undefined}
      />

      {specialities.length > 0 && <SpecialitiesGrid specialities={specialities} />}

      {doctorsWithDays.length > 0 && (
        <section className="bg-brand-paper pb-8 md:pb-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            {doctorsWithDays.map(({ doctor, availableDays }) => (
              <DoctorCard key={doctor.id} doctor={doctor} availableDays={availableDays} />
            ))}
          </div>
        </section>
      )}

      {services.length > 0 && <ServicesGrid services={services} />}

      <section id="articles" className="scroll-mt-28 bg-brand-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-3xl tracking-tight text-brand-ink md:text-4xl">
              Latest News & Articles
            </h2>
            <p className="font-clinic-mono text-xs uppercase tracking-[0.16em] text-brand-ink-soft">
              {articles.length} result{articles.length === 1 ? '' : 's'}
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} clinicName={clinic.name} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-brand-ink-soft">No articles published yet.</p>
          )}
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-28 bg-brand-mist py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-3xl tracking-tight text-brand-ink md:text-4xl">
              Patient Testimonials
            </h2>
            <p className="font-clinic-mono text-xs uppercase tracking-[0.16em] text-brand-ink-soft">
              {testimonials.length} result{testimonials.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Testimonial filters">
            {filterTags.map((tag, index) => (
              <button
                key={tag}
                type="button"
                className={`border px-3 py-1.5 text-xs transition-colors ${
                  index === 0
                    ? 'border-brand-teal bg-brand-teal text-white'
                    : 'border-brand-line bg-white text-brand-ink-soft'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {testimonials.length > 0 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                className="border border-brand-ink px-6 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="faqs" className="scroll-mt-28 bg-brand-paper py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-3xl tracking-tight text-brand-ink md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="font-clinic-mono text-xs uppercase tracking-[0.16em] text-brand-ink-soft">
              {faqs.length} result{faqs.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
            {FAQ_TABS.map((tab, index) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={index === 0}
                className={`border px-3 py-1.5 text-xs transition-colors ${
                  index === 0
                    ? 'border-brand-teal bg-brand-teal text-white'
                    : 'border-brand-line bg-white text-brand-ink-soft'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          {faqs.length > 0 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                className="border border-brand-ink px-6 py-2.5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      <MapEmbed
        latitude={clinic.address.latitude}
        longitude={clinic.address.longitude}
        clinicName={clinic.name}
      />
    </>
  )
}
