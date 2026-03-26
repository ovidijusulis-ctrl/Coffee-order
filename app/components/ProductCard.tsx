'use client';

import { useState } from 'react';
import { Product, GrindOption, WeightOption, GRIND_LABELS, GRIND_SUBLABELS, WEIGHT_LABELS } from '../lib/products';
import { useCart } from '../lib/cart';

const ROAST_DESCRIPTIONS = ['Light', 'Light–Med', 'Medium', 'Med–Dark', 'Dark'];

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<WeightOption>('250g');
  const [grind, setGrind] = useState<GrindOption>('whole-bean');
  const [added, setAdded] = useState(false);

  const weights: WeightOption[] = ['100g', '250g', '500g', '1kg'];

  function handleAdd() {
    addItem({ product, weight, grind, quantity: 1 });
    setAdded(true);
    setTimeout(() => { setAdded(false); setOpen(false); }, 1200);
  }

  return (
    <article style={{ borderBottom: '1px solid var(--border-light)' }}>
      {/* Collapsed row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: '0',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', padding: '24px 0', alignItems: 'flex-start' }}>
          {/* Number */}
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px',
            color: 'var(--text-muted)', minWidth: '24px', paddingTop: '4px',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: '24px', fontWeight: 400, color: 'var(--primary)', lineHeight: 1,
              }}>
                {product.name}
              </h2>
              <span style={{
                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em',
                color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
              }}>
                {product.origin}
              </span>
            </div>

            {/* Notes */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {product.notes.map(n => (
                <span key={n} style={{
                  fontSize: '10px', padding: '2px 8px',
                  background: 'var(--surface-container)',
                  color: 'var(--text-muted)', letterSpacing: '0.04em',
                }}>
                  {n}
                </span>
              ))}
            </div>

            {/* Roast bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  height: '3px', width: '20px',
                  background: i <= product.roast ? 'var(--primary)' : 'var(--border)',
                }} />
              ))}
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px', fontStyle: 'italic' }}>
                {product.roastLabel}
              </span>
            </div>
          </div>

          {/* Price + toggle */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--primary)', marginBottom: '4px',
            }}>
              from ¥{product.price['100g']}
            </p>
            <span style={{
              fontSize: '11px', color: 'var(--text-muted)',
              display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s', lineHeight: 1,
            }}>
              ▾
            </span>
          </div>
        </div>
      </button>

      {/* Expanded selector */}
      {open && (
        <div style={{ paddingBottom: '28px', paddingLeft: '40px' }}>
          {/* Weight */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em',
              fontWeight: 600, marginBottom: '12px', color: 'var(--text)',
            }}>
              Select Weight
            </p>
            <div style={{ display: 'flex', gap: '0' }}>
              {weights.map(w => (
                <button key={w} onClick={() => setWeight(w)} style={{
                  flex: 1, padding: '14px 0', background: 'none', border: 'none',
                  borderBottom: `2px solid ${weight === w ? 'var(--primary)' : 'var(--border-light)'}`,
                  color: weight === w ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: weight === w ? 600 : 400,
                  letterSpacing: '0.05em', transition: 'all 0.15s',
                }}>
                  {WEIGHT_LABELS[w]}
                  <br />
                  <span style={{ fontSize: '11px', fontWeight: 400 }}>¥{product.price[w]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grind */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em',
              fontWeight: 600, marginBottom: '12px', color: 'var(--text)',
            }}>
              Grind
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(product.grindOptions || []).map(g => (
                <button key={g} onClick={() => setGrind(g)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: grind === g ? 'var(--primary)' : 'var(--surface-low)',
                  border: 'none',
                  color: grind === g ? 'var(--on-primary)' : 'var(--text)',
                  textAlign: 'left', transition: 'all 0.15s',
                }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '1px' }}>{GRIND_LABELS[g]}</p>
                    <p style={{ fontSize: '10px', opacity: grind === g ? 0.6 : 0.5 }}>{GRIND_SUBLABELS[g]}</p>
                  </div>
                  <span style={{ fontSize: '16px', opacity: grind === g ? 1 : 0.2 }}>
                    {grind === g ? '●' : '○'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={handleAdd} style={{
            width: '100%', padding: '18px',
            background: added ? '#333' : 'var(--primary)',
            color: 'var(--on-primary)', border: 'none',
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase',
            transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            {added ? (
              <><span>✓</span> Added to Cart</>
            ) : (
              <><span style={{ fontSize: '16px' }}>🛍</span> Add to Cart — ¥{product.price[weight]}</>
            )}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>
            {product.description}
          </p>
        </div>
      )}
    </article>
  );
}
