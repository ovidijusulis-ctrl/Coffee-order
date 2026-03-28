'use client';

import { useState, useEffect } from 'react';
import { Product, WeightOption, GrindOption, GRIND_LABELS_JA, GRIND_SUBLABELS_JA } from '../lib/products';
import { useCart } from '../lib/cart';
import WheelPicker from './WheelPicker';

const WEIGHT_OPTIONS: { value: WeightOption; label: string }[] = [
  { value: '100g', label: '100g' },
  { value: '250g', label: '250g' },
  { value: '500g', label: '500g' },
  { value: '1kg',  label: '1kg'  },
];

interface Props {
  open: boolean;
  coffee: Product;
  onClose: () => void;
}

export default function SelectSheet({ open, coffee, onClose }: Props) {
  const { addItem } = useCart();
  const [weight, setWeight] = useState<WeightOption>('100g');
  const [grind,  setGrind]  = useState<GrindOption>('whole-bean');
  const [qty,    setQty]    = useState(1);
  const [added,  setAdded]  = useState(false);

  // Reset when coffee changes
  useEffect(() => {
    setWeight('100g');
    setGrind('whole-bean');
    setQty(1);
    setAdded(false);
  }, [coffee.id]);

  const grindOptions = (coffee.grindOptions ?? []).map(g => ({
    value: g,
    label: GRIND_LABELS_JA[g],
    sublabel: GRIND_SUBLABELS_JA[g],
  }));

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem({ product: coffee, weight, grind, quantity: 1 });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1);
      onClose();
    }, 1400);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.36s cubic-bezier(0.32, 0, 0.67, 0)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: '36px', height: '3px', background: 'var(--border)', borderRadius: '2px' }} />
        </div>

        {/* Coffee name */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          padding: '14px 20px 14px',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '2px',
            }}>
              {coffee.name}
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{coffee.region}</p>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ¥{coffee.price[weight].toLocaleString()}
          </span>
        </div>

        {/* Wheel pickers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <div style={{ borderRight: '1px solid var(--border-light)' }}>
            <p style={{
              fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em',
              fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)',
              padding: '12px 0 6px',
            }}>容量</p>
            <WheelPicker<WeightOption>
              options={WEIGHT_OPTIONS.map(w => ({
                ...w,
                sublabel: `¥${coffee.price[w.value].toLocaleString()}`,
              }))}
              value={weight}
              onChange={setWeight}
              itemHeight={60}
              visibleItems={3}
            />
          </div>
          <div>
            <p style={{
              fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em',
              fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)',
              padding: '12px 0 6px',
            }}>挽き方</p>
            <WheelPicker<GrindOption>
              options={grindOptions}
              value={grind}
              onChange={setGrind}
              itemHeight={60}
              visibleItems={3}
            />
          </div>
        </div>

        {/* Qty + Add */}
        <div style={{ display: 'flex', gap: '10px', padding: '16px 20px 24px', alignItems: 'stretch' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            border: '1px solid var(--border)', flexShrink: 0,
          }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{
                width: '44px', height: '100%', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >−</button>
            <span style={{
              width: '32px', textAlign: 'center', fontSize: '15px',
              fontWeight: 600, color: 'var(--text)',
            }}>{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              style={{
                width: '44px', height: '100%', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >+</button>
          </div>

          <button
            onClick={handleAdd}
            style={{
              flex: 1, padding: '16px',
              background: added ? 'var(--surface-high)' : 'var(--primary)',
              color: added ? 'var(--text)' : 'var(--on-primary)',
              border: 'none', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.12em', cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {added
              ? '✓  追加しました'
              : `カートに追加   ¥${(coffee.price[weight] * qty).toLocaleString()}`
            }
          </button>
        </div>
      </div>
    </>
  );
}
