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
        background: 'rgba(46,45,45,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '56px',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '19px', fontWeight: 400, color: 'var(--text)',
            lineHeight: 1, letterSpacing: '0.01em',
          }}>
            the;kokubo
          </p>
          <p style={{
            fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginTop: '1px',
          }}>
            coffee roasters
          </p>
        </div>
        <Link href="/order" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          textDecoration: 'none', color: 'var(--text)',
        }}>
          <span style={{ fontSize: '20px', lineHeight: 1 }}>🛍</span>
          {totalItems > 0 && (
            <span style={{
              background: 'var(--accent)', color: 'var(--on-primary)',
              borderRadius: '50%', width: '20px', height: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
            }}>
              {totalItems}
            </span>
          )}
        </Link>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px 120px' }}>
        {/* Hero */}
        <div style={{ padding: '36px 0 28px', borderBottom: '1px solid var(--border-light)' }}>
          <p style={{
            fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: '12px',
          }}>
            手回し焙煎 · ダイレクトトレード
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(28px, 7vw, 42px)', fontWeight: 400,
            color: 'var(--text)', lineHeight: 1.15, marginBottom: '14px',
          }}>
            注文後に焙煎する、<br />こだわりの一杯を。
          </h1>
          <p style={{
            fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '380px',
          }}>
            豆を選んで、挽き方を選ぶだけ。焙煎したての状態でお届けします。
          </p>
        </div>

        {/* Coffee list */}
        <section style={{ paddingTop: '4px' }}>
          {COFFEES.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </section>

        {/* Related items */}
        <RelatedDrawer />

        {/* Free shipping note */}
        <p style={{
          fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center',
          letterSpacing: '0.08em', paddingTop: '28px', lineHeight: 1.6,
        }}>
          ¥5,000以上のご注文で送料無料<br />
          <span style={{ fontSize: '10px' }}>ご注文を受けてから2日以内に焙煎・発送します</span>
        </p>

        {/* Footer */}
        <div style={{
          marginTop: '48px', paddingTop: '24px',
          borderTop: '1px solid var(--border-light)',
          fontSize: '11px', color: 'var(--text-muted)', lineHeight: 2,
        }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '14px', color: 'var(--text)', marginBottom: '8px' }}>
            the;kokubo
          </p>
          <p>〒400-0043 山梨県甲府市国母4-21-10</p>
          <p>070-8549-0920</p>
          <p>9:00〜18:00（平日）10:00〜19:00（土日祝）水曜定休</p>
          <a href="mailto:thekokubocoffee@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            thekokubocoffee@gmail.com
          </a>
        </div>
      </main>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          padding: '14px 20px',
          background: 'var(--surface-container)',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: 'var(--text)', fontSize: '13px' }}>
            {totalItems}点 · ¥{subtotal.toLocaleString()}
          </span>
          <Link href="/order" style={{
            padding: '11px 28px',
            background: 'var(--primary)', color: 'var(--on-primary)',
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em',
            textDecoration: 'none',
          }}>
            購入手続きへ →
          </Link>
        </div>
      )}
    </>
  );
}
