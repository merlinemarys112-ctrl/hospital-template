import { describe, expect, it } from 'vitest'

import { parseDrupalAddress } from '../../lib/mappers/parse-address'

describe('parseDrupalAddress', () => {
  it('parses Synapse-style Indian free-text addresses', () => {
    const parsed = parseDrupalAddress(
      ' 771, 10th Main Road, 34th Cross Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011',
    )

    expect(parsed.postalCode).toBe('560011')
    expect(parsed.state).toBe('Karnataka')
    expect(parsed.city).toBe('Bengaluru')
    expect(parsed.line1).toContain('Jayanagar')
    expect(parsed.line1).not.toContain('Karnataka')
    expect(parsed.line1).not.toContain('560011')
  })

  it('uses areaServed when city/state are missing from the address line', () => {
    const parsed = parseDrupalAddress('12 MG Road', 'Bengaluru, Karnataka')

    expect(parsed.line1).toBe('12 MG Road')
    expect(parsed.city).toBe('Bengaluru')
    expect(parsed.state).toBe('Karnataka')
    expect(parsed.postalCode).toBe('000000')
  })

  it('never returns empty required fields', () => {
    const parsed = parseDrupalAddress('')

    expect(parsed.line1).toBeTruthy()
    expect(parsed.city).toBeTruthy()
    expect(parsed.state).toBeTruthy()
    expect(parsed.postalCode).toBeTruthy()
  })
})
