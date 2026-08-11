/**
 * @deprecated Prefer `lib/mappers/doctor-mapper.ts` (JSON:API team → doctors flatten).
 * Kept as a thin re-export so older import scripts keep resolving.
 */
export {
  mapDoctorTeamMember,
  mapDrupalDoctorTeam as mapDrupalDoctor,
} from '../lib/mappers/doctor-mapper'
export type { MappedDoctor } from '../lib/mappers/doctor-mapper'
