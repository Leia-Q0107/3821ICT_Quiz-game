'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
  const sp = useSearchParams();
  const next = sp.get('next') || '/admin';
  const router = useRouter();
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (r.ok) {
        router.push(next);
      } else {
        const j = await r.json().catch(() => ({}));
        setErr(j?.error || 'Login failed');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f7f7fb' }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: 320, padding: 24, borderRadius: 12, background: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,.07)', display: 'grid', gap: 12, color: '#000'
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, color: '#000' }}>Admin login</h1>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Username</span>
          <input value={username} onChange={e => setU(e.target.value)} required
            style={{ padding: 10, borderRadius: 8, border: '1px solid #000000ff' }} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Password</span>
          <input type="password" value={password} onChange={e => setP(e.target.value)} required
            style={{ padding: 10, borderRadius: 8, border: '1px solid #000000ff' }} />
        </label>

        {err && <div style={{ color: '#b00', fontSize: 14 }}>{err}</div>}

        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '10px 14px', borderRadius: 8, border: 'none',
            background: '#111827', color: '#fff', fontWeight: 700, cursor: 'pointer'
          }}
        >
          {busy ? 'Loging in…' : 'Login'}
        </button>
      </form>
    </main>
  );
}
