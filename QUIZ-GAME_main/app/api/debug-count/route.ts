// app/api/debug-count/route.ts (temporary)
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
export const runtime = 'nodejs';
export async function GET() {
  try {
    const { rows } = await query<{ count: string }>`select count(*) from quiz_submissions`;
    return NextResponse.json({ count: Number(rows[0].count) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
