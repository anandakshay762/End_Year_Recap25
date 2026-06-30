import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { fontFamily } from "../fonts";

const W = 1080;
const CHROME_H = 180;

// Transition windows (start, end) — progress bar animates across each
const TRANSITIONS = [
  [100, 120], [220, 240], [340, 360], [460, 480], [580, 600],
  [700, 720], [820, 840], [940, 960], [1060, 1080],
] as const;

const SignalIcon = () => (
  <svg viewBox="0 0 20 16" width={26} height={22}>
    <rect x={0}  y={11} width={4} height={5}  rx={1} fill="#202124"/>
    <rect x={5}  y={8}  width={4} height={8}  rx={1} fill="#202124"/>
    <rect x={10} y={4}  width={4} height={12} rx={1} fill="#202124"/>
    <rect x={15} y={0}  width={4} height={16} rx={1} fill="#202124"/>
  </svg>
);
const WifiIcon = () => (
  <svg viewBox="0 0 24 24" width={26} height={26}>
    <path fill="none" stroke="#202124" strokeWidth={2} strokeLinecap="round" d="M1.5 8.5C5.5 4.5 10.5 3 12 3s6.5 1.5 10.5 5.5"/>
    <path fill="none" stroke="#202124" strokeWidth={2} strokeLinecap="round" d="M4.5 11.5C7 9 10 8 12 8s5 1 7.5 3.5"/>
    <path fill="none" stroke="#202124" strokeWidth={2} strokeLinecap="round" d="M7.5 14.5C9 13 10.5 12.5 12 12.5s3 .5 4.5 2"/>
    <circle cx={12} cy={18} r={1.5} fill="#202124"/>
  </svg>
);
const BatteryIcon = () => (
  <svg viewBox="0 0 28 14" width={34} height={18}>
    <rect x={0}    y={1}   width={24} height={12} rx={2} fill="none" stroke="#202124" strokeWidth={1.5}/>
    <rect x={24.5} y={4}   width={3}  height={6}  rx={1} fill="#202124"/>
    <rect x={1.5}  y={2.5} width={18} height={9}  rx={1} fill="#202124"/>
  </svg>
);

interface ChromeProps {
  frame: number;
  userName: string;
  timeLabel: string;
}

export const PersistentChrome: React.FC<ChromeProps> = ({ frame, userName, timeLabel }) => {
  const query = `${userName.toLowerCase().replace(/\s+/g, "+")}+topmate+april+recap`;

  // Hidden during S1, fades in as S3 enters
  const opacity = interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Progress bar state
  let progressWidth = "0%";
  let progressOp = 0;
  for (const [start, end] of TRANSITIONS) {
    if (frame >= start && frame <= end + 12) {
      progressWidth = `${interpolate(frame, [start, end], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`;
      progressOp = interpolate(frame, [end, end + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      break;
    }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, zIndex: 100 }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: W, height: CHROME_H, background: "#fff", zIndex: 100 }}>
        {/* Status bar */}
        <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: "#fff" }}>
          <span style={{ fontFamily, fontSize: 32, fontWeight: 700, color: "#202124" }}>{timeLabel}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <SignalIcon/><WifiIcon/><BatteryIcon/>
          </div>
        </div>
        {/* Address bar */}
        <div style={{ height: 116, background: "#F8F9FA", display: "flex", alignItems: "center", padding: "0 24px", gap: 16 }}>
          <svg viewBox="0 0 24 24" width={44} height={44}><path fill="#5F6368" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          <div style={{ flex: 1, height: 72, background: "#fff", borderRadius: 36, border: "1px solid #DFE1E5", display: "flex", alignItems: "center", padding: "0 28px", gap: 12, overflow: "hidden" }}>
            <svg viewBox="0 0 24 24" width={32} height={32}><path fill="#5F6368" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span style={{ fontFamily, fontSize: 26, color: "#5F6368", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              google.com/search?q={query}
            </span>
          </div>
          <svg viewBox="0 0 24 24" width={40} height={40}><path fill="#5F6368" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 52, height: 52, borderRadius: 8, border: "2px solid #5F6368", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontSize: 26, fontWeight: 700, color: "#5F6368" }}>50</div>
          </div>
          <svg viewBox="0 0 24 24" width={40} height={40}><circle cx={12} cy={5} r={2} fill="#5F6368"/><circle cx={12} cy={12} r={2} fill="#5F6368"/><circle cx={12} cy={19} r={2} fill="#5F6368"/></svg>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: "#F8F9FA", opacity: progressOp }}>
          <div style={{ height: 4, width: progressWidth, background: "#1A73E8", transition: "none" }}/>
        </div>
      </div>
    </AbsoluteFill>
  );
};
