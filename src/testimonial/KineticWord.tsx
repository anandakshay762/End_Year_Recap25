import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTER_F, EXIT_F, HOLD_F } from "./lib/timing";

// ─────────────────────────────────────────────────────────────────────────────
// SPRING CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SPRING_CFG = { stiffness: 800, damping: 18, mass: 0.35 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLE TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const FONT_FAMILY =
  "'Impact', 'Arial Black', 'Haettenschweiler', 'Franklin Gothic Heavy', sans-serif";

const COLOR_REGULAR = "#FFFFFF";
const COLOR_FOCUS   = "#FFE600"; // electric yellow

const FONT_REGULAR = 130; // px
const FONT_FOCUS   = 200; // px  (focus words hit harder)

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────
type Props = {
  text: string;
  isFocus: boolean;
  /**
   * Total frames of the enclosing <Sequence>.
   */
  sequenceDuration: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const KineticWord: React.FC<Props> = ({
  text,
  isFocus,
  sequenceDuration,
}) => {
  const frame = useCurrentFrame(); // local time, courtesy of <Sequence>
  const { fps } = useVideoConfig();

  // ── ENTER spring ─────────────────────────────────────────────────────────
  const enterSpring = spring({
    frame,
    fps,
    config: SPRING_CFG,
    durationInFrames: ENTER_F,
  });

  // ── EXIT spring ───────────────────────────────────────────────────────────
  const exitStart = isFocus
    ? sequenceDuration - EXIT_F - 2
    : ENTER_F + HOLD_F;

  const exitSpring = spring({
    frame: Math.max(0, frame - exitStart),
    fps,
    config: SPRING_CFG,
    durationInFrames: EXIT_F,
  });

  // ── DERIVED VALUES ────────────────────────────────────────────────────────
  const scaleEnter = interpolate(enterSpring, [0, 1], [isFocus ? 0.45 : 0.05, 1], {
    extrapolateRight: "clamp",
  });
  const scaleExit = interpolate(exitSpring, [0, 1], [1, isFocus ? 1.08 : 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = scaleEnter * scaleExit;

  const opacityEnter = interpolate(enterSpring, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacityExit = interpolate(exitSpring, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = opacityEnter * opacityExit;

  const translateY =
    interpolate(enterSpring, [0, 1], [isFocus ? 70 : 44, 0], {
      extrapolateRight: "clamp",
    }) +
    interpolate(exitSpring, [0, 1], [0, isFocus ? -60 : -36], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const rotate = interpolate(enterSpring, [0, 0.6], [isFocus ? -4 : -3, 0], {
    extrapolateRight: "clamp",
  });

  // ── STYLES ────────────────────────────────────────────────────────────────
  const fontSize = isFocus ? FONT_FOCUS : FONT_REGULAR;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
        zIndex: isFocus ? 1 : 2,
        pointerEvents: "none",
      }}
    >
      {/* ── Ghost / depth layer ── */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          fontSize: fontSize * 1.75,
          fontWeight: 900,
          fontFamily: FONT_FAMILY,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.025)",
          letterSpacing: -4,
          textAlign: "center",
          lineHeight: 1,
          userSelect: "none",
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.6, 1.12], {
            extrapolateRight: "clamp",
          })})`,
          opacity: opacityEnter * 0.7,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>

      {/* ── Main word ── */}
      <span
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotate}deg)`,
          fontSize,
          fontWeight: 900,
          fontFamily: FONT_FAMILY,
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: isFocus ? -4 : -2,
          lineHeight: 1,
          color: isFocus ? COLOR_FOCUS : COLOR_REGULAR,
          textShadow: isFocus
            ? `0 0 80px rgba(255,230,0,0.55), 0 0 160px rgba(255,200,0,0.25)`
            : `0 2px 32px rgba(255,255,255,0.15)`,
          willChange: "transform, opacity",
        }}
      >
        {text}
      </span>
    </div>
  );
};
