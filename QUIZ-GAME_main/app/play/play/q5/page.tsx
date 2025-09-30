"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveAnswer, getAnswers } from "@/lib/answers";

const cards = [
  { id: "surf",     img: "/quiz/q5/01_Downtown Options.png",  title: "Surf the Waves" },
  { id: "hike",     img: "/quiz/q5/02_Hike the Outback.png",  title: "Hike the Outback" },
  { id: "city",     img: "/quiz/q5/03_City Explorer.png",     title: "City Explorer" },
  { id: "wildlife", img: "/quiz/q5/04_Wildlife Watcher.png",  title: "Wildlife Watcher" },
] as const;

type CardId = (typeof cards)[number]["id"];
const QID = "q5";

const Q5_VALUE_MAP: Record<CardId, string> = {
  surf: "Surf the Waves",
  hike: "Hike the Outback",
  city: "City Explorer",
  wildlife: "Wildlife Watcher",
};

export default function DowntimePage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const current = useMemo(() => cards[index], [index]);
  const prevIndex = (i: number) => (i - 1 + cards.length) % cards.length;
  const nextIndex = (i: number) => (i + 1) % cards.length;

  useEffect(() => {
    const a = getAnswers();
    const stored = a[QID] as string | undefined;
    if (!stored) return;
    const id = (Object.keys(Q5_VALUE_MAP) as CardId[]).find(k => Q5_VALUE_MAP[k] === stored);
    if (!id) return;
    const i = cards.findIndex(c => c.id === id);
    if (i >= 0) setIndex(i);
  }, []);

  const swipe = useCallback((dir: "left" | "right") => {
    if (busy) return;
    setBusy(true);
    setDirection(dir);
    setIndex(prev => (dir === "left" ? (prev + 1) % cards.length : (prev - 1 + cards.length) % cards.length));
    window.setTimeout(() => setBusy(false), 320);
  }, [busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); swipe("right"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); swipe("left"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [swipe]);

  const variants = {
    enter: (dir: "left" | "right") => ({ x: dir === "left" ? 140 : -140, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: "left" | "right") => ({ x: dir === "left" ? -340 : 340, opacity: 0 }),
  };

  const onConfirm = () => {
    const id = current.id as CardId;
    const ok = saveAnswer(QID, Q5_VALUE_MAP[id]);
    if (!ok) { alert("Save failed. Please try again."); return; }
    router.push("/play/play/q6");
  };

  /** Layout constants */
  const CENTER_SIZE = 380;
  const STAGE_WIDTH = 380;
  const STAGE_HEIGHT = 440;
  const PEEK_OFFSET = 185;
  const NEIGHBOR_SCALE = 0.88;
  const NEIGHBOR_OPACITY = 0.55;
  const BACKDROP_SIZE = 340;      // ↓ a bit smaller than before
  const BACKDROP_OPACITY = 0.5;   // ↓ softer overall

  const idxPrev = prevIndex(index);
  const idxNext = nextIndex(index);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div
        className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative flex flex-col justify-between"
        style={{ background: "linear-gradient(to bottom, #f7d7b0, #d66a36)" }}
      >
        {/* Title pushed down a bit */}
        <div className="mt-10 px-4 text-center">
          <h2 className="mt-3 text-xl font-bold text-orange-900">
            How will you level up during your Aussie quest downtime?
          </h2>
        </div>

        {/* Slider */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Arrows */}
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-between px-3">
            {[
              { aria: "Previous", dir: "right" as const, icon: "M15 18l-6-6 6-6" },
              { aria: "Next",     dir: "left"  as const, icon: "M9 6l6 6-6 6"   },
            ].map(b => (
              <button
                key={b.aria}
                type="button"
                aria-label={b.aria}
                onClick={() => swipe(b.dir)}
                onPointerUp={() => swipe(b.dir)}
                disabled={busy}
                className={`pointer-events-auto select-none w-14 h-14 rounded-full grid place-items-center
                            bg-black/18 backdrop-blur-sm border border-white/40 text-white shadow transition
                            active:scale-95 hover:bg-black/28 ${busy ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                style={{ touchAction: "manipulation" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={b.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>

          {/* Stage */}
          <div className="relative mx-auto" style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
            {/* Left neighbor */}
            <motion.img
              key={`left-${cards[idxPrev].img}`}
              src={cards[idxPrev].img}
              alt=""
              className="absolute z-10 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none select-none drop-shadow"
              style={{ width: CENTER_SIZE, height: CENTER_SIZE, objectFit: "contain" }}
              initial={{ x: -PEEK_OFFSET, opacity: NEIGHBOR_OPACITY, scale: NEIGHBOR_SCALE }}
              animate={{ x: -PEEK_OFFSET, opacity: NEIGHBOR_OPACITY, scale: NEIGHBOR_SCALE }}
              transition={{ duration: 0.2 }}
            />

            {/* Softer white backdrop behind center image */}
            <div
              className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl"
              style={{
                width: BACKDROP_SIZE,
                height: BACKDROP_SIZE,
                opacity: BACKDROP_OPACITY, // <— main softening
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.00) 100%)",
                filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.18))",
              }}
              aria-hidden
            />

            {/* Center/current */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={current.img}
                src={current.img}
                alt=""
                className="absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto drop-shadow-xl"
                style={{ width: CENTER_SIZE, height: CENTER_SIZE, objectFit: "contain" }}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -100) swipe("left");
                  else if (info.offset.x > 100) swipe("right");
                }}
              />
            </AnimatePresence>

            {/* Right neighbor */}
            <motion.img
              key={`right-${cards[idxNext].img}`}
              src={cards[idxNext].img}
              alt=""
              className="absolute z-10 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none select-none drop-shadow"
              style={{ width: CENTER_SIZE, height: CENTER_SIZE, objectFit: "contain" }}
              initial={{ x: PEEK_OFFSET, opacity: NEIGHBOR_OPACITY, scale: NEIGHBOR_SCALE }}
              animate={{ x: PEEK_OFFSET, opacity: NEIGHBOR_OPACITY, scale: NEIGHBOR_SCALE }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        {/* Confirm */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <button
            onClick={onConfirm}
            className="bg-orange-300 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-orange-600 transition w-60"
          >
            Confirm
          </button>
          <p className="text-xs text-orange-800">Swipe to Select Card then Confirm</p>
        </div>
      </div>
    </main>
  );
}
