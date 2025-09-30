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
  createdAt: string;      //  直接在 SQL 里把 created_at 别名成驼峰
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

  // 允许“同源内部请求”免密通过（SSR/站点自身访问）
  const reqHost = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  const isSameOrigin = !!reqHost && reqHost.toLowerCase() === url.host.toLowerCase();

  // 对外部请求仍要求 Bearer
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const tokenOk = !!token && token === (process.env.ANALYTICS_API_KEY ?? '');

  if (!isSameOrigin && !tokenOk) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    //  1) 直接在 SQL 层完成字段对齐与类型稳定
    const { rows } = await query<SubmissionRow>`
      SELECT
        id,
        (answers)::jsonb        AS answers,
        persona,
        (meta)::jsonb           AS meta,
        created_at              AS "createdAt"   --  别名成页面预期
      FROM quiz_submissions
      ORDER BY created_at DESC NULLS LAST
      LIMIT ${capped}
    `;

    // 2) 轻量自检日志（部署后可删除）
    console.log('GET /api/answers rows:', rows.length);

    // 3) 直接返回页面所需结构（Item[]）
    return NextResponse.json({ items: rows });
  } catch (err) {
    console.error('GET /api/answers SQL error:', err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
