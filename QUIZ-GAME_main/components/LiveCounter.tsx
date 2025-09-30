'use client';

import { useEffect, useState } from 'react';

export default function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    let abort: AbortController | null = null;

    const fetchCount = async () => {
      try {
        abort?.abort();
        abort = new AbortController();

        const r = await fetch('/api/answers/count', {
          signal: abort.signal,
          cache: 'no-store',
        });
        if (!r.ok) throw new Error('failed');
        const json = (await r.json()) as { count: number };
        setCount(json.count);
      } catch {
        // keep last good value; no-op on error
      }
    };

    // initial + poll
    fetchCount();
    timer = setInterval(fetchCount, 5000); // every 5s

    return () => {
      abort?.abort();
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <p className="text-sm text-neutral-700">
      Live submissions: {count ?? '—'}
    </p>
  );
}
