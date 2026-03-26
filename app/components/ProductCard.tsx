'use client';

import { useState } from 'react';
import { Product, GrindOption, WeightOption, GRIND_LABELS_JA, GRIND_SUBLABELS_JA, WEIGHT_LABELS } from '../lib/products';
import { useCart } from '../lib/cart';

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<WeightOption>('100g');
  const [grind, setGrind] = useState<GrindOption>('whole-bean');
  const [added, setAdded] = useState(false);

  const weights: WeightOption[] = ['100g', '250g', '500g', '1kg'];

  function handleAdd() {
    addItem({ product, weight, grind, quantity: 1 });
    setAdded(true);
    setTimeout(() => { setAdded(false); setOpen(false); }, 1400);
  }

  return (
    <article style={{ borderBottom: '1px solid var(--border-light)' }}>
      {/* Collapsed row */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0' }}
      >
        <div style={{ display: 'flex', gap: '14px', padding: '22px 0', alignItems: 'flex-start' }}>
          {/* Index */}
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '12px',
            color: 'var(--text-muted)', minWidth: '22px', paddingTop: '3px',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {/* Name */}
            <div style={{ marginBottom: '6px' }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: '22px', fontWeight: 400, color: 'var(--text)',
                lineHeight: 1, marginBottom: '2px', letterSpacing: '0.02em',
              }}>
                {product.name}
              </h2>
              <span style={{
                fontSize: '11px', color: 'var(--text-muted)',
                letterSpacing: '0.05em',
              }}>
                {product.region} · {product.processJa}
              </span>
            </div>

            {/* Tasting notes */}
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {product.notesJa.map(n => (
                <span key={n} style={{
                  fontSize: '10px', padding: '2px 7px',
                  background: 'var(--surface-container)',
                  color: 'var(--text-muted)', letterSpacing: '0.02em',
                }}>
                  {n}
                </span>
              ))}
            </div>

            {/* Roast bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  height: '2px', width: '18px',
                  background: i <= product.roast ? 'var(--accent)' : 'var(--border)',
                  transition: 'background 0.2s',
                }} />
              ))}
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px', fontStyle: 'italic' }}>
                {product.roastLabelJa}
              </span>
            </div>
          </div>

          {/* Price + chevron */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '15px',
              color: 'var(--text)', marginBottom: '4px',
            }}>
              ¥{product.price['100g'].toLocaleString()}〜
            </p>
            <span style={{
              fontSize: '11px', color: 'var(--text-muted)',
              display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s', lineHeight: 1,
            }}>▾</span>
          </div>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div style={{ paddingBottom: '28px', paddingLeft: '36px' }}>
          {/* Description */}
          <p style={{
            fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
            marginBottom: '22px',
          }}>
            {product.descriptionJa}
          </p>

          {/* Weight selector */}
          <div style={{ marginBottom: '22px' }}>
            <p style={{
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em',
              fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)',
            }}>
              容量を選ぶ
            </p>
            <div style={{ display: 'flex' }}>
              {weights.map(w => (
                <button key={w} onClick={() => setWeight(w)} style={{
                  flex: 1, padding: '12px 0', background: 'none', border: 'none',
                  borderBottom: `2px solid ${weight === w ? 'var(--primary)' : 'var(--border-light)'}`,
                  color: weight === w ? 'var(--text)' : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: weight === w ? 600 : 400,
                  letterSpacing: '0.03em', transition: 'all 0.15s', textAlign: 'center',
                }}>
                  {WEIGHT_LABELS[w]}
                  <br />
                  <span style={{ fontSize: '11px', fontWeight: 400 }}>¥{product.price[w].toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grind selector */}
          {product.grindOptions && (
            <div style={{ marginBottom: '22px' }}>
              <p style={{
                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em',
                fontWeight: 600, marginBottom: '10px', color: 'var(--text-muted)',
              }}>
                挽き方を選ぶ
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {product.grindOptions.map(g => (
                  <button key={g} onClick={() => setGrind(g)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 13px',
                    background: grind === g ? 'var(--primary)' : 'var(--surface-low)',
                    border: 'none',
                    color: grind === g ? 'var(--on-primary)' : 'var(--text)',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '1px' }}>{GRIND_LABELS_JA[g]}</p>
                      <p style={{ fontSize: '10px', opacity: 0.6 }}>{GRIND_SUBLABELS_JA[g]}</p>
                    </div>
                    <span style={{ fontSize: '14px', opacity: grind === g ? 1 : 0.25 }}>
                      {grind === g ? '●' : '○'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button onClick={handleAdd} style={{
            width: '100%', padding: '17px',
            background: added ? 'var(--surface-high)' : 'var(--primary)',
            color: added ? 'var(--text)' : 'var(--on-primary)',
            border: 'none', fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.15em',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            {added ? '✓ カートに追加しました' : `カートに追加 — ¥${product.price[weight].toLocaleString()}`}
          </button>
        </div>
      )}
    </article>
  );
}
