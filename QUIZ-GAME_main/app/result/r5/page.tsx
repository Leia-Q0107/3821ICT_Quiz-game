'use client';

import { useEffect, useState } from 'react';
import { Dongle, Bagel_Fat_One } from 'next/font/google';

const dongle700 = Dongle({ subsets: ['latin'], weight: '700' });
const bagel400  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type ModalKey = 'main' | 'baseCamp' | 'personality' | 'luckyCharm' | 'partner' | 'motto';

const MODAL: Record<ModalKey, { title: string; body: string }> = {
  main: {
    title: 'Creative Innovator',
    body:
      'You bring a laid-back approach to a vibrant city filled with artistic expression. Enjoying the creative energy around you, you find inspiration in local culture while maintaining a balanced life that includes plenty of downtime for relaxation and self-care.',
  },
  baseCamp:     { title: 'Base Camp',     body: 'Big and Creative City Person.' },
  personality:  { title: 'Personality',   body: 'Relaxed Person.' },
  luckyCharm:   { title: 'Lucky Charm',   body: 'Able to note down any on the spot inspiration immediately.' },
  partner:      { title: 'Partner',       body: 'City Visionary' },
  motto:        { title: 'Motto',         body: 'Art-rich neighborhoods, cozy studios, and quiet cafés where inspiration flows and you can unwind.' },
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

// Ignore AbortError without using `any`
function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'AbortError';
  }
  return typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'AbortError';
}

export default function PageR5() {
  const [open, setOpen] = useState<ModalKey | null>(null);

  // Motto from /api/motto
  const [motto, setMotto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let aborted = false;

    async function run() {
      try {
        // optimistic cache to avoid blank
        const cached = typeof window !== 'undefined' ? localStorage.getItem('motto_r5') || '' : '';
        if (cached) setMotto(cached);

        const resp = await fetch(`/api/motto?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Persona drives the motto generation server-side
          body: JSON.stringify({ persona: 'Creative Innovator' }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = (await resp.json()) as { motto?: string };
        const safe = sanitizeToEightWords(data?.motto || '');
        const finalText = safe || 'Explore learn and thrive';

        if (!aborted) {
          setMotto(finalText);
          if (typeof window !== 'undefined') localStorage.setItem('motto_r5', finalText);
        }
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        // eslint-disable-next-line no-console
        console.error('[r5] motto api failed:', err);
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
          <h1 className={`${dongle700.className} text-[24px] leading-[32px] font-bold text-[#4D688C] text-center`}>
            You are a...!
          </h1>
        </div>

        {/* Main Illustration */}
        <div className="absolute left-[79px] top-[79px] w-[217px] h-[217px]">
          <img
            src="/R5/person.png"
            alt="Creative Innovator"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Three keywords */}
        <div className={`${dongle700.className} absolute left-[115px] top-[299px]`}>
          <span className="text-[20px] leading-[20px] font-bold text-[#4D688C]">Chill</span>
        </div>
        <div className={`${dongle700.className} absolute left-[161px] top-[299px]`}>
          <span className="text-[20px] leading-[20px] font-bold text-[#F2A25C]">Inspiring</span>
        </div>
        <div className={`${dongle700.className} absolute left-[233px] top-[299px]`}>
          <span className="text-[20px] leading-[20px] font-bold text-[#152840]">Flexible</span>
        </div>

        {/* Main Card Header */}
        <div className="absolute left-[38px] top-[329px] w-[299px] h-[42px] bg-[#4D688C] rounded-t-[14px]">
          <div className={`${bagel400.className} absolute left-[46px] top-[5px] text-white text-[24px] leading-[32px]`}>
            Creative Innovator
          </div>
        </div>

        {/* Main Card Body */}
        <button
          type="button"
          onClick={() => setOpen('main')}
          className="absolute left-[38px] top-[371px] w-[299px] h-[130px] bg-[#F2A25C] rounded-b-[14px]"
        >
          <div
            className={`${dongle700.className} absolute left-[9px] top-[5px] text-white text-[20px] leading-[20px] font-bold text-center`}
            style={{ width: 280, height: 120 }}
          >
            {MODAL.main.body}
          </div>
        </button>

        {/* Base Camp */}
        <button
          type="button"
          onClick={() => setOpen('baseCamp')}
          className="absolute left-[38px] top-[511px] w-[139px] h-[53px] bg-[#4D688C] rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[29px] top-[5px] text-white text-[16px] leading-[32px]`}>
            Base Camp
          </div>
          <div
            className={`${dongle700.className} absolute left-[5px] top-[34px] text-white text-[15px] leading-[14px] font-bold text-center`}
            style={{ width: 129, height: 14 }}
          >
            Big and Creative City Person
          </div>
        </button>

        {/* Personality */}
        <button
          type="button"
          onClick={() => setOpen('personality')}
          className="absolute left-[197px] top-[511px] w-[140px] h-[53px] bg-[#F2A25C] rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[26px] top-[5px] text-white text-[16px] leading-[32px]`}>
            Personality
          </div>
          <div className={`${dongle700.className} absolute left-[30px] top-[34px] text-white text-[16px] leading-[14px] font-bold text-center`}>
            Relaxed Person
          </div>
        </button>

        {/* Lucky Charm */}
        <button
          type="button"
          onClick={() => setOpen('luckyCharm')}
          className="absolute left-[38px] top-[574px] w-[299px] h-[91px] bg-white rounded-[14px]"
        >
          <img src="/R5/note.png" alt="note" className="absolute left-[9px] top-[8px] w-[76px] h-[76px]" />
          <div
            className={`${bagel400.className} absolute left-[141px] top-[5px] flex items-center justify-center whitespace-nowrap`}
            style={{ width: 98, height: 19 }}
          >
            <span className="text-[16px] leading-[32px]" style={{ color: '#4D688C' }}>Lucky&nbsp;</span>
            <span className="text-[16px] leading-[32px]" style={{ color: '#F2A25C' }}>Charm</span>
          </div>
          <div
            className={`${dongle700.className} absolute left-[91px] top-[37px] text-[#4D688C] text-[20px] leading-[20px] font-bold text-center`}
            style={{ width: 198, height: 40 }}
          >
            Able to note down any on the spot inspiration immediately.
          </div>
        </button>

        {/* Partner */}
        <button
          type="button"
          onClick={() => setOpen('partner')}
          className="absolute left-[38px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[40px] top-[5px] text-[16px] leading-[32px]`} style={{ color: '#4D688C' }}>
            Partner
          </div>
          <img src="/R5/head.png" alt="head" className="absolute left-[33px] top-[29px] w-[72px] h-[72px]" />
          <div className={`${dongle700.className} absolute text-center`} style={{ left: 7, top: 94, width: 129, height: 14, color: '#4D688C' }}>
            <span className="text-[16px] leading-[14px] font-bold">City Visionary</span>
          </div>
        </button>

        {/* Motto (via API) */}
        <button
          type="button"
          onClick={() => setOpen('motto')}
          className="absolute left-[197px] top-[675px] w-[139px] h-[117px] bg-white rounded-[14px]"
        >
          <div className={`${bagel400.className} absolute left-[45px] top-[5px] text-[#4D688C] text-[16px] leading-[32px]`}>
            Motto
          </div>
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
              <div className={`${bagel400.className} h-[48px] bg-[#4D688C] text-white text-[24px] leading-[32px] flex items-center justify-center`}>
                {MODAL[open].title}
              </div>
              <div className={`${dongle700.className} bg-[#F2A25C] text-white p-4 text-[18px] leading-[24px] text-center`}>
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
