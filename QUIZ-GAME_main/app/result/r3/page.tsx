'use client';

import React, { useEffect, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const bagel400 = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey = 'main' | 'baseCamp' | 'personality' | 'lucky' | 'partner' | 'motto' | null;

const MODAL: Record<Exclude<ModalKey, null>, { title: string; body: string }> = {
  main: {
    title: 'Focused Scholar',
    body:
      'A peaceful and serene environment is where you flourish. You prefer calm surroundings that allow for deep concentration and reflection. Your commitment to your studies is unwavering, and you value the tranquillity that supports your learning journey.',
  },
  baseCamp: { title: 'Base Camp', body: 'Quiet and Relaxed.' },
  personality: { title: 'Personality', body: 'Serious Study Person.' },
  lucky: { title: 'Lucky Charm', body: 'With the headphones, you are able to concentrate better.' },
  partner: { title: 'Partner', body: 'Mindful Learner.' },
  motto: { title: 'Motto', body: 'Coming soon.' },
};

// Keep only letters/numbers/spaces. Max 8 words.
function sanitizeToEightWords(s: string) {
  const cleaned = (s || '')
    .replace(/[“”"‘’'`.,!?;:|/\\(){}\[\]<>~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  return words.slice(0, 8).join(' ');
}

// Type guard to ignore AbortError without using `any`
function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'AbortError';
  }
  return typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'AbortError';
}

export default function R3Page() {
  const [open, setOpen] = useState<ModalKey>(null);

  // Motto from API
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;

    async function run() {
      try {
        // optimistic cache to avoid blank state
        const cached = typeof window !== 'undefined' ? localStorage.getItem('motto_r3') || '' : '';
        if (cached) setMotto(cached);

        const resp = await fetch(`/api/motto?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona: 'Focused Scholar' }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = (await resp.json()) as { motto?: string };
        const safe = sanitizeToEightWords(data?.motto || '');
        const finalText = safe || 'Explore learn and thrive';

        if (!aborted) {
          setMotto(finalText);
          if (typeof window !== 'undefined') localStorage.setItem('motto_r3', finalText);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        // eslint-disable-next-line no-console
        console.error('[r3] motto api failed:', err);
        if (!aborted && !motto) setMotto('Explore learn and thrive');
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    run();
    return () => {
      aborted = true;
      controller.abort();
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      {/* 390 x 844 canvas */}
      <div
        className="relative w-[390px] h-[844px] rounded-[28px] overflow-hidden shadow-2xl"
        style={{ background: '#F2D9BB' }}
      >
        {/* Top Title */}
        <span
          className={dongle700.className}
          style={{
            position: 'absolute',
            top: 40,
            left: 29,
            width: 316,
            height: 32,
            fontSize: 24,
            lineHeight: '32px',
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          You are a...!
        </span>

        {/* Main Illustration */}
        <img
          src="/r3/Focused_Scholar.png"
          alt="Focused Scholar"
          className="absolute select-none pointer-events-none"
          style={{ left: 79, top: 79, width: 217, height: 217 }}
          draggable={false}
        />

        {/* Three keywords */}
        <div
          className={dongle700.className}
          style={{
            position: 'absolute',
            left: 98,
            top: 305,
            display: 'flex',
            gap: 16,
            fontSize: 18,
            lineHeight: '20px',
          }}
        >
          <span style={{ color: '#BF4F26' }}>Patient</span>
          <span style={{ color: '#4D688C' }}>Organised</span>
          <span style={{ color: '#F2A25C' }}>Calm</span>
        </div>

        {/* Large card header bar */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 329,
            width: 299,
            height: 42,
            background: '#BF4F26',
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          }}
        />
        <span
          className={bagel400.className}
          style={{
            position: 'absolute',
            left: 38,
            top: 333,
            width: 299,
            height: 32,
            fontSize: 24,
            lineHeight: '32px',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          Focused Scholar
        </span>

        {/* Large card body */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 371,
            width: 299,
            height: 130,
            background: '#4D688C',
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
          }}
        />
        <div
          className={dongle700.className}
          style={{
            position: 'absolute',
            left: 47,
            top: 376,
            width: 280,
            height: 120,
            fontSize: 16,
            lineHeight: '20px',
            color: '#FFFFFF',
            textAlign: 'center',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {MODAL.main.body}
        </div>

        {/* Click area for main modal */}
        <button
          aria-label="Open Focused Scholar"
          onClick={() => setOpen('main')}
          className="absolute"
          style={{ left: 38, top: 371, width: 299, height: 130, borderRadius: 14, background: 'transparent' }}
        />

        {/* Base Camp card */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 511,
            width: 139,
            height: 53,
            background: '#BF4F26',
            borderRadius: 14,
          }}
        />
        <span
          className={bagel400.className}
          style={{
            position: 'absolute',
            left: 38,
            top: 516,
            width: 139,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '32px',
            color: '#FFFFFF',
          }}
        >
          Base Camp
        </span>
        <span
          className={dongle700.className}
          style={{
            position: 'absolute',
            left: 38,
            top: 544,
            width: 139,
            textAlign: 'center',
            fontSize: 15,
            lineHeight: '14px',
            color: '#FFFFFF',
          }}
        >
          Quiet and Relaxed
        </span>
        <button
          aria-label="Open Base Camp"
          onClick={() => setOpen('baseCamp')}
          className="absolute"
          style={{ left: 38, top: 511, width: 139, height: 53, borderRadius: 14, background: 'transparent' }}
        />

        {/* Personality card */}
        <div
          style={{
            position: 'absolute',
            left: 197,
            top: 511,
            width: 140,
            height: 53,
            background: '#4D688C',
            borderRadius: 14,
          }}
        />
        <span
          className={bagel400.className}
          style={{
            position: 'absolute',
            left: 197,
            top: 516,
            width: 140,
            textAlign: 'center',
            fontSize: 16,
            lineHeight: '32px',
            color: '#FFFFFF',
          }}
        >
          Personality
        </span>
        <span
          className={dongle700.className}
          style={{
            position: 'absolute',
            left: 197,
            top: 544,
            width: 140,
            textAlign: 'center',
            fontSize: 15,
            lineHeight: '14px',
            color: '#FFFFFF',
          }}
        >
          Serious Study Person
        </span>
        <button
          aria-label="Open Personality"
          onClick={() => setOpen('personality')}
          className="absolute"
          style={{ left: 197, top: 511, width: 140, height: 53, borderRadius: 14, background: 'transparent' }}
        />

        {/* Lucky Charm card */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 574,
            width: 299,
            height: 91,
            background: '#FFFFFF',
            borderRadius: 14,
          }}
        />
        <img src="/r3/IMG_1152.png" alt="Headphones" className="absolute" style={{ left: 47, top: 582, width: 76, height: 76 }} />
        <span className={bagel400.className} style={{ position: 'absolute', top: 579, left: 179, width: 98, height: 19, fontSize: 16, lineHeight: '19px', textAlign: 'center' }}>
          <span style={{ color: '#BF4F26' }}>Lucky </span>
          <span style={{ color: '#4D688C' }}>Charm</span>
        </span>
        <div
          className={dongle700.className}
          style={{
            position: 'absolute',
            top: 611,
            left: 129,
            width: 198,
            height: 40,
            fontSize: 20,
            lineHeight: '20px',
            textAlign: 'center',
            color: '#4D688C',
            opacity: 1,
          }}
        >
          With the headphones, you are able to concentrate better.
        </div>
        <button
          aria-label="Open Lucky Charm"
          onClick={() => setOpen('lucky')}
          className="absolute"
          style={{ left: 38, top: 574, width: 299, height: 91, borderRadius: 14, background: 'transparent' }}
        />

        {/* Partner card */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 675,
            width: 139,
            height: 117,
            background: '#FFFFFF',
            borderRadius: 14,
          }}
        />
        <span className={bagel400.className} style={{ position: 'absolute', left: 38, top: 680, width: 139, textAlign: 'center', fontSize: 16, lineHeight: '32px', color: '#4D688C' }}>
          Partner
        </span>
        <img src="/r3/IMG_1136.png" alt="Mindful Learner" className="absolute" style={{ left: 71, top: 704, width: 72, height: 72 }} />
        <span className={dongle700.className} style={{ position: 'absolute', left: 38, top: 777, width: 139, textAlign: 'center', fontSize: 16, lineHeight: '14px', color: '#4D688C' }}>
          Mindful Learner
        </span>
        <button
          aria-label="Open Partner"
          onClick={() => setOpen('partner')}
          className="absolute"
          style={{ left: 38, top: 675, width: 139, height: 117, borderRadius: 14, background: 'transparent' }}
        />

        {/* Motto card (API) */}
        <div style={{ position: 'absolute', left: 197, top: 675, width: 139, height: 117, background: '#FFFFFF', borderRadius: 14 }} />
        <span className={bagel400.className} style={{ position: 'absolute', left: 197, top: 680, width: 139, textAlign: 'center', fontSize: 16, lineHeight: '32px', color: '#4D688C' }}>
          Motto
        </span>
        <div
          className={dongle700.className}
          style={{
            position: 'absolute',
            left: 205,
            top: 720,
            width: 123,
            textAlign: 'center',
            fontSize: 18,
            lineHeight: '22px',
            color: '#4D688C',
            wordBreak: 'break-word',
          }}
        >
          {loading ? 'Loading…' : motto || 'Explore learn and thrive'}
        </div>
        <button
          aria-label="Open Motto"
          onClick={() => setOpen('motto')}
          className="absolute"
          style={{ left: 197, top: 675, width: 139, height: 117, borderRadius: 14, background: 'transparent' }}
        />

        {/* Modal */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div className={`${bagel400.className} flex items-center justify-center`} style={{ height: 48, background: '#BF4F26', color: '#FFFFFF', fontSize: 24, lineHeight: '32px' }}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} p-4 text-center`} style={{ background: '#4D688C', color: '#FFFFFF', fontSize: 18, lineHeight: '24px' }}>
                {MODAL[open].body}
              </div>
              <button onClick={() => setOpen(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white" aria-label="Close dialog">
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
