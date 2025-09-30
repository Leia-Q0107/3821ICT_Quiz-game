// app/api/motto/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep in env
});

const FALLBACKS: Record<string, string[]> = {
  'City Visionary': [
    'Build boldly shape tomorrow',
    'Dream bigger lead cities',
    'Create spark change',
  ],
  'Adventurous Scholar': [
    'Chase thrills master skills',
    'Learn fast live bold',
  ],
  'Dynamic Explorer': [
    'Move fast explore more',
    'Go further every day',
  ],
  'Creative Innovator': [
    'Invent wonder inspire change',
    'Make art meet impact',
  ],
  'Focused Scholar': [
    'Quiet focus strong results',
    'Deep work bright paths',
  ],
  'Balanced Adventurer': [
    'Balance paths find power',
    'Live steady dream big',
  ],
  'Nature-Loving Learner': [
    'Grow with sky and soil',
    'Learn outside breathe deeper',
  ],
  'Mindful Learner': [
    'Calm steps clear horizons',
    'Gentle focus great growth',
  ],
  default: ['Explore learn and thrive'],
};

// compress to <= 8 words
function toMaxEightWords(s: string) {
  const cleaned = s
    .replace(/[\u2018\u2019'"\u201C\u201D.,!?;:~`<>()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.split(' ').filter(Boolean).slice(0, 8).join(' ');
}

export async function POST(req: Request) {
  try {
    const { persona = '' } = await req.json().catch(() => ({}));

    const system = [
      'You are a concise copywriter.',
      'Write ONE short ENGLISH motto for the given student persona.',
      'Constraints:',
      '- At most 8 words',
      '- Plain text only (no punctuation or emoji)',
      '- Imperative or inspirational tone',
      '- Avoid repeating the same word',
    ].join('\n');

    const user = `Persona: ${persona}\nReturn ONLY the motto text (<= 8 words).`;

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.9,
      max_tokens: 24,
      stop: ['\n'],
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const raw = resp.choices?.[0]?.message?.content?.trim();
    const mottoRaw =
      raw && raw.length > 0
        ? raw
        : (FALLBACKS[persona]?.[Math.floor(Math.random() * (FALLBACKS[persona]?.length || 1))] ??
           FALLBACKS.default[0]);

    return NextResponse.json({ motto: toMaxEightWords(mottoRaw) });
  } catch (err: any) {
    const msg = String(err?.message || '');
    const status = err?.status || err?.statusCode;
    if (status === 429 || /quota|rate limit/i.test(msg)) {
      const pool = FALLBACKS.default;
      const motto = pool[Math.floor(Math.random() * pool.length)];
      return NextResponse.json({ motto: toMaxEightWords(motto), fallback: true });
    }
    console.error('[api/motto] error:', err);
    return NextResponse.json({ error: 'Failed to generate motto' }, { status: 500 });
  }
}
