// app/admin/page.tsx
import { Suspense } from 'react';
import AdminCharts from '@/components/AdminCharts';
import { query } from '@/lib/db'; // 直接查库

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PersonaName =
  | 'City Visionary'
  | 'Adventurous Scholar'
  | 'Dynamic Explorer'
  | 'Creative Innovator'
  | 'Focused Scholar'
  | 'Balanced Adventurer'
  | 'Nature-Loving Learner'
  | 'Mindful Learner';

type FirestoreTimestamp = { seconds: number; nanoseconds: number };
type CreatedAt = FirestoreTimestamp | string | number | null | undefined;

type Item = {
  id: string;
  answers: Record<string, string>;
  persona: PersonaName | string;
  createdAt?: CreatedAt;
  meta?: Record<string, unknown>;
};

function emptyPersonaCounts(): Record<PersonaName, number> {
  return {
    'City Visionary': 0,
    'Adventurous Scholar': 0,
    'Dynamic Explorer': 0,
    'Creative Innovator': 0,
    'Focused Scholar': 0,
    'Balanced Adventurer': 0,
    'Nature-Loving Learner': 0,
    'Mindful Learner': 0,
  };
}

async function getDataDirect(): Promise<Item[]> {
  // 直接从数据库读取，并把 created_at 映射为 createdAt（驼峰）
  const { rows } = await query<{
    id: string;
    answers: unknown;
    persona: string;
    meta: unknown;
    createdAt: string;
  }>`
    SELECT
      id,
      (answers)::jsonb  AS answers,
      persona,
      (meta)::jsonb     AS meta,
      created_at        AS "createdAt"
    FROM quiz_submissions
    ORDER BY created_at DESC NULLS LAST
    LIMIT 500
  `;

  // rows 已经是页面需要的字段名格式
  return rows.map((r) => ({
    id: r.id,
    answers: (r.answers ?? {}) as Record<string, string>,
    persona: r.persona,
    meta: (r.meta ?? {}) as Record<string, unknown>,
    createdAt: r.createdAt,
  }));
}

function formatCreatedAt(input: CreatedAt): string {
  if (input == null) return '—';
  try {
    if (typeof input === 'string' || typeof input === 'number') {
      const d = new Date(input);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }
    if (typeof input === 'object' && 'seconds' in input && typeof input.seconds === 'number') {
      const d = new Date(input.seconds * 1000);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString();
    }
  } catch {}
  return '—';
}

export default async function AdminPage() {
  //  改为直接查库
  const items = await getDataDirect();

  const personaCounts = items.reduce<Record<PersonaName, number>>((acc, it) => {
    if (it.persona in acc) acc[it.persona as PersonaName] += 1;
    return acc;
  }, emptyPersonaCounts());

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quiz Dashboard</h1>
      </div>

      <Suspense fallback={<p className="text-slate-600">Loading charts…</p>}>
        <AdminCharts personas={personaCounts} />
      </Suspense>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3 text-slate-800">Recent submissions</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-slate-100 text-slate-800 sticky top-0 z-10">
                <tr className="[&>th]:font-semibold [&>th]:px-3 [&>th]:py-2">
                  <th className="text-left">When</th>
                  <th className="text-left">Persona</th>
                  <th className="text-left">q1–q7</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {items.slice(0, 25).map((it, i) => (
                  <tr
                    key={it.id}
                    className={`border-t border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{formatCreatedAt(it.createdAt)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{it.persona}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const)
                        .map((k) => it.answers?.[k] ?? '—')
                        .join(' | ')}
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td className="px-3 py-10 text-slate-500 text-center" colSpan={3}>
                      No data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
