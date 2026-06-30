import React from "react";
import { interpolate } from "remotion";
import { fontFamily } from "../fonts";
import { fadeSlideUp } from "../animations";

const EX = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

interface QuickFactCardProps {
  localFrame: number;
  // Google brand color used for the 8px top edge + small icon-color details.
  // One of: #4285F4 / #0F9D58 / #F4B400 / #DB4437.
  accentColor: string;
  // Pale tint behind the icon pill (matches the brand color, e.g. blue → #EBF3FF).
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  displayValue: string;
  sublabel: string;
  sourcePath: string;
  overviewText: string;
  extraContent?: React.ReactNode;
}

const W = 1080;
const CHROME_H = 180;

const C = {
  tp: "#202124",        // Google primary text
  ts: "#5F6368",        // Google secondary text
  link: "#1A0DAB",      // Google search-result link blue
  border: "#DFE1E5",    // Google card hairline
  cardBg: "#FFFFFF",
};

export const QuickFactCard: React.FC<QuickFactCardProps> = ({
  localFrame, accentColor, iconBg, icon, label, displayValue, sublabel, sourcePath, overviewText, extraContent,
}) => {
  const cardAnim = fadeSlideUp(localFrame, 5, 25);
  const ovAnim = fadeSlideUp(localFrame, 40, 20);
  const valueFontSize = interpolate(displayValue.length, [1, 5], [160, 100], EX);

  return (
    <div style={{ width: W, height: 1920, background: C.cardBg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: CHROME_H, flexShrink: 0 }}/>

      {/* Header — mimics Google's "About N results (0.38s)" + page heading */}
      <div style={{ padding: "60px 60px 0", flexShrink: 0 }}>
        <div style={{ fontFamily, fontSize: 32, color: C.ts }}>About 8,47,000 results (0.38 seconds)</div>
        <div style={{ height: 1, background: C.border, marginTop: 20 }}/>
        <div style={{ fontFamily, fontSize: 60, fontWeight: 800, color: C.tp, marginTop: 32, marginBottom: 28 }}>Quick facts</div>
      </div>

      {/* Stat card — Knowledge Panel pattern with a Google-brand-color top edge */}
      <div style={{ padding: "0 60px", marginTop: 20, flexShrink: 0, ...cardAnim }}>
        <div style={{
          background: C.cardBg,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: "0 1px 6px rgba(32,33,36,0.08), 0 4px 20px rgba(32,33,36,0.04)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Google-brand top edge (8px) */}
          <div style={{ height: 8, background: accentColor }}/>

          <div style={{ padding: "60px 60px 44px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Icon pill — pale tint of the accent color, brand-color filled icon */}
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {icon}
            </div>

            <div style={{ fontFamily, fontSize: 36, fontWeight: 500, color: C.ts, marginTop: 28, textAlign: "center", letterSpacing: "0.02em" }}>{label}</div>

            <div style={{ fontFamily, fontSize: valueFontSize, fontWeight: 800, color: C.tp, lineHeight: 1, marginTop: 16, fontFeatureSettings: "'tnum'", letterSpacing: "-0.03em" }}>
              {displayValue}
            </div>

            <div style={{ fontFamily, fontSize: 30, color: accentColor, fontWeight: 600, marginTop: 18, textAlign: "center" }}>{sublabel}</div>

            {/* Source attribution */}
            <div style={{ width: "100%", height: 1, background: C.border, marginTop: 32 }}/>
            <div style={{ fontFamily, fontSize: 22, color: C.ts, marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Source:</span>
              <span style={{ color: C.link, fontWeight: 500 }}>topmate.io</span>
              <span>›</span>
              <span>{sourcePath}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview — vertically centered in remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px 60px" }}>
        <div style={{ ...ovAnim }}>
          <div style={{ fontFamily, fontSize: 48, fontWeight: 800, color: C.tp, marginBottom: 20 }}>Overview</div>
          <div style={{ fontFamily, fontSize: 44, color: C.ts, lineHeight: 1.5 }}>{overviewText}</div>
          {extraContent}
        </div>
      </div>
    </div>
  );
};
