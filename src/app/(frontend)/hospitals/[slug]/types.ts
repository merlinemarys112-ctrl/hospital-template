import type {
  Blog,
  GalleryImage,
  Hospital,
  HospitalDoctor,
  HospitalSpeciality,
  HospitalTestimonial,
} from '@/payload-types'

export type HospitalPageData = {
  hospital: Hospital
  doctors: HospitalDoctor[]
  specialities: HospitalSpeciality[]
  galleryImages: GalleryImage[]
  blogs: Blog[]
  testimonials: HospitalTestimonial[]
}
