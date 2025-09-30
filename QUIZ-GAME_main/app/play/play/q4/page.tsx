'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAnswer, getAnswers } from '@/lib/answers';

type ChoiceKey = 'creative' | 'fast' | 'relaxed' | 'mix';
const QID = 'q4';

const Q4_VALUE_MAP: Record<ChoiceKey, string> = {
  creative: 'Big and Creative',
  fast: 'Fast-Paced and Exciting',
  relaxed: 'Quiet and Relaxed',
  mix: 'A Mix of City and Nature',
};

export default function Q4Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<ChoiceKey | null>(null);

  useEffect(() => {
    const a = getAnswers();
    const stored = a[QID] as string | undefined;
    if (!stored) return;
    const backMap: Partial<Record<string, ChoiceKey>> = {
      'Big and Creative': 'creative',
      'Fast-Paced and Exciting': 'fast',
      'Quiet and Relaxed': 'relaxed',
      'A Mix of City and Nature': 'mix',
    };
    const key = backMap[stored];
    if (key) setSelected(key);
  }, []);

  const onConfirm = () => {
    if (!selected) return;
    const ok = saveAnswer(QID, Q4_VALUE_MAP[selected]);
    if (!ok) {
      alert('保存失败，请重试');
      return;
    }
    router.push('/play/play/q5');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white">
      {/* 画布容器 */}
      <div className="relative w-[390px] h-[844px] rounded-[28px] overflow-hidden shadow-2xl bg-[#FCE9D9]">

        {/* ===== 标题（32/32, 316x64, top:44 left:29, #BF4F26） ===== */}
        <span
          style={{
            position: 'absolute',
            top: 44,
            left: 29,
            width: 316,
            height: 64,
            fontFamily: "'Dongle', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            lineHeight: '32px',
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          Where will you set up your basecamp for learning?
        </span>

        {/* ===== 插画 ===== */}
        <img
          src={selected ? `/quiz/q4/${selected}.png` : '/quiz/q4/base.png'}
          alt="Basecamp"
          className="absolute select-none pointer-events-none"
          style={{ top: 142, left: 59, width: 256, height: 256 }}
          draggable={false}
        />

        {/* ===== Big and Creative ===== */}
        <button
          onClick={() => setSelected('creative')}
          style={{
            position: 'absolute',
            top: 418,
            left: 59,
            width: 256,
            height: 44,
            borderRadius: 7,
            padding: '10px',
            gap: 10,
            background: selected === 'creative' ? '#BF4F26' : '#EABFA6',
            color: selected === 'creative' ? '#FFFFFF' : '#BF4F26',
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: '25px', // ← 与图一致
            textAlign: 'center',
          }}
        >
          Big and Creative
        </button>

        {/* ===== Fast-paced and Exciting ===== */}
        <button
          onClick={() => setSelected('fast')}
          style={{
            position: 'absolute',
            top: 482,
            left: 59,
            width: 256,
            height: 44,
            borderRadius: 7,
            padding: '10px',
            gap: 10,
            background: selected === 'fast' ? '#BF4F26' : '#EABFA6',
            color: selected === 'fast' ? '#FFFFFF' : '#BF4F26',
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: '25px',
            textAlign: 'center',
          }}
        >
          Fast-paced and Exciting
        </button>

        {/* ===== Quiet and Relaxed ===== */}
        <button
          onClick={() => setSelected('relaxed')}
          style={{
            position: 'absolute',
            top: 546,
            left: 59,
            width: 256,
            height: 44,
            borderRadius: 7,
            padding: '10px',
            gap: 10,
            background: selected === 'relaxed' ? '#BF4F26' : '#EABFA6',
            color: selected === 'relaxed' ? '#FFFFFF' : '#BF4F26',
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: '25px',
            textAlign: 'center',
          }}
        >
          Quiet and Relaxed
        </button>

        {/* ===== A mix of City and Nature ===== */}
        <button
          onClick={() => setSelected('mix')}
          style={{
            position: 'absolute',
            top: 610,
            left: 59,
            width: 256,
            height: 44,
            borderRadius: 7,
            padding: '10px',
            gap: 10,
            background: selected === 'mix' ? '#BF4F26' : '#EABFA6',
            color: selected === 'mix' ? '#FFFFFF' : '#BF4F26',
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: '25px',
            textAlign: 'center',
          }}
        >
          A mix of City and Nature
        </button>

        {/* ===== Confirm（36/38） ===== */}
        <button
          disabled={!selected}
          onClick={onConfirm}
          style={{
            position: 'absolute',
            top: 694,
            left: 83,
            width: 208,
            height: 44,
            borderRadius: 7,
            padding: '10px 40px',
            gap: 10,
            opacity: selected ? 1 : 0.5,
            background: '#B24C2B',
            color: '#FFFFFF',               // 图里文字色为 #F2D9BB 50%，但考虑对比度这里保持白色；若要完全贴图，可改成 'rgba(242,217,187,0.5)'
            fontFamily: "'Dongle', sans-serif",
            fontWeight: 700,
            fontSize: 36,                   // ← 与图一致
            lineHeight: '25px',             // ← 与图一致
            textAlign: 'center',
          }}
          className="hover:brightness-110 disabled:cursor-not-allowed transition"
        >
          Confirm
        </button>

        {/* ===== 提示语（24/38） ===== */}
        <span
          style={{
            position: 'absolute',
            top: 757,
            left: 29,
            width: 316,
            height: 38,
            fontFamily: "'Dongle', sans-serif",
            fontWeight: 300,
            fontSize: 24,
            lineHeight: '38px', // ← 与图一致
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          Select Answer then Confirm
        </span>
      </div>
    </main>
  );
}
