'use client';

import { useState, useRef, useEffect } from 'react';
import { Product, GrindOption, WeightOption, GRIND_LABELS_JA, GRIND_SUBLABELS_JA } from '../lib/products';
import { useCart } from '../lib/cart';
import WheelPicker from './WheelPicker';
import FlavorChart from './FlavorChart';

const WEIGHT_OPTIONS: { value: WeightOption; label: string }[] = [
  { value: '100g', label: '100g' },
  { value: '250g', label: '250g' },
  { value: '500g', label: '500g' },
  { value: '1kg',  label: '1kg'  },
];

interface Props {
  product: Product;
  index: number;
  onFocus: (id: string) => void;
  focused: boolean;
}

export default function ProductCard({ product, index, onFocus, focused }: Props) {
  const { addItem } = useCart();
  const cardRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<WeightOption>('100g');
  const [grind, setGrind] = useState<GrindOption>('whole-bean');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onFocus(product.id); },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [product.id, onFocus]);

  useEffect(() => {
    if (!focused) setOpen(false);
  }, [focused]);

  const grindOptions = (product.grindOptions ?? []).map(g => ({
    value: g, label: GRIND_LABELS_JA[g], sublabel: GRIND_SUBLABELS_JA[g],
  }));

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem({ product, weight, grind, quantity: 1 });
    setAdded(true);
    setTimeout(() => { setAdded(false); setOpen(false); setQty(1); }, 1500);
  }

  /* ─── Unfocused: compact row ─── */
  if (!focused && !open) {
    return (
      <article
        ref={cardRef}
        className="product-card-snap"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <button
          onClick={() => onFocus(product.id)}
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0' }}
        >
          <div style={{
            display: 'flex', gap: '14px', padding: '16px 0',
            alignItems: 'center', opacity: 0.45, transition: 'opacity 0.3s',
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '11px', color: 'var(--text-muted)', minWidth: '20px',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Mini chart placeholder */}
            <div style={{
              width: '44px', height: '44px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.6,
            }}>
              <FlavorChart flavor={product.flavor} size={44} />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: '17px', fontWeight: 400, color: 'var(--text)', marginBottom: '2px',
              }}>
                {product.name}
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.region}</p>
            </div>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '13px',
              color: 'var(--text-muted)', flexShrink: 0,
            }}>
              ¥{product.price['100g'].toLocaleString()}〜
            </p>
          </div>
        </button>
      </article>
    );
  }

  /* ─── Focused or open: featured card with ripple rings ─── */
  return (
    <article
      ref={cardRef}
      className="product-card-snap"
      style={{
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--surface-low)',
        transition: 'background 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Tap header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '24px 0 0' }}
      >
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px' }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '11px', color: 'var(--accent)', minWidth: '20px',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: '28px', fontWeight: 400, color: 'var(--text)',
            flex: 1, letterSpacing: '0.01em',
          }}>
            {product.name}
          </h2>
          <span style={{
            fontSize: '13px', color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s',
            display: 'inline-block', lineHeight: 1,
          }}>▾</span>
        </div>

        {/* Flavor chart hero with ripple rings */}
        {!open && (
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '220px', marginBottom: '16px',
          }}>
            {/* Ripple rings behind chart */}
            <div style={{
              position: 'absolute',
              width: '140px', height: '140px',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <div className="ripple-ring" style={{ width: '100%', height: '100%', top: 0, left: 0 }} />
              <div className="ripple-ring" style={{ width: '100%', height: '100%', top: 0, left: 0 }} />
              <div className="ripple-ring" style={{ width: '100%', height: '100%', top: 0, left: 0 }} />
            </div>

            {/* Chart */}
            <div style={{ position: 'relative', zIndex: 3 }}>
              <FlavorChart flavor={product.flavor} size={180} animated />
            </div>
          </div>
        )}

        {/* Meta */}
        <div style={{ paddingBottom: open ? '0' : '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {product.region} · {product.processJa}
            </span>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  height: '2px', width: '14px',
                  background: i <= product.roast ? 'var(--accent)' : 'var(--border)',
                  borderRadius: '1px',
                }} />
              ))}
              <span style={{
                fontSize: '9px', color: 'var(--accent)',
                marginLeft: '4px', fontStyle: 'italic',
              }}>{product.roastLabelJa}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {product.notesJa.map(n => (
              <span key={n} style={{
                fontSize: '11px', padding: '3px 8px',
                background: 'var(--surface-container)', color: 'var(--text-muted)',
              }}>
                {n}
              </span>
            ))}
          </div>

          {!open && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {product.descriptionJa}
            </p>
          )}
        </div>

        {!open && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 18px' }}>
            <span style={{
              fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--accent)', borderBottom: '1px solid var(--accent)', paddingBottom: '2px',
            }}>
              タップして選ぶ
            </span>
          </div>
        )}
      </button>

      {/* ── Wheel pickers (open state) ── */}
      <div style={{
        maxHeight: open ? '600px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ paddingBottom: '28px', paddingTop: '8px' }}>

          {/* Compact chart in open state */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', opacity: 0.7 }}>
            <FlavorChart flavor={product.flavor} size={100} />
          </div>

          {/* Wheels side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
            <div style={{ borderRight: '1px solid var(--border-light)' }}>
              <p style={{
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em',
                fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)', padding: '12px 0 8px',
              }}>
                容量
              </p>
              <WheelPicker<WeightOption>
                options={WEIGHT_OPTIONS.map(w => ({ ...w, sublabel: `¥${product.price[w.value].toLocaleString()}` }))}
                value={weight}
                onChange={setWeight}
                itemHeight={60}
                visibleItems={3}
              />
            </div>
            <div>
              <p style={{
                fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em',
                fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)', padding: '12px 0 8px',
              }}>
                挽き方
              </p>
              <WheelPicker<GrindOption>
                options={grindOptions}
                value={grind}
                onChange={setGrind}
                itemHeight={60}
                visibleItems={3}
              />
            </div>
          </div>

          {/* Qty + Add button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', flexShrink: 0 }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ width: '48px', height: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >−</button>
              <span style={{ width: '36px', textAlign: 'center', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{ width: '48px', height: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >+</button>
            </div>

            <button onClick={handleAdd} style={{
              flex: 1, padding: '16px',
              background: added ? 'var(--surface-high)' : 'var(--primary)',
              color: added ? 'var(--text)' : 'var(--on-primary)',
              border: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              {added ? '✓ カートに追加しました' : `カートに追加 — ¥${(product.price[weight] * qty).toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
