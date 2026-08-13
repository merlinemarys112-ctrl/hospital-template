import pg from 'pg'

const candidates = [
  'postgres://postgres:1111@localhost:5432/postgres',
  'postgres://postgres:postgres@localhost:5432/postgres',
  'postgres://postgres:postgres@localhost:5433/postgres',
]

async function main() {
  for (const connectionString of candidates) {
    const client = new pg.Client({ connectionString })
    try {
      await client.connect()
      console.log('CONNECTED', connectionString)
      await client.query('CREATE DATABASE marline_test').catch((e) => {
        if (String(e.message).includes('already exists')) {
          console.log('marline_test already exists')
        } else {
          throw e
        }
      })
      console.log('READY marline_test on', connectionString.replace(/\/postgres$/, '/marline_test'))
      await client.end()
      process.exit(0)
    } catch (e) {
      console.log('FAIL', connectionString, e instanceof Error ? e.message : e)
      try {
        await client.end()
      } catch {
        // ignore
      }
    }
  }
  process.exit(1)
}

main()
