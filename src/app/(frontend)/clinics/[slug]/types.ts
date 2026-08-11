import type {
  Article,
  Clinic,
  Doctor,
  DoctorClinicSession,
  Faq,
  Testimonial,
} from '@/payload-types'

/** Doctor resolved from a doctor-clinic-session for this clinic page. */
export type DoctorWithClinicDays = {
  doctor: Doctor
  availableDays: DoctorClinicSession['availableDays']
}

export type ClinicPageData = {
  clinic: Clinic
  doctorSessions: DoctorClinicSession[]
  articles: Article[]
  testimonials: Testimonial[]
  faqs: Faq[]
}
