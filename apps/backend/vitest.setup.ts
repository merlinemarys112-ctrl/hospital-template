import 'dotenv/config'

/**
 * Isolation suite must never touch the developer database.
 * Set ISOLATION_TEST=1 (via test:isolation script) before Payload config loads.
 */
if (process.env.ISOLATION_TEST === '1') {
  process.env.DATABASE_URL =
    process.env.ISOLATION_DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5433/marline_test'
  process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'isolation-test-secret-key'
  process.env.PAYLOAD_PUBLIC_SERVER_URL =
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
  // Avoid noisy revalidation fetch failures during Local API tests
  delete process.env.REVALIDATE_SECRET
}
