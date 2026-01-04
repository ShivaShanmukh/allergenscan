import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
console.log('DATABASE_URL from env:', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testDbConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW()');
    console.log('DB connected at', res.rows[0].now);
  } finally {
    client.release();
  }
}

export async function runMigrations() {
  // Create users table if it does not exist
  await pool.query(`CREATE TABLE IF NOT EXISTS users
    (id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Migrations complete');
}
