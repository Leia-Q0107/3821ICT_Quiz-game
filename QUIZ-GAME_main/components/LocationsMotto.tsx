'use client';

import { useEffect, useState } from 'react';
import { Dongle } from 'next/font/google';

const dongle = Dongle({ subsets: ['latin'], weight: ['300', '700'] });

/** Keep only letters/numbers/spaces and clamp to N words */
function clampWords(input: string, maxWords = 8): string {
  const cleaned = (input || '')
    .replace(/[“”"‘’'`.,!?;:|/\\(){}\[\]<>~@#$%^&*_+=-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(Boolean);
  return words.slice(0, maxWords).join(' ');
}

type LocationsMottoProps = {
  /** Text color (CSS color or Tailwind class applied via className) */
  color?: string;
  /** Font size in px (default 18) */
  fontSize?: number;
  /** Max words to display (default 8) */
  maxWords?: number;
  /** LocalStorage key for cached motto (default "locMotto") */
  storageKey?: string;
  /** LocalStorage key for persona (default "persona") */
  personaKey?: string;
  /** API endpoint to fetch motto (default "/api/motto") */
  endpoint?: string;
  /** ClassName passthrough (merged with Dongle font) */
  className?: string;
  /** Placeholder while loading or when empty */
  placeholder?: string;
};

export default function LocationsMotto({
  color = '#4D688C',
  fontSize = 18,
  maxWords = 8,
  storageKey = 'locMotto',
  personaKey = 'persona',
  endpoint = '/api/motto',
  className,
  placeholder = 'Loading your motto...',
}: LocationsMottoProps) {
  const [motto, setMotto] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    // 1) Seed from cache (if present)
    try {
      const cached = localStorage.getItem(storageKey) || '';
      if (cached) {
        setMotto(clampWords(cached, maxWords));
        setLoaded(true);
      }
    } catch {
      /* ignore */
    }

    // 2) Fetch fresh from API using persona
    const controller = new AbortController();

    (async () => {
      try {
        const persona = localStorage.getItem(personaKey) || 'Unknown';
        const res = await fetch(`${endpoint}?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ persona }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: { motto?: string } = await res.json();
        const fresh = clampWords(data?.motto || '', maxWords);

        if (fresh) {
          setMotto(fresh);
          try {
            localStorage.setItem(storageKey, fresh);
          } catch {
            /* ignore */
          }
        }
      } catch {
        // soft-fail: keep cache or placeholder
      } finally {
        setLoaded(true);
      }
    })();

    return () => controller.abort();
  }, [endpoint, maxWords, personaKey, storageKey]);

  return (
    <div
      className={[dongle.className, className].filter(Boolean).join(' ')}
      style={{
        fontSize,
        lineHeight: '22px',
        textAlign: 'center',
        color,
        wordBreak: 'break-word',
        whiteSpace: 'normal',
      }}
      aria-live="polite"
    >
      {motto || (loaded ? '' : placeholder)}
    </div>
  );
}
