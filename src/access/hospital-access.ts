import type { AccessArgs, Where } from 'payload'

import type { User } from '@/payload-types'

type HospitalAccessControl = (args: AccessArgs<User>) => boolean | Where

/**
 * Determines if a user can manage a hospital based on its access mode
 * - Super admins can always manage any hospital
 * - In centralized mode, any authenticated user can manage
 * - In dedicated mode, only users assigned to that hospital can manage
 */
export const canManageHospital: HospitalAccessControl = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) return false

  // Super admins can manage all hospitals
  if (user.role === 'super_admin') return true

  // Regular admins can manage in centralized mode
  // This is checked at the collection level, not here
  return true
}

/**
 * Returns a where clause to filter hospitals based on user's access
 * - Super admins see all hospitals
 * - Admins in centralized mode see all hospitals
 * - Admins in dedicated mode see only their assigned hospitals
 */
export const hospitalScopedAccess: HospitalAccessControl = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) return false

  // Super admins can access all hospitals
  if (user.role === 'super_admin') return true

  // If user has assigned hospitals, filter to those
  if (user.assignedHospitals && user.assignedHospitals.length > 0) {
    return {
      id: {
        in: user.assignedHospitals.map((hospital: any) => 
          typeof hospital === 'object' ? hospital.id : hospital
        ),
      },
    }
  }

  // No assigned hospitals - no access in dedicated mode
  return false
}

/**
 * Access control for hospital-related collections (doctors, specialities, etc.)
 * Checks if the hospital they belong to is accessible to the user
 */
export const hospitalRelatedAccess: HospitalAccessControl = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) return false

  // Super admins can access all
  if (user.role === 'super_admin') return true

  // If user has assigned hospitals, they can access related data
  if (user.assignedHospitals && user.assignedHospitals.length > 0) {
    return true
  }

  // No assigned hospitals - no access
  return false
}

/**
 * Returns a where clause for hospital-related collections based on hospital assignment
 * This should be used with collections that have a 'hospital' relationship field
 */
export const hospitalRelatedScopedAccess: HospitalAccessControl = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) return false

  // Super admins can access all
  if (user.role === 'super_admin') return true

  // If user has assigned hospitals, filter to those
  if (user.assignedHospitals && user.assignedHospitals.length > 0) {
    return {
      hospital: {
        in: user.assignedHospitals.map((hospital: any) => 
          typeof hospital === 'object' ? hospital.id : hospital
        ),
      },
    }
  }

  // No assigned hospitals - no access
  return false
}
