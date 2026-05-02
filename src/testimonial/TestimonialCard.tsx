import React from "react";
import { interpolate, interpolateColors, spring, useVideoConfig } from "remotion";
import { StarRating } from "./StarRating";
import { FlowerAvatar } from "./FlowerAvatar";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface Testimonial {
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  text: string;
}

type Props = {
  testimonial: Testimonial;
  index: number;
  active: boolean;
  wasActive: boolean;
  frameInSegment: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR colours — deterministic per name initial
// ─────────────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#7C3AED", "#2563EB", "#059669", "#DC2626",
  "#D97706", "#0891B2", "#9333EA",
];

function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// SPRING CONFIG  (matches spec: stiffness 100, damping 15)
// ─────────────────────────────────────────────────────────────────────────────
const SPRING_CFG = { stiffness: 100, damping: 15 } as const;

// ── Dynamic font scaling ─────────────────────────────────────────────────────
const MAX_FONT = 32;
const MIN_FONT = 22;
// 85% of 1080px frame — hard ceiling so the card never clips
const MAX_CARD_HEIGHT = 918;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const TestimonialCard: React.FC<Props> = ({
  testimonial,
  index,
  active,
  wasActive,
  frameInSegment,
}) => {
  const { fps } = useVideoConfig();

  // One spring drives both the entering and the exiting card.
  const springVal = spring({ frame: frameInSegment, fps, config: SPRING_CFG });

  // `progress` = 0 → fully inactive style, 1 → fully active style
  const progress: number = active
    ? springVal          // 0 → 1  (card pops into focus)
    : wasActive
    ? 1 - springVal      // 1 → 0  (card retreats to background)
    : 0;                 // stable inactive

  // ── Animated transforms ──────────────────────────────────────────────────
  const scale = interpolate(progress, [0, 1], [0.92, 1.04]);
  const opacity = interpolate(progress, [0, 1], [0.3, 1.0]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  // ── Background & Border for ACTIVE only ─────────────────────────────────
  // INACTIVE: transparent background, NO border, NO box
  // ACTIVE: solid white background with border
  const cardBg = active
    ? interpolateColors(progress, [0, 1], ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.98)"])
    : "transparent";

  const cardBorder = active
    ? interpolateColors(progress, [0, 1], ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.4)"])
    : "transparent";

  // ── Text colors ─────────────────────────────────────────────────────────
  const nameFg = active
    ? interpolateColors(progress, [0, 1], ["rgba(255,255,255,0.90)", "rgba(17,24,39,1)"])
    : "rgba(255,255,255,0.85)";

  const bodyFg = active
    ? interpolateColors(progress, [0, 1], ["rgba(255,255,255,0.55)", "rgba(55,65,81,1)"])
    : "rgba(255,255,255,0.6)";

  // ── Shadow for ACTIVE only ──────────────────────────────────────────────
  const shadowAlpha = active ? interpolate(progress, [0, 1], [0, 0.35]) : 0;

  const charCount = testimonial.text.length;
  const fontScale = Math.min(charCount / 1800, 1);
  const bodyFontSize = MAX_FONT - (MAX_FONT - MIN_FONT) * fontScale;
  const bodyLineHeight = 1.6 - 0.2 * fontScale;
  const cardPadding = charCount > 1200 ? "20px 24px" : "28px 32px";
  const textMaxWidth = charCount > 1200 ? "94%" : "85%";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        fontFamily: "sans-serif",
        // ACTIVE: rounded card with background
        // INACTIVE: NO background, NO border, NO box
        background: cardBg,
        border: active ? `1px solid ${cardBorder}` : "none",
        borderRadius: active ? 28 : 0,
        backdropFilter: active ? "blur(20px)" : "none",

        // Consistent padding
        padding: cardPadding,

        // Containment — never taller than the frame
        maxHeight: MAX_CARD_HEIGHT,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",

        // Animation
        transform: `translateY(${translateY}px) scale(${scale}) translateZ(0)`,
        opacity,
        filter: active ? "none" : "blur(1px)",

        // ACTIVE ONLY: strong shadow
        boxShadow: active
          ? `0 24px 64px rgba(0,0,0,${shadowAlpha}),
             0 8px 16px rgba(0,0,0,${shadowAlpha * 0.5}),
             0 0 40px rgba(124, 58, 237, ${shadowAlpha * 0.2})`
          : "none",

        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── Header Row: [Avatar] [Name] ----------- [Stars] ─────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        {/* Left: Avatar + Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Avatar */}
          <div
            style={{
              flexShrink: 0,
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: active
                ? "0 4px 12px rgba(0, 0, 0, 0.25)"
                : "none",
            }}
          >
            <FlowerAvatar index={index} size={80} />
          </div>

          {/* Name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1.25,
                color: nameFg,
                margin: 0,
              }}
            >
              {testimonial.name}
            </p>
          </div>
        </div>

        {/* Right: Stars - aligned with name baseline */}
        <div style={{ flexShrink: 0 }}>
          <StarRating rating={testimonial.rating} active={active} />
        </div>
      </div>

      {/* ── Testimonial Text — smooth font scaling based on char count ── */}
      <div
        style={{
          position: "relative",
          flex: "1 1 auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontSize: bodyFontSize,
            lineHeight: bodyLineHeight,
            color: bodyFg,
            margin: 0,
            maxWidth: textMaxWidth,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          &ldquo;{testimonial.text}&rdquo;
        </p>

      </div>
    </div>
  );
};
