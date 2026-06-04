import pg from 'pg'

const pool = new pg.Pool({
  user: 'bakery_admin',
  password: 'bakery_pass_2026',
  host: 'localhost',
  port: 5432,
  database: 'lebanon_bakery',
})

export default pool
