'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dongle, Bagel_Fat_One } from 'next/font/google';
import { saveAnswer } from '@/lib/answers'; // ✅ 新增

const dongle = Dongle({ subsets: ['latin'], weight: ['300', '700'] });
const bagel  = Bagel_Fat_One({ subsets: ['latin'], weight: '400' });

type Item = { src: string; w: number; h: number; top: number; left: number; opacity?: number };
const zFromTop = (top: number) => Math.round(top * 100);

/** ⏱️ 动画时长（可按需微调） */
const EXIT_UP_MS   = 900;    // Under / Well 向上退出
const EXIT_FADE_MS = 1600;   // Trove → Over 慢慢淡出
const DROP_MS      = 700;    // 新组从上落下

/* -------------------- 数据 -------------------- */
const IDLE: Item[] = [
  { src: '/Q2/Group52.png', w: 180.65, h: 180, top: 110, left: 97 },
];

const UNDER: Item[] = [
  { src: '/Q2/Group71.png', w: 180.65, h: 180,    top: 110,    left: 97 },
  { src: '/Q2/Group72.png', w: 94.22,  h: 113.72, top: 176.28, left: 147.04 },
];

const WELL: Item[] = [
  { src: '/Q2/Group77.png',       w: 131.26, h: 180.14, top: 110,    left: 97 },
  { src: '/Q2/TreasureBag.png',   w: 81.23,  h: 113.72, top: 132.74, left: 187.32 },
  { src: '/Q2/Group73.png',       w: 94.22,  h: 113.72, top: 176.28, left: 147.04 },
  { src: '/Q2/TreasureTall.png',  w: 25.99,  h: 51.34,  top: 238.66, left: 134.04 },
  { src: '/Q2/TreasureTall.png',  w: 25.99,  h: 51.34,  top: 223.72, left: 241.26, opacity: 0.25 },
  { src: '/Q2/TreasureShort.png', w: 22.09,  h: 20.14,  top: 264.66, left: 232.16, opacity: 0.25 },
  { src: '/Q2/TreasureShort.png', w: 22.09,  h: 20.14,  top: 269.86, left: 255.56, opacity: 0.25 },
];

const TROVE: Item[] = [
  { src: '/Q2/TreasureBag.png',   w: 81.23,  h: 113.72, top: 110,    left: 147.04, opacity: 0.25 },
  { src: '/Q2/TreasureBag.png',   w: 81.23,  h: 113.72, top: 132.74, left: 106.10 },
  { src: '/Q2/TreasureBag.png',   w: 81.23,  h: 113.72, top: 176.28, left: 147.04 },
  { src: '/Q2/TreasureBag.png',   w: 81.23,  h: 113.72, top: 132.74, left: 187.32 },
  { src: '/Q2/TreasureTall.png',  w: 25.99,               h: 51.34,             top: 223.72, left: 108.05 },
  { src: '/Q2/TreasureTall.png',  w: 25.99,               h: 51.34,             top: 238.66, left: 134.04 },
  { src: '/Q2/TreasureTall.png',  w: 25.992780685424805,  h: 51.33573913574219, top: 223.72, left: 241.26, opacity: 0.25 },
  { src: '/Q2/TreasureTall.png',  w: 25.992780685424805,  h: 51.33573913574219, top: 238.66, left: 215.27, opacity: 1 },
  { src: '/Q2/TreasureShort.png', w: 22.09386444091797,   h: 20.1444034576416,  top: 269.86, left: 97,     opacity: 0.25 },
  { src: '/Q2/TreasureShort.png', w: 22.09386444091797,   h: 20.1444034576416,  top: 264.66, left: 117.79, opacity: 1 },
  { src: '/Q2/TreasureShort.png', w: 22.09386444091797,   h: 20.1444034576416,  top: 269.86, left: 255.56, opacity: 0.25 },
  { src: '/Q2/TreasureShort.png', w: 22.09386444091797,   h: 20.1444034576416,  top: 264.66, left: 232.16, opacity: 0.25 },
];

const OVER: Item[] = [
  { src: '/Q2/Group52.png', w: 180.65, h: 180, top: 110, left: 97 },
];

/* -------------------- 通用精灵 -------------------- */
function Sprite({ it, mode }: { it: Item; mode: 'static' | 'exitUp' | 'fade' | 'drop' }) {
  const base: React.CSSProperties = {
    position: 'absolute',
    top: it.top,
    left: it.left,
    width: it.w,
    height: it.h,
    zIndex: zFromTop(it.top),
    transform: 'translateY(0)',
    willChange: 'transform, opacity',
    pointerEvents: 'none',
  };

  const style: React.CSSProperties =
    mode === 'exitUp'
      ? { ...base, transform: 'translateY(-60px)', opacity: 0, transition: `transform ${EXIT_UP_MS}ms ease, opacity ${EXIT_UP_MS}ms ease` }
      : mode === 'fade'
      ? { ...base, animation: `fadeOutSlow ${EXIT_FADE_MS}ms ease forwards` }
      : mode === 'drop'
      ? { ...base, animation: `dropIn ${DROP_MS}ms cubic-bezier(.2,.8,.2,1) both` }
      : base;

  return (
    <div style={style}>
      <img src={it.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: it.opacity ?? 1 }} />
    </div>
  );
}

/* -------------------- 页面 -------------------- */
export default function Page() {
  type View = 'Under' | 'Well' | 'Trove' | 'Over' | null;
  type ExitGrp = 'Under' | 'Well' | 'Trove' | null;

  // ✅ 为当前题定义一个题号（保存在 localStorage.answers 里的 key）
  const QID = 'q2';
  // ✅ 把 UI 的四个态映射为你希望存储的值（可按需改成 A/B/C/D 或更描述性的值）
  const Q2_VALUE_MAP: Record<Exclude<View, null>, string> = {
    Under: 'under_25k',
    Well: '25k_35k',
    Trove: '35k_45k',
    Over:  'over_45k',
  };

  const [showIdle, setShowIdle] = useState(true);
  const [view, setView] = useState<View>(null);
  const [exiting, setExiting] = useState<ExitGrp>(null);
  const [picked, setPicked] = useState<View>(null);
  const router = useRouter();

  const hideIdle = () => showIdle && setShowIdle(false);

  const goUnder = () => { hideIdle(); setPicked('Under'); setExiting(null); setView('Under'); };
  const goWell  = () => { hideIdle(); setPicked('Well');  setExiting(null); setView('Well');  };

  const goTrove = () => {
    hideIdle(); setPicked('Trove');
    if (view === 'Under' || view === 'Well') {
      setExiting(view); setTimeout(() => { setView('Trove'); setExiting(null); }, EXIT_UP_MS);
    } else {
      setView('Trove');
    }
  };

  const goOver = () => {
    hideIdle(); setPicked('Over');
    if (view === 'Trove' || view === 'Under' || view === 'Well') {
      setExiting(view);
      const delay = view === 'Trove' ? EXIT_FADE_MS : EXIT_UP_MS;
      setTimeout(() => { setView('Over'); setExiting(null); }, delay);
    } else {
      setView('Over');
    }
  };

  const optionBase: React.CSSProperties = {
    position: 'absolute',
    width: 256,
    height: 60,
    left: 59,
    borderRadius: 7,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#BF4F26',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity .15s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,.18)',
  };
  const optionText: React.CSSProperties = { color: '#F2D9BB', fontSize: 15, lineHeight: '38px', textAlign: 'center', fontWeight: 400 };

  return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff' }}>
      <div
        style={{
          position:'relative', display:'inline-block',
          width:'min(92vw, 380px)', aspectRatio:'375 / 812', maxHeight:'100vh',
          borderRadius:8, overflow:'hidden',
          background:'linear-gradient(to bottom, #4D688C, #BF4F26)',
        }}
      >
        {/* 默认态 */}
        {showIdle && IDLE.map((it, i) => <Sprite key={`idle-${i}`} it={it} mode="static" />)}
        {(view === 'Under' || exiting === 'Under') &&
          UNDER.map((it, i) => <Sprite key={`u-${i}`} it={it} mode={exiting === 'Under' ? 'exitUp' : 'static'} />)}
        {(view === 'Well' || exiting === 'Well') &&
          WELL.map((it, i) => <Sprite key={`w-${i}`} it={it} mode={exiting === 'Well' ? 'exitUp' : 'static'} />)}
        {(view === 'Trove' || exiting === 'Trove') &&
          TROVE.map((it, i) => <Sprite key={`t-${i}`} it={it} mode={exiting === 'Trove' ? 'fade' : 'drop'} />)}
        {view === 'Over' && OVER.map((it, i) => <Sprite key={`o-${i}`} it={it} mode="drop" />)}

        {/* 关键帧 */}
        <style jsx>{`
          @keyframes dropIn { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes fadeOutSlow { from { opacity: 1; } to { opacity: 0; } }
        `}</style>

        {/* 标题 */}
        <h1
          className={dongle.className}
          style={{
            position:'absolute', width:316, height:64, top:44, left:29, margin:0,
            color:'#fff', fontWeight:700, fontSize:32, lineHeight:'32px', textAlign:'center',
            textShadow:'0 2px 6px rgba(0,0,0,.25)',
          }}
        >
          What’s your treasure chest looking for this Aussie quest?
        </h1>

        {/* 选项按钮 */}
        <button type="button" onClick={goUnder} style={{ ...optionBase, top:310, opacity: picked==='Under' ? 1 : 0.5 }}>
          <span className={bagel.className} style={optionText}>Small Fortune - Under AUD 25k</span>
        </button>
        <button type="button" onClick={goWell} style={{ ...optionBase, top:390, opacity: picked==='Well' ? 1 : 0.5 }}>
          <span className={bagel.className} style={optionText}>Well Stocked - AUD 25k - 35k</span>
        </button>
        <button type="button" onClick={goTrove} style={{ ...optionBase, top:470, opacity: picked==='Trove' ? 1 : 0.5 }}>
          <span className={bagel.className} style={optionText}>Treasure Trove - AUD 35k - 45k</span>
        </button>
        <button type="button" onClick={goOver} style={{ ...optionBase, top:550, opacity: picked==='Over' ? 1 : 0.5 }}>
          <span className={bagel.className} style={optionText}>Endless Gold - Over AUD 45k</span>
        </button>

        {/* Confirm */}
        <button
          type="button"
          disabled={!picked}
          onClick={() => {
            if (!picked) return;
            // ✅ 保存本题答案到 localStorage（方法1的核心）
            saveAnswer(QID, Q2_VALUE_MAP[picked]);
            // 跳到下一题
            router.push('/play/play/q3');
          }}
          style={{
            position:'absolute', left:'50%', bottom:'12%', transform:'translateX(-50%)',
            width:200, height:50, borderRadius:8, border:'none', background:'#325B8C',
            opacity: picked ? 1 : 0.5, cursor: picked ? 'pointer' : 'not-allowed',
            boxShadow:'0 6px 16px rgba(0,0,0,.25)', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'opacity .15s ease',
          }}
        >
          <span className={dongle.className} style={{ fontSize:36, lineHeight:'38px', fontWeight:700 }}>Confirm</span>
        </button>

        {/* 底部提示 */}
        <p
          className={dongle.className}
          style={{
            position:'absolute', width:316, height:38, top:757, left:29, margin:0,
            color:'#fff', fontWeight:300, fontSize:24, lineHeight:'38px', textAlign:'center',
          }}
        >
          Select Answer then Confirm
        </p>
      </div>
    </main>
  );
}
