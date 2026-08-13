/**
 * Parse Drupal free-text clinic addresses into structured parts.
 * Tuned for Indian addresses (6-digit PIN, state names) with safe fallbacks
 * so Payload required city/state/postalCode never receive empty strings.
 */

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
].sort((a, b) => b.length - a.length)

export type ParsedAddress = {
  line1: string
  city: string
  state: string
  postalCode: string
}

function cleanCommas(value: string): string {
  return value
    .replace(/\s*,\s*/g, ', ')
    .replace(/^(,\s*)+|(,\s*)+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function parseAreaServed(areaServed: string | null | undefined): { city?: string; state?: string } {
  if (!areaServed?.trim()) return {}
  const parts = areaServed.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length >= 2) {
    return { city: parts[0], state: parts.slice(1).join(', ') }
  }
  if (parts.length === 1) {
    const known = INDIAN_STATES.find((s) => s.toLowerCase() === parts[0].toLowerCase())
    if (known) return { state: known }
    return { city: parts[0] }
  }
  return {}
}

export function parseDrupalAddress(
  raw: string | null | undefined,
  areaServed?: string | null,
): ParsedAddress {
  const fallbackArea = parseAreaServed(areaServed)
  const trimmed = (raw || '').toString().trim()

  if (!trimmed) {
    return {
      line1: 'Address unavailable',
      city: fallbackArea.city || 'Unknown',
      state: fallbackArea.state || 'Unknown',
      postalCode: '000000',
    }
  }

  let rest = trimmed
  let postalCode = ''

  const postalMatch = rest.match(/\b(\d{6})\b/)
  if (postalMatch?.[1]) {
    postalCode = postalMatch[1]
    rest = cleanCommas(rest.replace(postalMatch[0], ''))
  }

  let state = ''
  for (const candidate of INDIAN_STATES) {
    const re = new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (re.test(rest)) {
      state = candidate
      rest = cleanCommas(rest.replace(re, ''))
      break
    }
  }

  let city = ''
  const parts = rest.split(',').map((p) => p.trim()).filter(Boolean)

  if (parts.length >= 2) {
    city = parts[parts.length - 1] || ''
    rest = parts.slice(0, -1).join(', ')
  } else if (parts.length === 1 && state) {
    // e.g. "Some Street Bengaluru" after state stripped — keep as line1
    rest = parts[0]
  }

  if (!city && fallbackArea.city) city = fallbackArea.city
  if (!state && fallbackArea.state) state = fallbackArea.state

  return {
    line1: cleanCommas(rest) || trimmed,
    city: city || 'Unknown',
    state: state || 'Unknown',
    postalCode: postalCode || '000000',
  }
}
