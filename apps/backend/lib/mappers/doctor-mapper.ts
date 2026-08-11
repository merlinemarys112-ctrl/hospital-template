import {
  absoluteFileUrl,
  type DrupalDoctorTeamMemberResource,
  type DrupalDoctorTeamResource,
  getRelationshipData,
  type JsonApiResource,
  type JsonApiResourceIdentifier,
  resolveIncluded,
  resolveIncludedMany,
} from '../drupal-client'

/**
 * Flattened doctor record for sync (1 team node → many doctor records).
 */
export type MappedDoctor = {
  /** paragraph--doctor_team UUID */
  drupalParagraphId: string
  /** paragraph attributes.drupal_internal__id */
  drupalInternalId: number
  /** trimmed field_doctor_name */
  name: string
  /** trimmed field_doctor_team_qualification */
  qualification: string
  /** trimmed field_doctor_team_speciality */
  speciality: string
  /**
   * field_doctor_team_descriptiom.processed (fallback .value).
   * NOTE: "descriptiom" typo is intentional — matches Drupal API spelling.
   */
  bioHtml: string
  /** Resolved from field_doctor_image → file--file via included */
  photoUrl: string | null
  /** field_doctor_image relationship data.meta.alt */
  photoAlt: string | null
  /** Parent node--doctor_s_team UUID */
  teamNodeId: string
  /** Parent team title, e.g. "Team of Dr. Mahesh Channappa" */
  teamTitle: string
  /**
   * TODO: clinic↔team link is unresolved — doctor_s_team / doctor_team payloads have no
   * clinic ref. Investigate clinic-side relationships via fetchClinicByUuidRaw().
   * Do not invent a field name.
   */
  clinicDrupalUuid: string | null
}

type DrupalTextField = {
  value?: string | null
  format?: string | null
  processed?: string | null
}

function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function bioFromDescription(raw: unknown): string {
  // NOTE: field name is intentionally misspelled "descriptiom" in the Drupal API
  if (!raw || typeof raw !== 'object') return ''
  const field = raw as DrupalTextField
  const processed = typeof field.processed === 'string' ? field.processed.trim() : ''
  if (processed) return processed
  return typeof field.value === 'string' ? field.value.trim() : ''
}

function imageRelationshipMeta(
  member: DrupalDoctorTeamMemberResource,
): { ref: JsonApiResourceIdentifier | null; alt: string | null } {
  const rel = member.relationships?.field_doctor_image
  if (!rel || rel.data == null) return { ref: null, alt: null }

  const data = rel.data
  if (Array.isArray(data)) {
    const first = data[0]
    if (!first) return { ref: null, alt: null }
    const alt = typeof first.meta?.alt === 'string' ? first.meta.alt : null
    return { ref: first, alt }
  }

  const alt = typeof data.meta?.alt === 'string' ? data.meta.alt : null
  return { ref: data, alt }
}

/**
 * Map one paragraph--doctor_team into a MappedDoctor.
 * Returns null (and logs a warning) when field_doctor_name is missing — does not throw.
 */
export function mapDoctorTeamMember(
  member: DrupalDoctorTeamMemberResource,
  included: JsonApiResource[],
  context: {
    teamNodeId: string
    teamTitle: string
  },
): MappedDoctor | null {
  if (member.type !== 'paragraph--doctor_team') {
    console.warn(
      `[doctor-mapper] Skipping unexpected type ${member.type} (id=${member.id})`,
    )
    return null
  }

  const attrs = member.attributes as Record<string, unknown>
  const name = trimString(attrs.field_doctor_name)

  if (!name) {
    console.warn(
      `[doctor-mapper] Skipping paragraph ${member.id}: missing field_doctor_name`,
      { teamNodeId: context.teamNodeId, teamTitle: context.teamTitle },
    )
    return null
  }

  const { ref: imageRef, alt: photoAlt } = imageRelationshipMeta(member)
  const imageFile = imageRef ? resolveIncluded(imageRef, included) : null
  const photoUrl = absoluteFileUrl(imageFile)

  const drupalInternalId = Number(attrs.drupal_internal__id)
  if (!Number.isFinite(drupalInternalId)) {
    console.warn(
      `[doctor-mapper] paragraph ${member.id} missing drupal_internal__id — using 0`,
    )
  }

  return {
    drupalParagraphId: member.id,
    drupalInternalId: Number.isFinite(drupalInternalId) ? drupalInternalId : 0,
    name,
    qualification: trimString(attrs.field_doctor_team_qualification),
    speciality: trimString(attrs.field_doctor_team_speciality),
    // NOTE: "descriptiom" spelling is correct for this API — do not "fix"
    bioHtml: bioFromDescription(attrs.field_doctor_team_descriptiom),
    photoUrl,
    photoAlt,
    teamNodeId: context.teamNodeId,
    teamTitle: context.teamTitle,
    // TODO: still null — clinic link not on team/paragraph; see fetchClinicByUuidRaw()
    clinicDrupalUuid: null,
  }
}

/**
 * Flatten a node--doctor_s_team + its included paragraph--doctor_team members
 * into individual Doctor records (skips members without a name).
 */
export function mapDrupalDoctorTeam(
  team: DrupalDoctorTeamResource,
  included: JsonApiResource[] = [],
): MappedDoctor[] {
  if (team.type !== 'node--doctor_s_team') {
    throw new Error(`doctor-mapper: expected node--doctor_s_team, got ${team.type}`)
  }

  const memberRefs = getRelationshipData(team, 'field_doctor_team_member')
  const refs = Array.isArray(memberRefs) ? memberRefs : memberRefs ? [memberRefs] : []
  const members = resolveIncludedMany(refs, included).filter(
    (item): item is DrupalDoctorTeamMemberResource => item.type === 'paragraph--doctor_team',
  )

  const teamTitle =
    (typeof team.attributes.title === 'string' && team.attributes.title) ||
    `Doctor team ${team.id}`

  const doctors: MappedDoctor[] = []

  for (const member of members) {
    const mapped = mapDoctorTeamMember(member, included, {
      teamNodeId: team.id,
      teamTitle,
    })
    if (mapped) doctors.push(mapped)
  }

  return doctors
}
