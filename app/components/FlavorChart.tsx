'use client';

import { FlavorProfile, FLAVOR_AXES } from '../lib/products';

interface Props {
  flavor: FlavorProfile;
  size?: number;
  animated?: boolean;
}

export default function FlavorChart({ flavor, size = 160, animated = false }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = FLAVOR_AXES.length;

  // Compute polygon points for a given radius ratio (0–1)
  function hexPoints(ratios: number[]): string {
    return ratios
      .map((r, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + maxR * r * Math.cos(angle);
        const y = cy + maxR * r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  }

  // Grid rings at 20%, 40%, 60%, 80%, 100%
  const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Axis endpoints
  const axes = FLAVOR_AXES.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + maxR * Math.cos(angle),
      y: cy + maxR * Math.sin(angle),
    };
  });

  // Value polygon (max value = 5)
  const valueRatios = FLAVOR_AXES.map(({ key }) => flavor[key] / 5);
  const valuePoly = hexPoints(valueRatios);

  // Label positions slightly outside max ring
  const labelR = maxR * 1.28;
  const labels = FLAVOR_AXES.map(({ label }, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      label,
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Grid rings */}
      {gridRings.map((r, ri) => (
        <polygon
          key={ri}
          points={hexPoints(Array(n).fill(r))}
          fill="none"
          stroke="var(--border)"
          strokeWidth={0.5}
          opacity={0.6}
        />
      ))}

      {/* Axis spokes */}
      {axes.map((pt, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={pt.x} y2={pt.y}
          stroke="var(--border)"
          strokeWidth={0.5}
          opacity={0.5}
        />
      ))}

      {/* Value fill */}
      <polygon
        points={valuePoly}
        fill="var(--rust)"
        fillOpacity={0.18}
        stroke="var(--rust)"
        strokeWidth={1.2}
        strokeOpacity={0.7}
        style={animated ? { transition: 'all 0.5s ease' } : undefined}
      />

      {/* Value dots */}
      {valueRatios.map((r, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + maxR * r * Math.cos(angle);
        const y = cy + maxR * r * Math.sin(angle);
        return (
          <circle key={i} cx={x} cy={y} r={2} fill="var(--rust)" opacity={0.9} />
        );
      })}

      {/* Labels */}
      {labels.map(({ label, x, y }, i) => {
        let anchor: 'start' | 'middle' | 'end' = 'middle';
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const cos = Math.cos(angle);
        if (cos > 0.2) anchor = 'start';
        else if (cos < -0.2) anchor = 'end';

        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize={size * 0.07}
            fill="var(--text-muted)"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.02em"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
