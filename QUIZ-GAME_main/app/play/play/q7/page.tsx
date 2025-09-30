'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { saveAnswer, getAnswers } from '@/lib/answers';

type Opt = { id: number; title: JSX.Element; img: string; key: 'arena' | 'power' | 'build' | 'tour' };

const OPTIONS: Opt[] = [
  { id: 1, key: 'arena', img: '/quiz/q7/image1.png', title: <>Enter the Arena</> },
  { id: 2, key: 'power', img: '/quiz/q7/image2.png', title: <>Power Up Your<br/>Knowledge</> },
  { id: 3, key: 'build', img: '/quiz/q7/image3.png', title: <>Build Your<br/>Own Path</> },
  { id: 4, key: 'tour',  img: '/quiz/q7/image4.png', title: <>Embark on a<br/>World Tour</> },
];

const QID = 'q7';
const Q7_VALUE_MAP: Record<Opt['key'], string> = {
  arena: 'Enter the Arena',
  power: 'Power Up Your Knowledge',
  build: 'Build Your Own Path',
  tour:  'Embark on a World Tour',
};

export default function Q7Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  // Prefill if user already answered q7
  useEffect(() => {
    const a = getAnswers();
    const stored = a[QID] as string | undefined;
    if (!stored) return;
    const found = OPTIONS.find(o => Q7_VALUE_MAP[o.key] === stored);
    if (found) setSelected(found.id);
  }, []);

  const currentKey = useMemo<Opt['key'] | null>(() => {
    if (!selected) return null;
    return OPTIONS.find(o => o.id === selected)?.key ?? null;
  }, [selected]);

  const handleConfirm = () => {
    if (!selected || !currentKey) return;
    const ok = saveAnswer(QID, Q7_VALUE_MAP[currentKey]);
    if (!ok) {
      alert('Save failed. Please try again.');
      return;
    }
    // Go to the loading screen; it will compute persona and reveal the result page
    router.push('/play/play/loading');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="relative w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden text-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C2A54] to-[#2A5B8A]" />

        <div className="relative px-6 pt-8 pb-2">
          <h1 className="text-center font-extrabold text-[24px] leading-[28px] tracking-[0.2px]">
            How will you level up after<br/>graduation?
          </h1>
        </div>

        <section className="relative mt-4 grid grid-cols-2 gap-x-6 gap-y-10 px-6">
          {OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                aria-pressed={active}
                className={[
                  'group relative w-[152px] rounded-[20px] transition',
                  'bg-[#D86106] shadow-[0_6px_14px_rgba(0,0,0,0.25)]',
                  active ? 'ring-[4px] ring-[#4EA7FF]' : 'ring-0',
                ].join(' ')}
              >
                <div className="overflow-hidden rounded-[20px]">
                  <img
                    src={opt.img}
                    alt=""
                    className="w-full h-[180px] object-cover"
                    draggable={false}
                  />
                </div>

                <div className="px-8 pb-4 pt-3">
                  <p className="text-white font-black text-[16px] leading-[20px] text-center">
                    {opt.title}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[20px] border-[3px] border-[#F5B983] opacity-95"
                />
              </button>
            );
          })}
        </section>

        <footer className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={[
              'w-[272px] h-[56px] rounded-[14px]',
              'bg-[#162A40] text-white font-extrabold text-[24px] leading-[24px]',
              'shadow-[0_8px_20px_rgba(0,0,0,0.35)]',
              'transition disabled:opacity-40 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            Confirm
          </button>

          <p className="text-[13px] leading-[16px] text-white/85">
            Select Image then Confirm
          </p>
        </footer>
      </div>
    </main>
  );
}
