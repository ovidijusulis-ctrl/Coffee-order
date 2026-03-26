'use client';

import Link from 'next/link';
import { COFFEES } from './lib/products';
import ProductCard from './components/ProductCard';
import RelatedDrawer from './components/RelatedDrawer';
import { useCart } from './lib/cart';

export default function HomePage() {
  const { totalItems, subtotal } = useCart();

  return (
    <>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(249,249,249,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '56px',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '18px', fontWeight: 400, color: 'var(--primary)', lineHeight: 1,
          }}>
            Kokubo
          </p>
          <p style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Coffee Roasters
          </p>
        </div>
        <Link href="/order" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--primary)', textDecoration: 'none', fontWeight: 600,
        }}>
          <span style={{ fontSize: '18px' }}>🛍</span>
          {totalItems > 0 && (
            <span style={{
              background: 'var(--primary)', color: 'var(--on-primary)',
              borderRadius: '50%', width: '18px', height: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700,
            }}>
              {totalItems}
            </span>
          )}
        </Link>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px 120px' }}>
        {/* Hero */}
        <div style={{ padding: '40px 0 32px', borderBottom: '1px solid var(--border-light)' }}>
          <p style={{
            fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em',
            color: 'var(--text-muted)', marginBottom: '10px',
          }}>
            Single Origin · Small Batch
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 400,
            color: 'var(--primary)', lineHeight: 1.1, marginBottom: '12px',
          }}>
            Freshly roasted,<br />just for you.
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '360px' }}>
            Select your beans below. Roasted after you order, shipped within 2 days.
          </p>
        </div>

        {/* Coffee list */}
        <section>
          {COFFEES.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </section>

        {/* Related items drawer */}
        <RelatedDrawer />

        {/* Free shipping note */}
        <p style={{
          fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center',
          letterSpacing: '0.1em', textTransform: 'uppercase', paddingTop: '24px',
        }}>
          Free shipping on orders over ¥5,000
        </p>
      </main>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          padding: '12px 20px',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: 'var(--on-primary)', fontSize: '13px' }}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} · ¥{subtotal.toLocaleString()}
          </span>
          <Link href="/order" style={{
            padding: '10px 24px',
            background: 'white', color: 'var(--primary)',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            Checkout →
          </Link>
        </div>
      )}
    </>
  );
}
