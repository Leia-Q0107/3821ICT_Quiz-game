'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useMemo, type ComponentType } from 'react';
import type { LegendProps } from 'recharts';

export type PersonaName =
  | 'City Visionary'
  | 'Adventurous Scholar'
  | 'Dynamic Explorer'
  | 'Creative Innovator'
  | 'Focused Scholar'
  | 'Balanced Adventurer'
  | 'Nature-Loving Learner'
  | 'Mindful Learner';

type Props = {
  personas: Record<PersonaName, number>;
};

/** Fixed persona order (used in both charts) */
const PERSONAS: PersonaName[] = [
  'City Visionary',
  'Adventurous Scholar',
  'Dynamic Explorer',
  'Creative Innovator',
  'Focused Scholar',
  'Balanced Adventurer',
  'Nature-Loving Learner',
  'Mindful Learner',
];

/** Color palette (index maps to PERSONAS order) */
const COLORS = [
  '#4D688C', // City Visionary
  '#152840', // Adventurous Scholar
  '#152840', // Dynamic Explorer
  '#4D688C', // Creative Innovator
  '#BF4F26', // Focused Scholar
  '#F2A25C', // Balanced Adventurer
  '#F2A25C', // Nature-Loving Learner
  '#BF4F26', // Mindful Learner
] as const;

/** TS-friendly wrapper for Recharts Legend */
const LegendComponent = Legend as unknown as ComponentType<Partial<LegendProps>>;

export default function AdminCharts({ personas }: Props) {
  // Ensure consistent ordering *and* all 8 personas present
  const pieData = useMemo(
    () =>
      PERSONAS.map((name, idx) => ({
        name,
        value: personas[name] ?? 0,
        color: COLORS[idx],
      })),
    [personas]
  );

  const barData = useMemo(
    () =>
      PERSONAS.map((name, idx) => ({
        persona: name,
        count: personas[name] ?? 0,
        color: COLORS[idx],
      })),
    [personas]
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Personas pie */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-slate-800">Persona distribution</h2>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={110} label>
                {pieData.map((d, idx) => (
                  <Cell key={`pie-${idx}`} fill={d.color} />
                ))}
              </Pie>
              <Tooltip />
              <LegendComponent />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personas bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-slate-800">Persona counts</h2>
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* Force all 8 labels to render and tilt for readability */}
              <XAxis
                dataKey="persona"
                interval={0}
                tick={{ fontSize: 12 }}
                tickMargin={8}
                angle={-15}
                height={50}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <LegendComponent />
              <Bar dataKey="count">
                {barData.map((d, idx) => (
                  <Cell key={`bar-${idx}`} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
