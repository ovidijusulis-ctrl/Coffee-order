'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { COFFEES } from './lib/products';
import { useCart } from './lib/cart';
import FlavorChart from './components/FlavorChart';
import SelectSheet from './components/SelectSheet';

const N = COFFEES.length;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Home() {
  const { items } = useCart();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<'up' | 'down'>('up');
  const [sheetOpen, setSheetOpen] = useState(false);

  const touchStartY = useRef(0);
  const wheelLock = useRef(false);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const navigate = useCallback((d: 1 | -1) => {
    if (sheetOpen) return;
    setDir(d === 1 ? 'up' : 'down');
    setIdx(i => (i + d + N) % N);
  }, [sheetOpen]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 36) navigate(delta > 0 ? 1 : -1);
  }
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (wheelLock.current) return;
    wheelLock.current = true;
    navigate(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLock.current = false; }, 620);
  }

  const coffee = COFFEES[idx];
  const prevC  = COFFEES[(idx - 1 + N) % N];
  const nextC  = COFFEES[(idx + 1) % N];

  return (
    <div style={{
      height: '100dvh', overflow: 'hidden', position: 'relative',
      background: 'var(--background)', display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Header ── */}
      <header style={{
        height: '56px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative', zIndex: 100,
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: '15px', letterSpacing: '0.04em', color: 'var(--text)',
        }}>
          the;kokubo
        </span>

        <Link href={`${BASE}/order`} style={{ textDecoration: 'none', position: 'relative' }}>
          <div style={{
            width: '40px', height: '40px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
          }}>
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
              <path d="M1 1h2.5l2 8h8l2-8" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7.5" cy="14" r="1.2" fill="var(--text-muted)"/>
              <circle cx="13" cy="14" r="1.2" fill="var(--text-muted)"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-5px',
                width: '17px', height: '17px',
                background: 'var(--rust)', color: '#fff',
                borderRadius: '50%', fontSize: '9px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </Link>
      </header>

      {/* ── Drum ── */}
      <div
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {/* ── Background: grain + warm glow + bean watermark ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Warm radial glow centred on chart */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(177,90,50,0.09) 0%, rgba(200,149,26,0.03) 40%, transparent 70%)',
          }} />

          {/* Coffee bean outline watermark */}
          <svg
            viewBox="-115 -135 230 270"
            style={{
              position: 'absolute',
              width: '380px', height: '380px',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -52%) rotate(-18deg)',
              opacity: 0.055,
            }}
          >
            <path
              d="M 0,-120 C 55,-120 92,-68 92,0 C 92,68 55,120 0,120 C -55,120 -92,68 -92,0 C -92,-68 -55,-120 0,-120 Z"
              fill="none" stroke="var(--text)" strokeWidth="2.5"
            />
            <path
              d="M 0,-120 C 30,-78 30,78 0,120"
              fill="none" stroke="var(--text)" strokeWidth="1.8"
            />
          </svg>

          {/* Film grain texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23g)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            mixBlendMode: 'screen',
          }} />
        </div>

        {/* Prev ghost — top */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', zIndex: 20,
            background: 'linear-gradient(to bottom, var(--background) 40%, transparent)',
            border: 'none', cursor: 'pointer', opacity: 0.28,
          }}
        >
          <FlavorChart flavor={prevC.flavor} size={26} />
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '13px', color: 'var(--text)',
          }}>{prevC.name}</span>
        </button>

        {/* Current coffee */}
        <div
          key={idx}
          className={dir === 'up' ? 'drum-enter-up' : 'drum-enter-down'}
          style={{
            position: 'absolute', inset: '64px 0 64px 0',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 32px', textAlign: 'center', zIndex: 1,
          }}
        >
          {/* Side index bar */}
          <div style={{
            position: 'absolute', right: '16px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'center',
          }}>
            {COFFEES.map((_, i) => (
              <div key={i} style={{
                width: '2px',
                height: i === idx ? '22px' : '5px',
                background: i === idx ? 'var(--rust)' : 'var(--border)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }} />
            ))}
          </div>

          {/* Counter */}
          <p style={{
            fontSize: '10px', letterSpacing: '0.25em', color: 'var(--text-muted)',
            marginBottom: '4px',
          }}>
            {String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </p>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 400,
            color: 'var(--text)', letterSpacing: '0.02em', lineHeight: 1.1,
            marginBottom: '4px',
          }}>
            {coffee.name}
          </h1>
          <p style={{
            fontSize: '11px', color: 'var(--text-muted)',
            letterSpacing: '0.08em', marginBottom: '20px',
          }}>
            {coffee.region}
          </p>

          {/* Flavor chart */}
          <div style={{ marginBottom: '20px' }}>
            <FlavorChart flavor={coffee.flavor} size={200} animated />
          </div>

          {/* Roast */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '14px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: '16px', height: '2px', borderRadius: '1px',
                background: i <= coffee.roast ? 'var(--accent)' : 'var(--border)',
              }} />
            ))}
            <span style={{
              fontSize: '9px', color: 'var(--accent)',
              marginLeft: '6px', fontStyle: 'italic', letterSpacing: '0.05em',
            }}>
              {coffee.roastLabelJa}
            </span>
          </div>

          {/* Flavor tags */}
          <div style={{
            display: 'flex', gap: '4px', flexWrap: 'wrap',
            justifyContent: 'center', marginBottom: '20px',
          }}>
            {coffee.notesJa.map(n => (
              <span key={n} style={{
                fontSize: '10px', padding: '3px 9px',
                background: 'var(--surface-container)', color: 'var(--text-muted)',
              }}>{n}</span>
            ))}
          </div>

          {/* Price + CTA */}
          <p style={{
            fontSize: '11px', color: 'var(--text-muted)',
            marginBottom: '14px', letterSpacing: '0.05em',
          }}>
            ¥{coffee.price['100g'].toLocaleString()} / 100g〜
          </p>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              padding: '14px 52px',
              background: 'var(--primary)', color: 'var(--on-primary)',
              border: 'none', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            選ぶ
          </button>
        </div>

        {/* Next ghost — bottom */}
        <button
          onClick={() => navigate(1)}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', zIndex: 20,
            background: 'linear-gradient(to top, var(--background) 40%, transparent)',
            border: 'none', cursor: 'pointer', opacity: 0.28,
          }}
        >
          <FlavorChart flavor={nextC.flavor} size={26} />
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '13px', color: 'var(--text)',
          }}>{nextC.name}</span>
        </button>
      </div>

      {/* ── Select sheet ── */}
      <SelectSheet open={sheetOpen} coffee={coffee} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
