'use client';

import { useEffect, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const bagel400  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey =
  | 'main'
  | 'baseCamp'
  | 'personality'
  | 'luckyCharm'
  | 'partner'
  | 'motto';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'Balanced Adventurer',
    body:
      'You know how to balance your studies with life’s adventures. Enjoying the vibrancy of city life while finding solace in nature, you create a harmonious study routine that fosters both productivity and relaxation. Your journey is as enriching as it is dynamic!',
  },
  baseCamp:    { title: 'Base Camp',    body: 'Mix of City and Nature' },
  personality: { title: 'Personality',  body: 'Serious Study Person' },
  luckyCharm:  { title: 'Lucky Charm',  body: 'To be able to balance your work life and personal life.' },
  partner:     { title: 'Partner',      body: 'Nature-Loving Learner' },
  motto:       { title: 'Motto',        body: 'Your favorite spots to explore are waiting here!' },
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

// ESLint-safe AbortError check (no `any`)
function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'AbortError';
  }
  return typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'AbortError';
}

export default function PageR8() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  // Motto from /api/motto
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;

    async function run() {
      try {
        // Optimistic cache to avoid blank state
        const cached = typeof window !== 'undefined' ? localStorage.getItem('motto_r8') || '' : '';
        if (cached) setMotto(cached);

        const resp = await fetch(`/api/motto?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona: 'Balanced Adventurer' }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = (await resp.json()) as { motto?: string };
        const safe = sanitizeToEightWords(data?.motto || '');
        const finalText = safe || 'Explore learn and thrive';

        if (!aborted) {
          setMotto(finalText);
          if (typeof window !== 'undefined') localStorage.setItem('motto_r8', finalText);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        // eslint-disable-next-line no-console
        console.error('[r8] motto api failed:', err);
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
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#F2A25C] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* Main Character */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/r8/Balanced_Adventurer.png"
            alt="Balanced Adventurer"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Three keywords */}
        <div className={`${dongle700.className} absolute left-[75px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#F2A25C]">Creative</span>
        </div>
        <div className={`${dongle700.className} absolute left-[155px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#152840]">Resourceful</span>
        </div>
        <div className={`${dongle700.className} absolute left-[250px] top-[299px]`}>
          <span className="text-[20px] font-bold text-[#4D688C]">Curious</span>
        </div>

        {/* Main Description Card */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#F2A25C] rounded-t-[14px]">
          <div className={`${bagel400.className} absolute left-[40px] top-[5px] text-white text-[24px] leading-[32px]`}>
            Balanced Adventurer
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#FFFFFF] rounded-b-[14px]"
        >
          <div className={`${dongle700.className} text-[#4D688C] text-[18px] leading-[22px] font-bold text-center px-3`}>
            {MODAL.main.body}
          </div>
        </button>

        {/* Base Camp Card */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#F2A25C] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-white text-[16px] leading-[24px] text-center`}>Base Camp</div>
          <div className={`${dongle700.className} text-white text-[14px] leading-[20px] font-bold text-center`}>Mix of City and Nature</div>
        </button>

        {/* Personality Card */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#FFFFFF] rounded-[14px]"
        >
          <div className={`${bagel400.className} text-[#4D688C] text-[16px] leading-[24px] text-center`}>Personality</div>
          <div className={`${dongle700.className} text-[#4D688C] text-[14px] leading-[20px] font-bold text-center`}>Serious Study Person</div>
        </button>

        {/* Lucky Charm Card */}
        <button
          type="button"
          onClick={() => setOpen('luckyCharm')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]"
        >
          <img src="/r8/Balance.png" alt="Lucky Charm" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          <div className={`${bagel400.className} absolute left-[141px] top-[5px] flex items-center whitespace-nowrap`}>
            <span className="text-[16px]" style={{ color: '#F2A25C' }}>Lucky&nbsp;</span>
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
          <div className={`${bagel400.className} absolute left-[40px] top-[2px] text-[16px] leading-[32px]`} style={{ color: '#F2A25C' }}>
            Partner
          </div>
          <img src="/r8/Balance_Partner.png" alt="Partner" className="absolute left-[30px] top-[25px] w-[80px] h-[80px]" />
          <div className={`${dongle700.className} absolute text-center text-[14px] font-bold`} style={{ left: 7, top: 95, width: 129, color: '#F2A25C' }}>
            Nature-Loving Learner
          </div>
        </button>

        {/* Motto Card (API) */}
        <button
          type="button"
          onClick={() => setOpen('motto')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
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
              <div className={`${bagel400.className} h-[48px] bg-[#F2A25C] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} bg-[#FFFFFF] text-[#4D688C] p-4 text-[18px] leading-[24px] text-center`}>
                {MODAL[open].body}
              </div>
              <button onClick={() => setOpen(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 text-white" aria-label="Close dialog">×</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
