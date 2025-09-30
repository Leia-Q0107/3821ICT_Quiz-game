// lib/base-url.ts
export function getBaseUrl() {
  // Prefer an explicit value you set in Vercel → Env Vars
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  // On Vercel this is auto-injected (no protocol), so add https://
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Local dev fallback
  const port = process.env.PORT ?? 3000;
  return `http://localhost:${port}`;
}
