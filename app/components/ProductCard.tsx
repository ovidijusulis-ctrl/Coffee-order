'use client';

import { useState } from 'react';
import { Product, GRIND_LABELS, WEIGHT_LABELS, GrindOption, WeightOption } from '../lib/products';
import { useCart } from '../lib/cart';

const ROAST_COLORS: Record<string, string> = {
  light: '#d4a853',
  medium: '#8b5e3c',
  dark: '#2c1a0e',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.category === 'beans' ? '250g' : '250g'
  );
  const [selectedGrind, setSelectedGrind] = useState<GrindOption | null>(
    product.grindOptions ? 'whole-bean' : null
  );
  const [added, setAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isMerchandise = product.category === 'merchandise';
  const price = product.price[selectedWeight];

  function handleAdd() {
    addItem({
      product,
      weight: selectedWeight,
      grind: selectedGrind,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--cream)',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          backgroundColor: 'var(--cream-dark)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Coffee bean icon */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <ellipse cx="24" cy="24" rx="16" ry="10" fill={ROAST_COLORS[product.roast] || '#8b5e3c'} opacity="0.3" />
            <ellipse cx="24" cy="24" rx="14" ry="8" stroke={ROAST_COLORS[product.roast]} strokeWidth="1.5" fill="none" />
            <path d="M24 16 Q28 24 24 32" stroke={ROAST_COLORS[product.roast]} strokeWidth="1.5" fill="none" />
          </svg>
          {product.category !== 'merchandise' && (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {product.origin}
            </span>
          )}
        </div>

        {/* Roast badge */}
        {product.category === 'beans' && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '3px 8px',
              backgroundColor: ROAST_COLORS[product.roast],
              borderRadius: '1px',
            }}
          >
            <span style={{ fontSize: '9px', color: 'var(--cream)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {product.roast} roast
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Name & origin */}
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--espresso)',
              fontFamily: 'Georgia, serif',
              marginBottom: '2px',
            }}
          >
            {product.name}
          </h3>
          {product.category === 'beans' && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {product.process} · {product.origin}
            </span>
          )}
        </div>

        {/* Tasting notes */}
        {product.notes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {product.notes.map(note => (
              <span
                key={note}
                style={{
                  fontSize: '10px',
                  padding: '2px 7px',
                  border: '1px solid var(--border)',
                  borderRadius: '1px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                }}
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Expand description */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              overflow: 'hidden',
              maxHeight: expanded ? '200px' : '40px',
              transition: 'max-height 0.3s ease',
            }}
          >
            {product.description}
          </p>
          <span style={{ fontSize: '11px', color: 'var(--brown)', letterSpacing: '0.08em' }}>
            {expanded ? 'Less ↑' : 'More ↓'}
          </span>
        </button>

        <div style={{ flex: 1 }} />

        {/* Weight selector (only for beans) */}
        {!isMerchandise && (
          <div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Size
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['250g', '500g', '1kg'] as WeightOption[]).map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    fontSize: '12px',
                    border: `1px solid ${selectedWeight === w ? 'var(--brown)' : 'var(--border)'}`,
                    backgroundColor: selectedWeight === w ? 'var(--brown)' : 'transparent',
                    color: selectedWeight === w ? 'var(--cream)' : 'var(--text-muted)',
                    borderRadius: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    letterSpacing: '0.05em',
                  }}
                >
                  {WEIGHT_LABELS[w]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grind selector */}
        {product.grindOptions && product.grindOptions.length > 0 && (
          <div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Grind
            </p>
            <select
              value={selectedGrind || ''}
              onChange={e => setSelectedGrind(e.target.value as GrindOption)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                border: '1px solid var(--border)',
                borderRadius: '1px',
                backgroundColor: 'var(--cream)',
                color: 'var(--text)',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b5e3c' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {product.grindOptions.map(g => (
                <option key={g} value={g}>{GRIND_LABELS[g]}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price & Add to cart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <span
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--espresso)',
              fontFamily: 'Georgia, serif',
            }}
          >
            ¥{price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            style={{
              padding: '10px 20px',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backgroundColor: added ? 'var(--brown-dark)' : 'var(--espresso)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: '1px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              minWidth: '110px',
            }}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
