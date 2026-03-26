'use client';

import Link from 'next/link';
import { useCart } from '../lib/cart';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--cream)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--espresso)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Kokubo
            </span>
            <span
              style={{
                fontSize: '9px',
                color: 'var(--text-muted)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Coffee Roasters
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            href="/#products"
            style={{
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            Coffees
          </Link>
          <Link
            href="/#merchandise"
            style={{
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            Shop
          </Link>
          <Link
            href="/order"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--espresso)',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            <span>Cart</span>
            {totalItems > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brown)',
                  color: 'var(--cream)',
                  fontSize: '11px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
