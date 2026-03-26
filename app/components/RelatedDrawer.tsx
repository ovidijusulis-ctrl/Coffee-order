'use client';

import { useState } from 'react';
import { RELATED_ITEMS } from '../lib/products';
import { useCart } from '../lib/cart';

export default function RelatedDrawer() {
  const [open, setOpen] = useState(false);
  const { relatedItems, addRelated, removeRelated } = useCart();

  const isAdded = (id: string) => relatedItems.some(r => r.item.id === id);

  return (
    <div style={{ borderTop: '1px solid var(--border-light)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', background: 'none', border: 'none', textAlign: 'left',
        }}
      >
        <div>
          <p style={{
            fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em',
            fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px',
          }}>
            Also Available
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', color: 'var(--primary)' }}>
            Goods &amp; Subscriptions
          </p>
        </div>
        <span style={{
          fontSize: '20px', color: 'var(--text-muted)',
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>
          +
        </span>
      </button>

      {open && (
        <div style={{ paddingBottom: '24px' }}>
          {RELATED_ITEMS.map(item => {
            const added = isAdded(item.id);
            return (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 0', borderTop: '1px solid var(--border-light)',
              }}>
                {/* Category dot */}
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--primary)', flexShrink: 0, marginTop: '2px',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)', marginBottom: '2px' }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {item.description}
                  </p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)', marginRight: '12px' }}>
                  ¥{item.price}
                </span>
                <button
                  onClick={() => added ? removeRelated(item.id) : addRelated(item)}
                  style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    background: added ? 'var(--primary)' : 'transparent',
                    border: `1px solid ${added ? 'var(--primary)' : 'var(--border)'}`,
                    color: added ? 'var(--on-primary)' : 'var(--text)',
                    fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {added ? '✓' : '+'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
