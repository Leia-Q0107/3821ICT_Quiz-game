// lib/db.ts
import { Pool, type QueryResult, type QueryResultRow } from 'pg';

// Singleton pool (safe in Next.js Node runtime)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Most hosted Postgres require SSL; disable CA verification for convenience
  ssl: { rejectUnauthorized: false },
});

/** Values you allow at call sites */
type SqlParamIn = string | number | boolean | null | Date | Uint8Array;
/** Values pg accepts as parameters */
type PgParam = string | number | boolean | null;

/** Convert JS values to driver-friendly primitives */
function normalizeParams(values: readonly SqlParamIn[]): PgParam[] {
  return values.map((v): PgParam => {
    if (v instanceof Date) return v.toISOString();
    if (v instanceof Uint8Array) return Buffer.from(v).toString('base64');
    return v as PgParam;
  });
}

/**
 * Tagged-template query helper:
 *   const { rows } = await query`SELECT * FROM t WHERE id=${id}`;
 */
export async function query<O extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: readonly SqlParamIn[]
): Promise<QueryResult<O>> {
  // Build parameterized query: $1, $2, ...
  const text =
    strings[0] + values.map((_, i) => `$${i + 1}` + strings[i + 1]).join('');

  const params = normalizeParams(values); // PgParam[]
  return pool.query<O>(text, params);
}

export { pool };
