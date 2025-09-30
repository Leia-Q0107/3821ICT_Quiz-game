'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/** Adjustable frame parameters **/
const BORDER_COLOR = '#F2A25C';
const BORDER_THICKNESS = 8;   // Border thickness (px)
const BORDER_RADIUS = 12;     // Border radius (px)

/** Narrow only width or only height: tweak the four inset values below (px) */
const TOP_INSET = 1;          // Move down (for height-only, adjust this and BOTTOM_INSET)
const RIGHT_INSET = 14;       // Move left (for width-only, adjust this and LEFT_INSET)
const BOTTOM_INSET = 1;       // Move up
const LEFT_INSET = 14;        // Move right

const labels = [
  'Art & Humanities',
  'Business',
  'Design & Creative Arts',
  'Engineering',
  'Environmental Studies',
  'Health Science',
  'IT & Computer Science',
  'Law',
  'Education',
  'Nursing',
  'Other',
  'Social Work',
];

const CARDS = Array.from({ length: 12 }).map((_, i) => ({
  id: `card-${String(i + 1).padStart(2, '0')}`,
  label: labels[i] ?? `Card ${String(i + 1).padStart(2, '0')}`,
  src: `/cards/card-${String(i + 1).padStart(2, '0')}.png`,
}));

export default function ChoosePage() {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);                  // Centered index
  const [selected, setSelected] = useState<number | null>(0); // Initially select index 0

  // Center the given index
  const centerToIndex = useCallback((idx: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft + child.offsetWidth / 2 - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior });
  }, []);

  // Initially center index 0
  useEffect(() => {
    centerToIndex(0, 'auto');
    // Keyboard navigation support
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While scrolling, find the card closest to the horizontal center
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement;
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < dist) { dist = d; best = i; }
    }
    setCurrent(best);
  };

  const onCardClick = (idx: number) => {
    setSelected(prev => (prev === idx ? null : idx));
    centerToIndex(idx);
  };

  const onConfirm = () => {
    if (selected == null) return;
    // Navigate to next page per your original flow
    router.push('/play/play/q1');
  };

  const hint = selected == null
    ? 'Swipe to select a card, then confirm'
    : 'I changed my mind';

  const canProceed = selected != null;

  const handlePrev = () => {
    const target = Math.max(0, current - 1);
    setSelected(target);
    centerToIndex(target);
  };

  const handleNext = () => {
    const max = CARDS.length - 1;
    const target = Math.min(max, current + 1);
    setSelected(target);
    centerToIndex(target);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      {/* iPhone portrait container */}
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative text-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#273444] via-[#1f2a3a] to-[#17202b]" />

        {/* Header */}
        <div className="relative px-6 pt-8 pb-2">
          <p className="text-center text-[18px] leading-6 font-semibold text-white/90">
            Choose your path to your Aussie<br />knowledge mastery!
          </p>
        </div>

        {/* Scroll area */}
        <div className="relative px-3">
          {/* Left/Right arrow overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1">
            <button
              type="button"
              aria-label="Previous"
              onClick={handlePrev}
              disabled={current === 0}
              className={`
                pointer-events-auto select-none
                w-11 h-11 rounded-full grid place-items-center
                bg-white/15 backdrop-blur-sm
                border border-white/20 shadow
                transition active:scale-95
                ${current === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}
              `}
            >
              {/* Left arrow icon (inline SVG) */}
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next"
              onClick={handleNext}
              disabled={current === CARDS.length - 1}
              className={`
                pointer-events-auto select-none
                w-11 h-11 rounded-full grid place-items-center
                bg-white/15 backdrop-blur-sm
                border border-white/20 shadow
                transition active:scale-95
                ${current === CARDS.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}
              `}
            >
              {/* Right arrow icon (inline SVG) */}
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div
            ref={scrollerRef}
            onScroll={onScroll}
            // No preventDefault; use onWheel to drive horizontal scrolling
            onWheel={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
              el.scrollBy({ left: delta * 1.1, behavior: 'auto' });
            }}
            className="
              overflow-x-auto overflow-y-hidden
              snap-x snap-mandatory
              scroll-px-6
              flex gap-5 px-5 pt-[120px] pb-[140px]
              touch-pan-x
              overscroll-x-contain overscroll-y-none
              no-scrollbar
            "
          >
            {CARDS.map((card, idx) => {
              const active = idx === current;          // Scale up if centered
              const isSelected = idx === selected;     // Selected border
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => onCardClick(idx)}
                  className={`
                    snap-center shrink-0
                    w-[220px] h-[340px]
                    rounded-2xl p-0
                    bg-transparent
                    flex items-center justify-center
                    transition-all duration-300
                    ${active ? 'scale-105' : 'scale-95 opacity-85'}
                    focus:outline-none focus:ring-2 focus:ring-white/40
                  `}
                >
                  {/* Image + configurable frame container */}
                  <div className="relative w-full h-full">
                    <img
                      src={card.src}
                      alt={card.label}
                      className="w-full h-full object-contain pointer-events-none select-none"
                      draggable={false}
                    />
                    {isSelected && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          top: TOP_INSET,
                          right: RIGHT_INSET,
                          bottom: BOTTOM_INSET,
                          left: LEFT_INSET,
                          border: `${BORDER_THICKNESS}px solid ${BORDER_COLOR}`,
                          borderRadius: `${BORDER_RADIUS}px`,
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom action area */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-3">
          <button
            onClick={onConfirm}
            disabled={!canProceed}
            className={`
              w-full h-[48px] rounded-xl font-semibold transition
              shadow-[inset_0_-4px_0_rgba(0,0,0,0.35)]
              ${canProceed
                ? 'bg-[#BF4F26] hover:brightness-110'
                : 'bg-[#F2D9BB] opacity-60 cursor-not-allowed'}
            `}
          >
            Confirm
          </button>

          <p
            className={`
              text-center text-xs mt-3
              ${canProceed ? 'text-white/80 cursor-pointer underline-offset-2 hover:underline' : 'text-white/70'}
            `}
            onClick={() => {
              if (canProceed) setSelected(null); // Clear selection when clickable
            }}
          >
            {hint}
          </p>
        </div>
      </div>
    </main>
  );
}
