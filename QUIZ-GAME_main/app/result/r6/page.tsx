'use client';

import { useEffect, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const bagel400  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey = 'main' | 'baseCamp' | 'personality' | 'luckyCharm' | 'partner' | 'motto';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'Adventurous Scholar',
    body:
      'You embrace the fast pace of life with a focus on your academic pursuits. Your determination keeps you on track, but you also know how to seize exciting opportunities that come your way, enriching both your studies and your personal growth.',
  },
  baseCamp: { title: 'Base Camp', body: 'Fast-Paced and Exciting' },
  personality: { title: 'Personality', body: 'Serious Study Person' },
  luckyCharm: { title: 'Lucky Charm', body: 'Ready to find upcoming opportunities.' },
  partner: { title: 'Partner', body: 'Dynamic Explorer' },
  motto: { title: 'Motto', body: 'Libraries, research hubs, and inspiring academic environments.' },
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

// Type guard to ignore AbortError
function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'AbortError';
  }
  return typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'AbortError';
}

export default function PageR4() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  // Motto from /api/motto
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;

    async function run() {
      try {
        // optimistic cache (avoid blank)
        const cached = typeof window !== 'undefined' ? localStorage.getItem('motto_r4') || '' : '';
        if (cached) setMotto(cached);

        const resp = await fetch(`/api/motto?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona: 'Adventurous Scholar' }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = (await resp.json()) as { motto?: string };
        const safe = sanitizeToEightWords(data?.motto || '');
        const finalText = safe || 'Explore learn and thrive';

        if (!aborted) {
          setMotto(finalText);
          if (typeof window !== 'undefined') localStorage.setItem('motto_r4', finalText);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        // eslint-disable-next-line no-console
        console.error('[r4] motto api failed:', err);
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
      <div
        className="relative w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden"
        style={{ background: '#F2D9BB' }}
      >
        {/* Top Title */}
        <div className="absolute left-[29px] top-[40px] w-[316px] h-[32px] flex items-center justify-center">
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#152840] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* Main Illustration (kept as your paths) */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/R6/person.png"
            alt="Adventurous Scholar"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Three keywords */}
        <div className={`${dongle700.className} absolute`} style={{ left: 87, top: 299, width: 38, height: 20 }}>
          <span className="text-[20px] leading-[20px] font-bold text-[#152840]">Driven</span>
        </div>
        <div className={`${dongle700.className} absolute text-center`} style={{ left: 145, top: 299, width: 85, height: 20 }}>
          <span className="text-[20px] leading-[20px] font-bold text-[#4D688C]">Goal-Oriented</span>
        </div>
        <div className={`${dongle700.className} absolute`} style={{ left: 250, top: 299, width: 59, height: 20 }}>
          <span className="text-[20px] leading-[20px] font-bold text-[#152840]">Ambitious</span>
        </div>

        {/* Main card header */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#152840] rounded-t-[14px] select-none">
          <div
            className={`${bagel400.className} absolute text-white text-[24px] leading-[32px] flex items-center justify-center`}
            style={{ left: 33, top: 5, width: 233, height: 32 }}
          >
            Adventurous Scholar
          </div>
        </div>

        {/* Main card body */}
        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#4D688C] rounded-b-[14px]"
          aria-label="Open detail"
        >
          <div
            className={`${dongle700.className} absolute text-white text-[20px] leading-[20px] font-bold text-center flex items-center justify-center`}
            style={{ left: 9, top: 5, width: 280, height: 120 }}
          >
            {MODAL.main.body}
          </div>
        </button>

        {/* Base Camp */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#152840] rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute text-white text-[16px] leading-[32px]`} style={{ left: 29, top: 5 }}>
            Base Camp
          </div>
          <div className={`${dongle700.className} absolute text-white text-[15px] leading-[14px] font-bold text-center`} style={{ left: 20, top: 34 }}>
            Fast-Paced and Exciting
          </div>
        </button>

        {/* Personality */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#4D688C] rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute text-white text-[16px] leading-[32px]`} style={{ left: 26, top: 5 }}>
            Personality
          </div>
          <div className={`${dongle700.className} absolute text-white text-[16px] leading-[14px] font-bold text-center`} style={{ left: 20, top: 34 }}>
            Serious Study Person
          </div>
        </button>

        {/* Lucky Charm */}
        <button
          type="button"
          onClick={() => setOpen('luckyCharm')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]"
        >
          <img src="/R6/telescope.png" alt="telescope" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          <div className={`${bagel400.className} absolute flex items-center justify-center whitespace-nowrap`} style={{ left: 141, top: 5, width: 98, height: 19 }}>
            <span className="text-[16px] leading-[32px]" style={{ color: '#152840' }}>Lucky&nbsp;</span>
            <span className="text-[16px] leading-[32px]" style={{ color: '#4D688C' }}>Charm</span>
          </div>
          <div className={`${dongle700.className} absolute text-[18px] leading-[20px] font-bold text-center`} style={{ left: 91, top: 37, width: 198, height: 40, color: '#4D688C' }}>
            Ready to find upcoming opportunities.
          </div>
        </button>

        {/* Partner */}
        <button
          type="button"
          onClick={() => setOpen('partner')}
          className="absolute left-[38px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute text-[16px] leading-[32px]`} style={{ left: 40, top: 5, color: '#152840' }}>
            Partner
          </div>
          <img src="/R6/head.png" alt="head" className="absolute left-[33px] top-[24px] w-[72px] h-[72px]" />
          <div className={`${dongle700.className} absolute text-center`} style={{ left: 8, top: 94, width: 129, height: 14, color: '#152840' }}>
            <span className="text-[16px] leading-[14px] font-bold">Dynamic Explorer</span>
          </div>
        </button>

        {/* Motto (via API) */}
        <button
          type="button"
          onClick={() => setOpen('motto')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute text-[16px] leading-[32px]`} style={{ left: 45, top: 5, color: '#4D688C' }}>
            Motto
          </div>
          <div
            className={`${dongle700.className} absolute text-center`}
            style={{ left: 12, right: 12, top: 44, fontSize: 18, lineHeight: '22px', color: '#4D688C', wordBreak: 'break-word' }}
          >
            {loading ? 'Loading your motto...' : (motto || 'Explore learn and thrive')}
          </div>
        </button>

        {/* Modal */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div className={`${bagel400.className} h-[48px] bg-[#152840] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} bg-[#4D688C] text-white p-4 text-[18px] leading-[24px] text-center`}>
                {MODAL[open].body}
              </div>
              <button onClick={() => setOpen(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white">×</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
