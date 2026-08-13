/**
 * Structural CMS types for the public frontend.
 * Kept intentional and lean — not a full dump of Payload generated types.
 */

export type Media = {
  id: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
  updatedAt?: string | null
  sizes?: {
    thumbnail?: { url?: string | null }
    small?: { url?: string | null }
    medium?: { url?: string | null }
    large?: { url?: string | null }
    og?: { url?: string | null }
    [key: string]: { url?: string | null } | undefined
  } | null
}

export type Clinic = {
  id: string | number
  name: string
  slug: string
  phone: string
  email?: string | null
  description?: string | null
  template?: string | null
  logo?: number | Media | null
  banners?: {
    desktopBanner?: number | Media | null
    mobileBanner?: number | Media | null
  } | null
  address: {
    line1: string
    city: string
    state: string
    postalCode: string
    latitude: number
    longitude: number
  }
  mapHtml?: string | null
  rating?: number | null
  reviewCount?: number | null
  showBlogs?: boolean | null
  showTestimonials?: boolean | null
  specialities?: Array<number | Speciality> | null
  services?: Array<number | Service> | null
  specialitiesSection?: {
    mainTitle?: string | null
    subMainTitle?: string | null
    items?: Array<{
      title?: string | null
      shortDescription?: string | null
      logo?: number | Media | null
    }> | null
  } | null
  servicesSection?: {
    mainTitle?: string | null
    items?: Array<{ title?: string | null; logo?: number | Media | null }> | null
  } | null
  youtubeVideos?: Array<{
    embedUrl?: string | null
    title?: string | null
    description?: string | null
  }> | null
}

export type Doctor = {
  id: string | number
  name: string
  slug: string
  photo: number | Media
  tagline?: string | null
  experienceYears?: number | null
  bio?: unknown
  specialities?: Array<number | Speciality> | null
  stats?: Array<{ label?: string | null }> | null
}

export type DoctorClinicSession = {
  id: string | number
  doctor: number | Doctor
  clinic: number | Clinic
  consultationDuration: number
  availableDays: Array<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>
}

/** Doctor resolved from a doctor-clinic-session for this clinic page. */
export type DoctorWithClinicDays = {
  doctor: Doctor
  availableDays: DoctorClinicSession['availableDays']
}

export type Article = {
  id: string | number
  title: string
  slug: string
  coverImage: number | Media
  excerpt: string
  publishedDate: string
}

export type Testimonial = {
  id: string | number
  title?: string | null
  patientName?: string | null
  review?: string | null
  quote?: string | null
  content?: string | null
  rating?: number | null
  role?: string | null
  doctor?: number | Doctor | null
  tags?: Array<{ tag?: string | null }> | null
}

export type Faq = {
  id: string | number
  question?: string | null
  answer?: string | null
  category?: string | null
  doctor?: number | Doctor | null
  verifiedPatient?: boolean | null
  visitReason?: string | null
}

export type Speciality = {
  id: string | number
  name?: string | null
  title?: string | null
  description?: string | null
  icon?: number | Media | null
}

export type Service = {
  id: string | number
  name?: string | null
  title?: string | null
  icon?: number | Media | null
  image?: number | Media | null
}

export type Hospital = {
  id: string | number
  name: string
  slug: string
  tagline?: string | null
  template?: string | null
  heroImage?: number | Media | null
  phone: string
  whatsappNumber?: string | null
  linqmdBookingSlug: string
  address: {
    line1: string
    city: string
    state: string
    postalCode: string
    latitude: number
    longitude: number
  }
}

export type HospitalDoctor = {
  id: string | number
  name: string
  designation?: string | null
  speciality?: string | null
  experience?: string | null
  qualification?: string | null
  image?: number | Media | null
  description?: string | null
  languages?: string | null
}

export type HospitalSpeciality = {
  id: string | number
  name: string
  description?: string | null
  icon?: number | Media | null
}

export type GalleryImage = {
  id: string | number
  title: string
  image: number | Media
  category?: string | null
  description?: string | null
}

export type Blog = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: number | Media | null
  author?: string | null
  publishedDate?: string | null
  category?: string | null
}

export type HospitalTestimonial = {
  id: string | number
  patientName: string
  rating?: number | null
  testimonial: string
  date?: string | null
  treatment?: string | null
  image?: number | Media | null
}

export type ClinicPageData = {
  clinic: Clinic
  doctorSessions: DoctorClinicSession[]
  articles: Article[]
  testimonials: Testimonial[]
  faqs: Faq[]
}

export type HospitalPageData = {
  hospital: Hospital
  doctors: HospitalDoctor[]
  specialities: HospitalSpeciality[]
  galleryImages: GalleryImage[]
  blogs: Blog[]
  testimonials: HospitalTestimonial[]
}
