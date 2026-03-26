'use client';

import { useRef, useEffect, useCallback } from 'react';

interface Option<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  itemHeight?: number;
  visibleItems?: number;
}

export default function WheelPicker<T extends string>({
  options,
  value,
  onChange,
  itemHeight = 48,
  visibleItems = 3,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmaticScroll = useRef(false);

  const totalHeight = itemHeight * visibleItems;
  const paddingY = itemHeight * Math.floor(visibleItems / 2);

  // Scroll to index smoothly
  const scrollToIndex = useCallback((idx: number, smooth = true) => {
    if (!containerRef.current) return;
    programmaticScroll.current = true;
    containerRef.current.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
    // release lock after animation
    setTimeout(() => { programmaticScroll.current = false; }, 400);
  }, [itemHeight]);

  // Sync scroll when value changes externally
  useEffect(() => {
    const idx = options.findIndex(o => o.value === value);
    if (idx >= 0) scrollToIndex(idx, false);
  }, [value, options, scrollToIndex]);

  function handleScroll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!containerRef.current || programmaticScroll.current) return;
      const rawIdx = containerRef.current.scrollTop / itemHeight;
      const idx = Math.round(rawIdx);
      const clamped = Math.max(0, Math.min(options.length - 1, idx));
      scrollToIndex(clamped);
      if (options[clamped]?.value !== value) {
        onChange(options[clamped].value);
      }
    }, 80);
  }

  return (
    <div style={{ position: 'relative', height: totalHeight, userSelect: 'none' }}>
      {/* Gradient fade top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: paddingY,
        background: 'linear-gradient(to bottom, var(--surface-low) 30%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Selection highlight band */}
      <div style={{
        position: 'absolute', top: paddingY, left: 0, right: 0, height: itemHeight,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Gradient fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: paddingY,
        background: 'linear-gradient(to top, var(--surface-low) 30%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Scrollable drum */}
      <div
        ref={containerRef}
        className="wheel-scroll"
        onScroll={handleScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
      >
        {options.map((opt, i) => {
          const selected = opt.value === value;
          return (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); scrollToIndex(i); }}
              style={{
                height: itemHeight,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                scrollSnapAlign: 'center',
                cursor: 'pointer',
                transition: 'opacity 0.15s, transform 0.15s',
                opacity: selected ? 1 : 0.35,
                transform: selected ? 'scale(1)' : 'scale(0.92)',
              }}
            >
              <span style={{
                fontSize: selected ? '15px' : '13px',
                fontWeight: selected ? 700 : 400,
                color: selected ? 'var(--text)' : 'var(--text-muted)',
                letterSpacing: '0.04em',
                transition: 'font-size 0.15s, font-weight 0.15s',
                lineHeight: 1.2,
              }}>
                {opt.label}
              </span>
              {opt.sublabel && (
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  opacity: selected ? 0.65 : 0.3,
                  marginTop: '1px',
                  letterSpacing: '0.03em',
                }}>
                  {opt.sublabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
