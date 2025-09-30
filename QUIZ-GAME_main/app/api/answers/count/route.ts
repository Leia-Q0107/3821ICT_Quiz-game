// app/api/answers/count/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { rows } = await query<{ count: string }>`
      SELECT COUNT(*)::text AS count
      FROM quiz_submissions
    `;
    // rows[0].count is a string; coerce to number for JSON
    return NextResponse.json({ count: Number(rows[0].count) });
  } catch (err) {
    console.error('GET /api/answers/count error', err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
