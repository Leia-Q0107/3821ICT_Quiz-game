'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAnswer } from '@/lib/answers';

type ChoiceKey = 'work' | 'balanced' | 'relaxed' | 'party';

// 当前题目的 ID，用来保存到 localStorage
const QID = 'q3';

// 把前端的 key 映射成要存储的 value
const Q3_VALUE_MAP: Record<ChoiceKey, string> = {
  work: 'All Work, No Play',
  balanced: 'Balanced Adventurer',
  relaxed: 'Relaxed Scholar',
  party: 'Party Expert',
};

export default function Q3Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<ChoiceKey | null>(null);

  const onConfirm = () => {
    if (!selected) return;

    // ✅ 保存答案
    const ok = saveAnswer(QID, Q3_VALUE_MAP[selected]);
    if (!ok) {
      alert('保存失败，请重试');
      return;
    }

    // ✅ 跳转到下一题（你原来的逻辑）
    router.push('/play/play/q4');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white">
      {/* 画布：内部渐变 */}
      <div className="relative w-[390px] h-[844px] rounded-[28px] overflow-hidden shadow-2xl bg-[linear-gradient(180deg,#C9522C_0%,#E38C62_40%,#F6E0C7_100%)]">

        {/* 标题 */}
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
            color: '#FFFFFF',
          }}
        >
          How will you judge fun and studies on your journey?
        </span>

        {/* Work 选项 */}
        <button
          onClick={() => setSelected('work')}
          style={{ position: 'absolute', top: 140, left: 39, width: 138, height: 210, borderRadius: 7 }}
          className={`bg-transparent ${selected === 'work' ? 'outline outline-[4px] outline-[#F3C468] rounded-[7px]' : ''}`}
          aria-label="All Work, No Play"
        >
          <img src="/quiz/q3/icon-work.png" alt="work" className="w-full h-full object-contain" />
        </button>
        <span
          style={{
            position: 'absolute',
            top: 363,
            left: 49,
            width: 118,
            height: 36,
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: '18px',
            textAlign: 'center',
            color: '#F2D9BB',
          }}
        >
          All Work,<br />No Play
        </span>

        {/* Balanced 选项 */}
        <button
          onClick={() => setSelected('balanced')}
          style={{ position: 'absolute', top: 140, left: 197, width: 138, height: 210, borderRadius: 7 }}
          className={`bg-transparent ${selected === 'balanced' ? 'outline outline-[4px] outline-[#F3C468] rounded-[7px]' : ''}`}
          aria-label="Balanced Adventurer"
        >
          <img src="/quiz/q3/icon-balanced.png" alt="balanced" className="w-full h-full object-contain" />
        </button>
        <span
          style={{
            position: 'absolute',
            top: 361,
            left: 221,
            width: 90,
            height: 36,
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: '18px',
            textAlign: 'center',
            color: '#F2D9BB',
          }}
        >
          Balanced<br />Adventurer
        </span>

        {/* Relaxed 选项 */}
        <button
          onClick={() => setSelected('relaxed')}
          style={{ position: 'absolute', top: 408, left: 39, width: 138, height: 210, borderRadius: 7 }}
          className={`bg-transparent ${selected === 'relaxed' ? 'outline outline-[4px] outline-[#F3C468] rounded-[7px]' : ''}`}
          aria-label="Relaxed Scholar"
        >
          <img src="/quiz/q3/icon-relaxed.png" alt="relaxed" className="w-full h-full object-contain" />
        </button>
        <span
          style={{
            position: 'absolute',
            top: 627,
            left: 70,
            width: 76,
            height: 36,
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: '18px',
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          Relaxed<br />Scholar
        </span>

        {/* Party 选项 */}
        <button
          onClick={() => setSelected('party')}
          style={{ position: 'absolute', top: 408, left: 197, width: 138, height: 210, borderRadius: 7 }}
          className={`bg-transparent ${selected === 'party' ? 'outline outline-[4px] outline-[#F3C468] rounded-[7px]' : ''}`}
          aria-label="Party Expert"
        >
          <img src="/quiz/q3/icon-party.png" alt="party" className="w-full h-full object-contain" />
        </button>
        <span
          style={{
            position: 'absolute',
            top: 629,
            left: 228,
            width: 76,
            height: 36,
            fontFamily: "'Bagel Fat One', cursive",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: '18px',
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          Party<br />Expert
        </span>

        {/* Confirm 按钮 */}
        <button
          disabled={!selected}
          onClick={onConfirm}
          style={{
            position: 'absolute',
            top: 694,
            left: 83,
            width: 208,
            height: 44,
            fontFamily: "'Dongle', sans-serif",
            fontWeight: 700,
            fontSize: 36, 
            lineHeight: '25px', 
            borderRadius: 7,
            padding: '10px 40px',
            gap: 10,
            opacity: selected ? 1 : 0.5,
          }}
          className="bg-[#B24C2B] text-white hover:brightness-110 disabled:cursor-not-allowed transition"
        >
          Confirm
        </button>

        {/* 提示语 */}
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
            lineHeight: '38px',
            textAlign: 'center',
            color: '#BF4F26',
          }}
        >
          Select Image then Confirm
        </span>
      </div>
    </main>
  );
}
