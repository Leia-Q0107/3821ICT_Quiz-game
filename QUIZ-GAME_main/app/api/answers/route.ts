// app/api/answers/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

export const runtime = 'nodejs';

const AnswerSchema = z.object({
  answers: z.record(z.string(), z.string()),
  persona: z.string(),
  meta: z.record(z.unknown()).optional(),
});

type SubmissionRow = {
  id: string;
  answers: unknown;         
  persona: string;
  meta: unknown;              
  created_at: string;        
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AnswerSchema.parse(body);
    const id = crypto.randomUUID();

    await query`
      INSERT INTO quiz_submissions (id, answers, persona, meta)
      VALUES (
        ${id},
        ${JSON.stringify(parsed.answers)}::jsonb,
        ${parsed.persona},
        ${JSON.stringify(parsed.meta ?? {})}::jsonb
      )
    `;

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('POST /api/answers error', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitParam = Number(url.searchParams.get('limit') ?? '100');
  const capped = Math.max(1, Math.min(Number.isFinite(limitParam) ? limitParam : 100, 1000));

  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token || token !== (process.env.ANALYTICS_API_KEY ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await query<SubmissionRow>`
      SELECT id, answers, persona, meta, created_at
      FROM quiz_submissions
      ORDER BY created_at DESC
      LIMIT ${capped}
    `;

    //  统一 createdAt，契合 /admin 的类型 Item
    const items = rows.map((r) => ({
      id: r.id,
      answers: r.answers as Record<string, string>,
      persona: r.persona,
      meta: (r.meta ?? {}) as Record<string, unknown>,
      createdAt: r.created_at,              // 关键映射
    }));

    return NextResponse.json({ items });
  } catch (err) {
    console.error('GET /api/answers error', err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
