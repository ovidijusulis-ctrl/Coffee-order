'use client';

import { useState } from 'react';
import { Product, GrindOption, WeightOption, GRIND_LABELS_JA, GRIND_SUBLABELS_JA, WEIGHT_LABELS } from '../lib/products';
import { useCart } from '../lib/cart';
import WheelPicker from './WheelPicker';
import CoffeeBagIllustration from './CoffeeBagIllustration';

const WEIGHT_OPTIONS: { value: WeightOption; label: string; sublabel?: string }[] = [
  { value: '100g', label: '100g' },
  { value: '250g', label: '250g' },
  { value: '500g', label: '500g' },
  { value: '1kg',  label: '1kg' },
];

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<WeightOption>('100g');
  const [grind, setGrind] = useState<GrindOption>('whole-bean');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const grindOptions = (product.grindOptions ?? []).map(g => ({
    value: g,
    label: GRIND_LABELS_JA[g],
    sublabel: GRIND_SUBLABELS_JA[g],
  }));

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({ product, weight, grind, quantity: 1 });
    }
    setAdded(true);
    setTimeout(() => { setAdded(false); setOpen(false); setQty(1); }, 1400);
  }

  return (
    <article style={{ borderBottom: '1px solid var(--border-light)' }}>
      {/* ── Collapsed tap target ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0' }}
      >
        <div style={{ display: 'flex', gap: '14px', padding: '20px 0', alignItems: 'center' }}>
          {/* Index */}
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '11px',
            color: 'var(--text-muted)', minWidth: '20px', alignSelf: 'flex-start', paddingTop: '4px',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Thumbnail bag */}
          <div style={{
            width: '60px', height: '60px', flexShrink: 0,
            borderRadius: '2px', overflow: 'hidden',
            border: '1px solid var(--border-light)',
            background: 'var(--background)',
          }}>
            <CoffeeBagIllustration roast={product.roast} name={product.name} />
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '20px', fontWeight: 400, color: 'var(--text)',
              lineHeight: 1.1, marginBottom: '3px',
            }}>
              {product.name}
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {product.region}
            </p>
            {/* Roast bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  height: '2px', width: '14px',
                  background: i <= product.roast ? 'var(--accent)' : 'var(--border)',
                  borderRadius: '1px',
                }} />
              ))}
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginLeft: '5px', fontStyle: 'italic' }}>
                {product.roastLabelJa}
              </span>
            </div>
          </div>

          {/* Price + chevron */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '14px', color: 'var(--text)' }}>
              ¥{product.price['100g'].toLocaleString()}〜
            </p>
            <span style={{
              fontSize: '12px', color: 'var(--text-muted)', display: 'inline-block',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.25s',
            }}>▾</span>
          </div>
        </div>
      </button>

      {/* ── Expanded panel ── */}
      <div style={{
        maxHeight: open ? '700px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ paddingBottom: '28px' }}>

          {/* Full bag illustration */}
          <div style={{
            width: '100%', maxWidth: '220px', margin: '0 auto 20px',
            border: '1px solid var(--border-light)',
            borderRadius: '2px', overflow: 'hidden',
            background: 'var(--background)',
          }}>
            <CoffeeBagIllustration roast={product.roast} name={product.name} />
          </div>

          {/* Tasting notes */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {product.notesJa.map(n => (
              <span key={n} style={{
                fontSize: '11px', padding: '3px 8px',
                background: 'var(--surface-container)',
                color: 'var(--text-muted)', borderRadius: '1px',
              }}>
                {n}
              </span>
            ))}
          </div>

          {/* Description */}
          <p style={{
            fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.75,
            textAlign: 'center', padding: '0 8px', marginBottom: '24px',
          }}>
            {product.descriptionJa}
          </p>

          {/* Wheel pickers side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            {/* Weight wheel */}
            <div style={{ borderRight: '1px solid var(--border-light)' }}>
              <p style={{
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em',
                fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)',
                padding: '10px 0 6px',
              }}>
                容量
              </p>
              <WheelPicker<WeightOption>
                options={WEIGHT_OPTIONS.map(w => ({
                  ...w,
                  sublabel: `¥${product.price[w.value].toLocaleString()}`,
                }))}
                value={weight}
                onChange={setWeight}
                itemHeight={46}
                visibleItems={3}
              />
            </div>

            {/* Grind wheel */}
            <div>
              <p style={{
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em',
                fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)',
                padding: '10px 0 6px',
              }}>
                挽き方
              </p>
              <WheelPicker<GrindOption>
                options={grindOptions}
                value={grind}
                onChange={setGrind}
                itemHeight={46}
                visibleItems={3}
              />
            </div>
          </div>

          {/* Quantity + Add button */}
          <div style={{ padding: '20px 0 0', display: 'flex', gap: '10px', alignItems: 'stretch' }}>
            {/* Qty stepper */}
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: '40px', height: '100%', background: 'none',
                  border: 'none', color: 'var(--text-muted)', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >−</button>
              <span style={{
                width: '32px', textAlign: 'center',
                fontSize: '14px', fontWeight: 600, color: 'var(--text)',
              }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: '40px', height: '100%', background: 'none',
                  border: 'none', color: 'var(--text-muted)', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>

            {/* Add to cart */}
            <button onClick={handleAdd} style={{
              flex: 1, padding: '14px',
              background: added ? 'var(--surface-high)' : 'var(--primary)',
              color: added ? 'var(--text)' : 'var(--on-primary)',
              border: 'none', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.12em',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              {added
                ? '✓ カートに追加しました'
                : `カートに追加 — ¥${(product.price[weight] * qty).toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
