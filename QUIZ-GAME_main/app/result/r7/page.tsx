'use client';

import { useEffect, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const bagel400  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey = 'main' | 'baseCamp' | 'personality' | 'luckyCharm' | 'partner' | 'motto';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'Mindful Learner',
    body:
      'Your study style is calm and reflective. You value a peaceful environment that promotes mindfulness and encourages creativity. Your relaxed approach helps you balance academic responsibilities with personal wellness, ensuring a fulfilling educational experience.',
  },
  baseCamp: { title: 'Base Camp', body: 'Quiet and Relaxed' },
  personality: { title: 'Personality', body: 'Relaxed Person' },
  luckyCharm: { title: 'Lucky Charm', body: 'Plenty stocked up, ready to use when you want to relax.' },
  partner: { title: 'Partner', body: 'Focused Scholar' },
  motto: { title: 'Motto', body: 'Your favorite spots to explore are waiting here!' },
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

/** Type guard to quietly ignore AbortError without using `any`. */
function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'AbortError';
  }
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as { name?: string }).name === 'AbortError'
  );
}

export default function PageR7() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  // motto from /api/motto
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;

    async function run() {
      try {
        // optimistic cache
        const cached = typeof window !== 'undefined' ? localStorage.getItem('motto_r7') || '' : '';
        if (cached) setMotto(cached);

        const resp = await fetch(`/api/motto?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona: 'Mindful Learner' }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = (await resp.json()) as { motto?: string };
        const safe = sanitizeToEightWords(data?.motto || '');
        const finalText = safe || 'Explore learn and thrive';

        if (!aborted) {
          setMotto(finalText);
          if (typeof window !== 'undefined') localStorage.setItem('motto_r7', finalText);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) return; // ignore aborts
        // eslint-disable-next-line no-console
        console.error('[r7] motto api failed:', err);
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
  }, []); // run once

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div
        className="relative w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden"
        style={{ background: '#F2D9BB' }}
      >
        {/* Top Title */}
        <div className="absolute left-[29px] top-[40px] w-[316px] h-[32px] flex items-center justify-center">
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#BF4F26] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* Main Character */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/r7/Mindful_learner.png"
            alt="Mindful Learner"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Three keywords */}
        <div className={`${dongle700.className} absolute left-[75px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#BF4F26]">Self-Aware</span>
        </div>
        <div className={`${dongle700.className} absolute left-[165px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#4D688C]">Disciplined</span>
        </div>
        <div className={`${dongle700.className} absolute left-[250px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#F2A25C]">Patient</span>
        </div>

        {/* Main Description Card */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#BF4F26] rounded-t-[14px]">
          <div className={`${bagel400.className} absolute left-[60px] top-[5px] text-white text-[24px] leading-[32px]`}>
            Mindful Learner
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#4D688C] rounded-b-[14px]"
        >
          <div className={`${dongle700.className} text-white text-[18px] leading-[22px] font-bold text-center px-3`}>
            {MODAL.main.body}
          </div>
        </button>

        {/* Base Camp Card */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#BF4F26] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-white text-[16px] leading-[24px] text-center`}>Base Camp</div>
          <div className={`${dongle700.className} text-white text-[14px] leading-[20px] font-bold text-center`}>Quiet and Relaxed</div>
        </button>

        {/* Personality Card */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#4D688C] rounded-[14px]">
          <div className={`${bagel400.className} text-white text-[16px] leading-[24px] text-center`}>Personality</div>
          <div className={`${dongle700.className} text-white text-[14px] leading-[20px] font-bold text-center`}>Relaxed Person</div>
        </button>

        {/* Lucky Charm Card */}
        <button
          type="button"
          onClick={() => setOpen('luckyCharm')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]">
          <img src="/r7/Paper.png" alt="Lucky Charm" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          <div className={`${bagel400.className} absolute left-[141px] top-[5px] flex items-center whitespace-nowrap`}>
            <span className="text-[16px]" style={{ color: '#BF4F26' }}>Lucky&nbsp;</span>
            <span className="text-[16px]" style={{ color: '#4D688C' }}>Charm</span>
          </div>
          <div className={`${dongle700.className} absolute left-[91px] top-[37px] text-[#4D688C] text-[18px] leading-[16px] font-bold text-center`} style={{ width: 198 }}>
            {MODAL.luckyCharm.body}
          </div>
        </button>

        {/* Partner Card */}
        <button
          type="button"
          onClick={() => setOpen('partner')}
          className="absolute left-[38px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]">
          <div className={`${bagel400.className} absolute left-[40px] top-[2px] text-[16px] leading-[32px]`} style={{ color: '#BF4F26' }}>
            Partner
          </div>
          <img src="/r7/Mindful_partner.png" alt="Partner" className="absolute left-[30px] top-[25px] w-[80px] h-[80px]" />
          <div className={`${dongle700.className} absolute text-center text-[14px] font-bold`} style={{ left: 7, top: 95, width: 129, color: '#BF4F26' }}>
            Focused Scholar
          </div>
        </button>

        {/* Motto Card (via API) */}
        <button
          type="button"
          onClick={() => setOpen('motto')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]">
          <div className={`${bagel400.className} absolute left-[45px] top-[2px] text-[#4D688C] text-[16px] leading-[32px]`}>Motto</div>
          <div
            className={`${dongle700.className} absolute left-[12px] right-[12px] top-[44px] text-center`}
            style={{ fontSize: 18, lineHeight: '22px', color: '#4D688C', wordBreak: 'break-word' }}
          >
            {loading ? 'Loading your motto...' : (motto || 'Explore learn and thrive')}
          </div>
        </button>

        {/* Modal */}
        {open && (
          <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative w-[330px] rounded-[14px] overflow-hidden shadow-2xl">
              <div className={`${bagel400.className} h-[48px] bg-[#BF4F26] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
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
