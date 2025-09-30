'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { computePersona, type Persona } from '@/lib/scoring';
import { getAnswers } from '@/lib/answers';

// persona → result route folder
const PERSONA_TO_RESULT: Record<Persona, string> = {
  'City Visionary': 'r1',
  'Adventurous Scholar': 'r6',
  'Dynamic Explorer': 'r2',
  'Creative Innovator': 'r5',
  'Focused Scholar': 'r3',
  'Balanced Adventurer': 'r8',
  'Nature-Loving Learner': 'r4',
  'Mindful Learner': 'r7',
};

type PostBody = {
  answers: Record<string, string>;
  persona: Persona;
  meta?: {
    sessionId?: string;
    ua?: string;
    tz?: string;
    clientTimeISO?: string;
  };
};

type PostResp = { ok: boolean; id?: string };

function getOrCreateSessionId(): string {
  const key = 'sessionId';
  try {
    const v = localStorage.getItem(key);
    if (v) return v;
    const sid = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(key, sid);
    return sid;
  } catch {
    return `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
}

export default function Page() {
  const router = useRouter();
  const msg = 'I wonder where you will go?';
  const [mounted, setMounted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowButton(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showButton) return;
    const btn = document.querySelector<HTMLButtonElement>('.reveal-btn');
    if (!btn) return;

    const onClick = async (e: Event) => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);

      // 1) read answers & compute
      const answers = getAnswers();
      const persona = computePersona(answers);

      // 2) save persona locally (optional)
      try { localStorage.setItem('persona', persona); } catch {}

      // 3) POST to /api/answers (server writes to Firestore)
      const body: PostBody = {
        answers,
        persona,
        meta: {
          sessionId: getOrCreateSessionId(),
          ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          clientTimeISO: new Date().toISOString(),
        },
      };

      try {
        const ctl = new AbortController();
        const timeout = setTimeout(() => ctl.abort(), 5000);

        const r = await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: ctl.signal,
          cache: 'no-store',
        });

        clearTimeout(timeout);

        if (r.ok) {
          const json = (await r.json()) as PostResp;
          if (json.ok && json.id) {
            try { localStorage.setItem('submissionId', json.id); } catch {}
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn('POST /api/answers non-2xx:', r.status);
        }
      } catch (err) {
        console.error('POST /api/answers failed:', err);
      }

      // 4) navigate to result
      const slug = PERSONA_TO_RESULT[persona] ?? 'r8';
      (router as unknown as { prefetch?: (href: string) => void }).prefetch?.(`/result/${slug}`);
      router.push(`/result/${slug}`);
    };

    btn.addEventListener('click', onClick, { once: true });
    return () => btn.removeEventListener('click', onClick);
  }, [showButton, router, submitting]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src="/Q8/Background.png"
          alt="Gathering results"
          style={{ maxHeight: '100vh', width: 'auto', display: 'block', borderRadius: 8 }}
        />

        {mounted && (
          <p
            className="line"
            aria-label={msg}
            style={{
              position: 'absolute',
              bottom: '46%',
              left: '18%',
              transform: 'translateX(-50%)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {msg.split('').map((ch, i) => (
              <span key={i} className="char" style={{ animationDelay: `${i * 0.06}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </p>
        )}

        {showButton && (
          <button className="reveal-btn" disabled={submitting}>
            {submitting ? 'Working…' : 'Click to Find out!'}
          </button>
        )}
      </div>

      <style jsx>{`
        .line {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          opacity: 0;
          transform: translateY(8px);
          animation: fadeInUp 900ms ease forwards 3000ms;
          user-select: none;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        .char {
          display: inline-block;
          animation: wiggle 1400ms ease-in-out infinite;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(-1deg); }
        }
        .reveal-btn {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          background-color: #4d688c;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          opacity: 0;
          animation: buttonReveal 800ms ease forwards, buttonShake 600ms ease 800ms;
        }
        .reveal-btn[disabled] {
          opacity: 0.8 !important;
          cursor: not-allowed;
          filter: saturate(0.6);
        }
        .reveal-btn:hover:not([disabled]) {
          background-color: #5a799e;
          transform: translateX(-50%) scale(1.05);
        }
        @keyframes buttonReveal {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes buttonShake {
          0%   { transform: translateX(-50%) rotate(0deg); }
          25%  { transform: translateX(-50%) rotate(3deg); }
          50%  { transform: translateX(-50%) rotate(-3deg); }
          75%  { transform: translateX(-50%) rotate(2deg); }
          100% { transform: translateX(-50%) rotate(0deg); }
        }
      `}</style>
    </main>
  );
}
