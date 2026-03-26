'use client';

import Link from 'next/link';
import { PRODUCTS } from './lib/products';
import ProductCard from './components/ProductCard';
import { useCart } from './lib/cart';

export default function HomePage() {
  const { totalItems, subtotal } = useCart();
  const beans = PRODUCTS.filter(p => p.category === 'beans');
  const merch = PRODUCTS.filter(p => p.category !== 'beans');

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          padding: '80px 24px 64px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--brown)',
            marginBottom: '20px',
          }}
        >
          Single Origin · Small Batch · Hand Roasted
        </p>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '700',
            color: 'var(--espresso)',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}
        >
          Coffee worth
          <br />
          <span style={{ fontStyle: 'italic', color: 'var(--brown)' }}>waiting for</span>
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 auto 36px',
          }}
        >
          Freshly roasted to order and delivered to your door.
          Select your beans, choose your grind, and we&apos;ll take care of the rest.
        </p>
        <a
          href="#products"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            backgroundColor: 'var(--espresso)',
            color: 'var(--cream)',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: '1px',
          }}
        >
          Shop Coffee
        </a>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>

      {/* Coffee Beans */}
      <section id="products" style={{ padding: '64px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '8px' }}>
            Our Coffees
          </p>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--espresso)',
              fontFamily: 'Georgia, serif',
            }}
          >
            Single Origins &amp; Blends
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {beans.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Merchandise */}
      <section id="merchandise" style={{ padding: '0 24px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid var(--border)', marginBottom: '48px' }} />
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--brown)', marginBottom: '8px' }}>
            Merchandise
          </p>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--espresso)',
              fontFamily: 'Georgia, serif',
            }}
          >
            Goods
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {merch.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--espresso)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 40,
          }}
        >
          <span style={{ color: 'var(--cream)', fontSize: '14px' }}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} · ¥{subtotal.toLocaleString()}
          </span>
          <Link
            href="/order"
            style={{
              padding: '10px 28px',
              backgroundColor: 'var(--brown-light)',
              color: 'var(--espresso)',
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '1px',
              fontWeight: '600',
            }}
          >
            Review Order →
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          © {new Date().getFullYear()} Kokubo Coffee Roasters · Freshly roasted to order
        </p>
      </footer>
    </div>
  );
}
