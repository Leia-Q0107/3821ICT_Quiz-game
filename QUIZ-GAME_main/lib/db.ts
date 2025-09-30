// lib/db.ts
import { Pool, type QueryResult, type QueryResultRow } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// ---- Global singleton (safe for serverless / hot reload) ----
declare global {
  var __PG_POOL__: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    // Hosted Postgres usually requires TLS; skip CA verification in serverless.
    ssl: { rejectUnauthorized: false },
    max: Number(process.env.PG_MAX ?? 5),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 10_000),
    connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS ?? 5_000),
    keepAlive: true,
    allowExitOnIdle: true,
  });
}

export const pool: Pool =
  global.__PG_POOL__ ?? (global.__PG_POOL__ = createPool());

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

/** Build parameterized query text from a tagged template */
function buildText(strings: TemplateStringsArray, values: readonly unknown[]) {
  return strings[0] + values.map((_, i) => `$${i + 1}` + strings[i + 1]).join('');
}

/** Type guard for Node-style errors with a `code` property */
function getErrorCode(err: unknown): string | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  // Avoid `any`: narrow to an object that may have a string code
  const maybe = err as { code?: unknown };
  return typeof maybe.code === 'string' ? maybe.code : undefined;
}

/** Decide if we should retry on a transient network error */
function shouldRetry(err: unknown): boolean {
  const code = getErrorCode(err);
  return code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'EAI_AGAIN';
}

/**
 * Tagged-template query helper:
 *   const { rows } = await query`SELECT * FROM t WHERE id=${id}`;
 */
export async function query<O extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: readonly SqlParamIn[]
): Promise<QueryResult<O>> {
  const text = buildText(strings, values);
  const params = normalizeParams(values);

  try {
    return await pool.query<O>(text, params);
  } catch (err) {
    if (shouldRetry(err)) {
      return await pool.query<O>(text, params);
    }
    throw err;
  }
}
