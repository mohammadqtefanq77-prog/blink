import React from 'react';

interface JordanFlagProps {
  className?: string;
  width?: number;
  height?: number;
}

export const JordanFlag: React.FC<JordanFlagProps> = ({
  className = 'w-7 h-4 rounded shadow-sm border border-neutral-200 shrink-0',
  width = 60,
  height = 30,
}) => {
  // Exact 7-pointed star coordinates centered at (17, 15) for standard left hoist
  // or at (43, 15) for right hoist. Let's make standard international Jordan flag hoist on left.
  // Stripes: Top Black, Middle White, Bottom Green.
  // Red Chevron on hoist (left): points 0,0  30,15  0,30
  // Center of star in chevron: x=11, y=15. R=3.6, r=1.6
  // 7 points:
  const cx = 11;
  const cy = 15;
  const R = 3.6;
  const r = 1.6;
  const points: string[] = [];

  for (let i = 0; i < 14; i++) {
    const angle = (i * Math.PI) / 7 - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="علم المملكة الأردنية الهاشمية"
    >
      {/* Top Stripe: Black */}
      <rect x="0" y="0" width={width} height="10" fill="#000000" />
      {/* Middle Stripe: White */}
      <rect x="0" y="10" width={width} height="10" fill="#FFFFFF" />
      {/* Bottom Stripe: Green */}
      <rect x="0" y="20" width={width} height="10" fill="#007A3D" />
      {/* Red Triangle Chevron on Left Hoist */}
      <polygon points="0,0 30,15 0,30" fill="#CE1126" />
      {/* White 7-Pointed Star */}
      <polygon points={points.join(' ')} fill="#FFFFFF" />
    </svg>
  );
};
