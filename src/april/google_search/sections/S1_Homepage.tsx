import React from "react";
import { interpolate, Img, staticFile } from "remotion";
import { fontFamily } from "../fonts";
import { CompositionProps } from "../../schema";

const W = 1080;
const H = 1920;

const EX = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], EX);

const C = {
  tp: "#202124", ts: "#5F6368",
  blue: "#4285F4",
  red: "#EA4335",
  border: "#DFE1E5",
  bg: "#FFFFFF", bgGray: "#F8F9FA",
} as const;

const QUERY = "My April Month Recap '26";

const MagnifyingGlass: React.FC<{ size?: number; color?: string }> = ({ size = 36, color = C.ts }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill={color} d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const MicSVG: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill={C.blue} d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.87 6.43 6.5 6.93V21h1v-3.07C16.13 17.43 19 14.53 19 11h-2z"/>
  </svg>
);

const LensSVG: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill={C.red} d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zM19 13h-1.5v1.5H19V13z"/>
  </svg>
);

interface S1Props { frame: number; p: CompositionProps }

export const S1_Homepage: React.FC<S1Props> = ({ frame }) => {
  const typingEnd = 55; // typing completes at frame 55, ~15-frame pause before transition at 70

  const logoOpacity   = lerp(frame, 0, 18);
  const charsVisible  = Math.floor(interpolate(frame, [10, typingEnd], [0, QUERY.length], EX));
  const displayText   = QUERY.slice(0, charsVisible);
  const typingDone    = charsVisible >= QUERY.length;
  const cursorVisible = Math.floor(frame / 18) % 2 === 0;
  const showDropdown  = charsVisible >= 3;

  const focused = typingDone;
  const shakeX = frame >= 56 && frame <= 62
    ? interpolate(frame, [56, 57, 58, 59, 60, 61, 62], [0, 7, -7, 5, -4, 2, 0], EX)
    : 0;

  // Fade out as composition scrolls away (frames 100–120)
  const screenOp = interpolate(frame, [100, 120], [1, 0], EX);

  const suggestions = [
    QUERY,
    "My April recap topmate",
    "topmate April 2026 recap",
  ];

  return (
    <div style={{
      position: "absolute", top: 0, left: 0,
      width: W, height: H, background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      overflow: "hidden", opacity: screenOp,
    }}>
      {/* Google logo */}
      <div style={{ marginTop: 440, opacity: logoOpacity }}>
        <Img src={staticFile("Google_2015_logo.svg")} style={{ width: 480, height: "auto" }}/>
      </div>

      {/* Search bar + dropdown */}
      <div style={{ position: "relative", marginTop: 60, width: 940, transform: `translateX(${shakeX}px)` }}>
        <div style={{
          background: C.bg,
          border: `${focused ? 2 : 1}px solid ${focused ? C.blue : C.border}`,
          borderRadius: showDropdown ? "65px 65px 0 0" : 65,
          height: 130,
          display: "flex", alignItems: "center",
          padding: "0 40px", gap: 24,
          boxShadow: focused
            ? "0 1px 6px rgba(32,33,36,0.28), 0 0 0 3px rgba(66,133,244,0.2)"
            : "0 1px 6px rgba(32,33,36,0.28)",
        }}>
          <MagnifyingGlass size={40}/>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily, fontSize: 38, fontWeight: 400, color: C.tp }}>{displayText}</span>
            {!typingDone && (
              <div style={{ width: 3, height: 46, background: C.tp, opacity: cursorVisible ? 1 : 0, marginLeft: 2 }}/>
            )}
          </div>
          {charsVisible > 0 && <span style={{ fontSize: 34, color: C.ts }}>✕</span>}
          <div style={{ width: 1, height: 52, background: C.border }}/>
          <MicSVG size={38}/><LensSVG size={38}/>
        </div>

        {showDropdown && (
          <div style={{
            background: C.bg,
            borderRadius: "0 0 40px 40px",
            border: `1px solid ${C.border}`,
            borderTop: "none",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          }}>
            {suggestions.map((s, i) => (
              <div key={i} style={{
                height: 104, padding: "0 40px",
                display: "flex", alignItems: "center", gap: 28,
                background: i === 0 && typingDone ? C.bgGray : "transparent",
                borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
              }}>
                <MagnifyingGlass size={28} color={C.ts}/>
                <span style={{ fontFamily, fontSize: 30, color: C.tp }}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Search + I'm Feeling Lucky */}
      <div style={{ display: "flex", gap: 20, marginTop: 44, opacity: lerp(frame, 6, 22) }}>
        {["Google Search", "I'm Feeling Lucky"].map(label => (
          <div key={label} style={{
            borderRadius: 8, background: C.bgGray,
            border: `1px solid ${C.bgGray}`,
            padding: "20px 44px",
            fontSize: 28, fontFamily, color: C.tp, fontWeight: 500,
          }}>{label}</div>
        ))}
      </div>
    </div>
  );
};
