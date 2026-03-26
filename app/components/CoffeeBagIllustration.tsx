// Matte standup pouch illustration, styled after the;kokubo's packaging.
// Roast level shifts the bag tint from warm light to deep espresso.

const ROAST_TINTS: Record<number, { bag: string; stripe: string }> = {
  1: { bag: '#5a4e3c', stripe: '#8a7a62' },   // light — warm tan
  2: { bag: '#4a3d2c', stripe: '#7a6a52' },   // light-med
  3: { bag: '#3a2e20', stripe: '#6a5a40' },   // medium
  4: { bag: '#2a2018', stripe: '#4e3e2c' },   // med-dark
  5: { bag: '#1a1210', stripe: '#382a1e' },   // dark — deep espresso
};

export default function CoffeeBagIllustration({ roast, name }: { roast: 1|2|3|4|5; name: string }) {
  const { bag, stripe } = ROAST_TINTS[roast];

  return (
    <svg
      viewBox="0 0 280 210"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}
      aria-label={`${name} coffee bag`}
    >
      {/* Background */}
      <rect width="280" height="210" fill="var(--background)" />

      {/* Subtle texture grid */}
      <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M14 0 L0 0 0 14" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
      </pattern>
      <rect width="280" height="210" fill="url(#grid)" />

      {/* Bag shadow */}
      <ellipse cx="140" cy="196" rx="58" ry="6" fill="rgba(0,0,0,0.35)" />

      {/* Bag body */}
      <rect x="82" y="38" width="116" height="152" rx="6" fill={bag} />

      {/* Bag sheen — left edge highlight */}
      <rect x="82" y="38" width="10" height="152" rx="3" fill="rgba(255,255,255,0.06)" />

      {/* Bag sheen — right edge shadow */}
      <rect x="188" y="38" width="10" height="152" rx="3" fill="rgba(0,0,0,0.15)" />

      {/* Gusset fold line */}
      <line x1="82" y1="100" x2="198" y2="100" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

      {/* Center label area */}
      <rect x="98" y="70" width="84" height="88" rx="2" fill="rgba(0,0,0,0.18)" />

      {/* the;kokubo circle mark */}
      <circle cx="140" cy="99" r="22" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
      <circle cx="140" cy="99" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      {/* Cross lines inside circle */}
      <line x1="124" y1="99" x2="156" y2="99" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <line x1="140" y1="83" x2="140" y2="115" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

      {/* Origin name */}
      <text
        x="140" y="136"
        textAnchor="middle"
        fill="rgba(255,255,255,0.65)"
        fontSize="9"
        letterSpacing="3"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
      >
        {name.toUpperCase()}
      </text>

      {/* Zip seal at top */}
      <rect x="86" y="34" width="108" height="8" rx="2" fill={stripe} />
      <rect x="86" y="36" width="108" height="2" fill="rgba(255,255,255,0.08)" />

      {/* Notch cut */}
      <rect x="178" y="28" width="6" height="12" rx="1" fill="var(--background)" />

      {/* Valve circle */}
      <circle cx="152" cy="58" r="5" fill="rgba(0,0,0,0.25)" />
      <circle cx="152" cy="58" r="3" fill="rgba(255,255,255,0.07)" />
      <circle cx="152" cy="58" r="1" fill="rgba(255,255,255,0.1)" />

      {/* Roast level dots bottom */}
      {[1,2,3,4,5].map(i => (
        <circle
          key={i}
          cx={116 + (i - 1) * 12}
          cy="148"
          r="2.5"
          fill={i <= roast ? 'rgba(200,185,154,0.75)' : 'rgba(255,255,255,0.12)'}
        />
      ))}
    </svg>
  );
}
