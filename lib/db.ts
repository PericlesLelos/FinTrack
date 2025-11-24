import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable')
}

const pool = global.__pgPool__ ?? new Pool({ connectionString })
if (process.env.NODE_ENV !== 'production') {
    global.__pgPool__ = pool
}

export default pool
