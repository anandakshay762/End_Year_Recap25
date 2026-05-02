import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── types ────────────────────────────────────────────────────────────────────
type Word = {
  text: string;
  highlight?: boolean;
};

type Props = {
  words: Word[];
  /** How many frames each word occupies. Default 18 (0.6 s at 30 fps). */
  framesPerWord?: number;
};

// ─── spring config shared for enter & exit ────────────────────────────────────
const SNAP = { stiffness: 600, damping: 14, mass: 0.35 };

export const TextAnimation: React.FC<Props> = ({
  words,
  framesPerWord = 18,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // which word are we on?
  const wordIndex = Math.min(
    Math.floor(frame / framesPerWord),
    words.length - 1
  );
  const frameInWord = frame - wordIndex * framesPerWord;
  const word = words[wordIndex];
  const isLast = wordIndex === words.length - 1;

  // ── enter ─────────────────────────────────────────────────────────────────
  const enter = spring({ frame: frameInWord, fps, config: SNAP });

  // ── exit (starts 9 frames before the word's window ends) ──────────────────
  const EXIT_OFFSET = framesPerWord - 9;
  const rawExit = spring({
    frame: Math.max(0, frameInWord - EXIT_OFFSET),
    fps,
    config: SNAP,
  });
  // suppress exit on the last word so it stays on screen
  const exit = isLast ? 0 : rawExit;

  // ── derived values ────────────────────────────────────────────────────────
  const scaleIn  = interpolate(enter, [0, 1], [0.12, 1]);
  const scaleOut = 1 - interpolate(exit,  [0, 1], [0, 0.38]);
  const scale    = scaleIn * scaleOut;

  const opacityIn  = interpolate(enter, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const opacityOut = 1 - interpolate(exit, [0, 0.65], [0, 1], { extrapolateRight: "clamp" });
  const opacity    = opacityIn * opacityOut;

  // word slides up from below and exits upward
  const slideIn  = interpolate(enter, [0, 1], [100, 0]);
  const slideOut = interpolate(exit,  [0, 1], [0, -80]);
  const translateY = slideIn + slideOut;

  // slight tilt on entry — straightens with spring
  const rotation = interpolate(enter, [0, 0.5], [5, 0], { extrapolateRight: "clamp" });

  // ghost duplicate grows behind for depth
  const ghostScale = interpolate(enter, [0, 1], [0.5, 1.15]);

  // font size adapts to text length
  const isLong   = word.text.length > 7;
  const fontSize = isLong ? 124 : 182;

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
        overflow: "hidden",
      }}
    >
      {/* ── Ghost layer (depth) ── */}
      <div
        style={{
          position: "absolute",
          fontSize: fontSize * 1.7,
          fontWeight: 900,
          fontFamily: "'Impact', 'Arial Black', 'Haettenschweiler', sans-serif",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.035)",
          letterSpacing: -4,
          whiteSpace: "nowrap",
          userSelect: "none",
          transform: `scale(${ghostScale})`,
          pointerEvents: "none",
        }}
      >
        {word.text}
      </div>

      {/* ── Main word ── */}
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotation}deg)`,
          fontSize,
          fontWeight: 900,
          fontFamily: "'Impact', 'Arial Black', 'Haettenschweiler', sans-serif",
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: -2,
          lineHeight: 1.0,
          color: word.highlight ? "#FFE600" : "#FFFFFF",
          textShadow: word.highlight
            ? "0 0 60px rgba(255,230,0,0.55), 0 0 120px rgba(255,200,0,0.25)"
            : "0 4px 40px rgba(255,255,255,0.18)",
        }}
      >
        {word.text}
      </div>
    </AbsoluteFill>
  );
};
