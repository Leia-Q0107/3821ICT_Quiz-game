import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    // No CREATE EXTENSION — provider forbids it
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id UUID PRIMARY KEY,                       -- no DEFAULT; app will generate
        answers JSONB NOT NULL,
        persona TEXT NOT NULL,
        meta JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // Helpful index (optional)
    await client.query(`CREATE INDEX IF NOT EXISTS ix_quiz_submissions_created_at ON quiz_submissions (created_at DESC)`);

    console.log('quiz_submissions ready');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(' db-ensure failed:', err);
  process.exitCode = 1;
});
