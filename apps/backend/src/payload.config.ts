import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Blogs } from './collections/Blogs'
import { Clinics } from './collections/Clinics'
import { DoctorClinicSessions } from './collections/DoctorClinicSessions'
import { Doctors } from './collections/Doctors'
import { FAQs } from './collections/FAQs'
import { GalleryImages } from './collections/GalleryImages'
import { HospitalDoctors } from './collections/HospitalDoctors'
import { HospitalSpecialities } from './collections/HospitalSpecialities'
import { HospitalTestimonials } from './collections/HospitalTestimonials'
import { Hospitals } from './collections/Hospitals'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Specialities } from './collections/Specialities'
import { Tenants } from './collections/Tenants'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { defaultLexical } from '@/fields/defaultLexical'
import { getBackendEnv } from './lib/env'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const env = getBackendEnv()

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
  collections: [
    Tenants,
    Users,
    Media,
    Clinics,
    Hospitals,
    Doctors,
    DoctorClinicSessions,
    Specialities,
    Services,
    Articles,
    Testimonials,
    FAQs,
    HospitalDoctors,
    HospitalSpecialities,
    HospitalTestimonials,
    GalleryImages,
    Blogs,
  ],
  cors: env.corsOrigins,
  csrf: env.csrfOrigins,
  plugins,
  secret: env.PAYLOAD_SECRET,
  serverURL: env.serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
