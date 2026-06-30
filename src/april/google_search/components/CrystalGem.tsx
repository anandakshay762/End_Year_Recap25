import React from "react";
import { interpolate } from "remotion";
import { fontFamily } from "../fonts";
import { clamp01 } from "../animations";

interface CrystalGemProps {
  width: number;
  topPct: string;
  localFrame: number;
}

const heptPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 7 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

// Inner facet lines from center to each vertex
const FacetLines = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <>
    {Array.from({ length: 7 }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
      return (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={(cx + r * Math.cos(a)).toFixed(1)}
          y2={(cy + r * Math.sin(a)).toFixed(1)}
          stroke="rgba(165,180,252,0.4)" strokeWidth={1.5}
        />
      );
    })}
    {/* Horizontal cut lines */}
    <line x1={cx - r * 0.6} y1={cy - r * 0.35} x2={cx + r * 0.6} y2={cy - r * 0.35} stroke="rgba(165,180,252,0.3)" strokeWidth={1}/>
    <line x1={cx - r * 0.8} y1={cy} x2={cx + r * 0.8} y2={cy} stroke="rgba(165,180,252,0.25)" strokeWidth={1}/>
    <line x1={cx - r * 0.5} y1={cy + r * 0.4} x2={cx + r * 0.5} y2={cy + r * 0.4} stroke="rgba(165,180,252,0.25)" strokeWidth={1}/>
  </>
);

const Crown = ({ cx, y }: { cx: number; y: number }) => (
  <path
    d={`M${cx - 36},${y} L${cx - 36},${y - 36} L${cx - 18},${y - 22} L${cx},${y - 52} L${cx + 18},${y - 22} L${cx + 36},${y - 36} L${cx + 36},${y} Z`}
    fill="#FBBF24" stroke="#F59E0B" strokeWidth={2}
  />
);

const LaurelBranch = ({ cx, cy, side }: { cx: number; cy: number; side: "left" | "right" }) => {
  const s = side === "left" ? -1 : 1;
  const leaves = [0, 1, 2, 3];
  return (
    <>
      {leaves.map(i => {
        const x = cx + s * (20 + i * 22);
        const y = cy + (i % 2 === 0 ? -8 : 4);
        return (
          <ellipse
            key={i}
            cx={x} cy={y}
            rx={12} ry={7}
            fill="#16A34A"
            transform={`rotate(${s * (i * 15 - 20)} ${x} ${y})`}
            opacity={0.9}
          />
        );
      })}
      <line x1={cx} y1={cy} x2={cx + s * 110} y2={cy + 10} stroke="#15803D" strokeWidth={2}/>
    </>
  );
};

const FloatingDiamond = ({ x, y, size, color, localFrame, phase }: {
  x: number; y: number; size: number; color: string; localFrame: number; phase: number;
}) => {
  const floatY = 6 * Math.sin((localFrame / 90) * 2 * Math.PI + phase);
  return (
    <polygon
      points={`${x},${y - size + floatY} ${x + size},${y + floatY} ${x},${y + size + floatY} ${x - size},${y + floatY}`}
      fill={color} opacity={0.85}
    />
  );
};

export const CrystalGem: React.FC<CrystalGemProps> = ({ width, topPct, localFrame }) => {
  const VB_W = 420;
  const VB_H = 500;
  const cx = 210, cy = 210;
  const outerR = 178, innerR = 148;

  // Shimmer sweep: 0-50 frames
  const shimmerX = interpolate(localFrame, [0, 50], [-300, 700], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Scale animation for gem
  const gemScale = interpolate(localFrame, [0, 40], [0.8, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const outerPts = heptPoints(cx, cy, outerR);
  const innerPts = heptPoints(cx, cy, innerR);

  const height = (width * VB_H) / VB_W;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="gemBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#3730A3"/>
          <stop offset="100%" stopColor="#1E1B4B"/>
        </radialGradient>
        <linearGradient id="gemStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8"/>
          <stop offset="100%" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="shimmer" gradientUnits="userSpaceOnUse"
          x1={shimmerX - 80} x2={shimmerX} y1={0} y2={0}>
          <stop offset="0%" stopColor="white" stopOpacity={0}/>
          <stop offset="50%" stopColor="white" stopOpacity={0.3}/>
          <stop offset="100%" stopColor="white" stopOpacity={0}/>
        </linearGradient>
        <filter id="gemGlow">
          <feGaussianBlur stdDeviation="10" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <clipPath id="gemClip">
          <polygon points={outerPts}/>
        </clipPath>
      </defs>

      {/* Background glow */}
      <ellipse cx={cx} cy={cy} rx={outerR + 30} ry={outerR + 30}
        fill="url(#gemBg)" opacity={0.6} filter="url(#gemGlow)"/>

      {/* Floating diamonds */}
      <g style={{ transform: `scale(${gemScale})`, transformOrigin: `${cx}px ${cy}px` }}>
        <FloatingDiamond x={55}  y={80}  size={14} color="#FBBF24" localFrame={localFrame} phase={0}/>
        <FloatingDiamond x={365} y={70}  size={11} color="#A78BFA" localFrame={localFrame} phase={1.2}/>
        <FloatingDiamond x={40}  y={280} size={10} color="#FBBF24" localFrame={localFrame} phase={2.1}/>
        <FloatingDiamond x={380} y={260} size={13} color="#A78BFA" localFrame={localFrame} phase={0.7}/>
        <FloatingDiamond x={100} y={50}  size={8}  color="#F59E0B" localFrame={localFrame} phase={1.8}/>
        <FloatingDiamond x={320} y={380} size={9}  color="#8B5CF6" localFrame={localFrame} phase={0.4}/>
        <FloatingDiamond x={60}  y={380} size={7}  color="#FCD34D" localFrame={localFrame} phase={2.5}/>
        <FloatingDiamond x={370} y={370} size={8}  color="#C4B5FD" localFrame={localFrame} phase={1.5}/>

        {/* Outer heptagon (glassy) */}
        <polygon points={outerPts}
          fill="rgba(129,140,248,0.15)"
          stroke="url(#gemStroke)" strokeWidth={2.5}/>

        {/* Inner heptagon */}
        <polygon points={innerPts}
          fill="rgba(99,102,241,0.25)"
          stroke="rgba(165,180,252,0.6)" strokeWidth={1.5}/>

        {/* Facet lines */}
        <FacetLines cx={cx} cy={cy} r={outerR}/>

        {/* Shimmer sweep */}
        <rect x={shimmerX - 80} y={cy - outerR} width={80} height={outerR * 2}
          fill="url(#shimmer)" clipPath="url(#gemClip)" opacity={0.7}/>

        {/* Crown */}
        <Crown cx={cx} y={cy - outerR + 10}/>

        {/* Laurel branches around center */}
        <LaurelBranch cx={cx - 20} cy={cy + 40} side="left"/>
        <LaurelBranch cx={cx + 20} cy={cy + 40} side="right"/>

        {/* Gold star between laurel branches */}
        <text x={cx} y={cy + 52} textAnchor="middle"
          fontFamily={fontFamily} fontSize={28} fill="#FBBF24">★</text>

        {/* Center text */}
        <text x={cx} y={cy - 44}
          textAnchor="middle" fontFamily={fontFamily} fontSize={34}
          fontWeight={800} fill="#FBBF24" letterSpacing={4}>TOP</text>
        <text x={cx} y={cy + 14}
          textAnchor="middle" fontFamily={fontFamily} fontSize={80}
          fontWeight={800} fill="#4338CA" letterSpacing={-2}>{topPct}</text>
        <text x={cx} y={cy + 50}
          textAnchor="middle" fontFamily={fontFamily} fontSize={22}
          fontWeight={800} fill="#FBBF24" letterSpacing={8}>ON TOPMATE</text>

        {/* Podium base */}
        <rect x={cx - 160} y={cy + outerR - 20} width={320} height={72}
          rx={12} fill="#312E81"/>
        <text x={cx} y={cy + outerR + 26}
          textAnchor="middle" fontFamily={fontFamily} fontSize={26}
          fontWeight={800} fill="#FBBF24" letterSpacing={8}>LEGEND TIER</text>
      </g>
    </svg>
  );
};
