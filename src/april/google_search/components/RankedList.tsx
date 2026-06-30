import React from "react";
import { interpolate } from "remotion";
import { fontFamily } from "../fonts";
import { fadeSlideUp } from "../animations";

const EX = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const C = {
  tp: "#202124", ts: "#5F6368",
  blue: "#1A0DAB", tabBlue: "#1A73E8",
  border: "#E8EAED",
};

export interface RankedItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: boolean;
}

interface RankedListProps {
  localFrame: number;
  sectionTitle: string;
  sectionSubtitle: string;
  items: RankedItem[];
  overviewText: string;
}

export const RankedList: React.FC<RankedListProps> = ({
  localFrame, sectionTitle, sectionSubtitle, items, overviewText,
}) => {
  return (
    <div style={{ padding: "0 60px", display: "flex", flexDirection: "column", flex: 1 }}>

      {/* ── Section header + items ── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: 1, background: C.border, marginBottom: 24 }}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily, fontSize: 60, fontWeight: 800, color: C.tp }}>{sectionTitle}</span>
          <svg viewBox="0 0 24 24" width={40} height={40}><circle cx={12} cy={5} r={2} fill={C.ts}/><circle cx={12} cy={12} r={2} fill={C.ts}/><circle cx={12} cy={19} r={2} fill={C.ts}/></svg>
        </div>
        <div style={{ fontFamily, fontSize: 36, color: C.ts, marginBottom: 32 }}>{sectionSubtitle}</div>

        {items.map((item, i) => {
          const isHighlight = i === 0;
          const anim = fadeSlideUp(localFrame, i * 8, 20);
          const titleFontSize = interpolate(item.title.length, [10, 30], [52, 36], EX);
          const subtitleFontSize = interpolate(item.subtitle.length, [10, 40], [40, 28], EX);
          return (
            <div
              key={i}
              style={{
                height: isHighlight ? 200 : 160,
                background: isHighlight ? "#EBF3FF" : "#fff",
                borderRadius: 16,
                border: `1px solid ${isHighlight ? "#BFDBFE" : C.border}`,
                display: "flex",
                alignItems: "center",
                padding: "0 40px",
                gap: 28,
                marginBottom: i < items.length - 1 ? 16 : 0,
                ...anim,
              }}
            >
              <div style={{ width: 80, height: 80, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily, fontSize: titleFontSize, fontWeight: 700, color: C.tp }}>{item.title}</div>
                <div style={{ fontFamily, fontSize: subtitleFontSize, marginTop: 8, color: isHighlight ? C.tabBlue : C.ts }}>{item.subtitle}</div>
              </div>
              <svg viewBox="0 0 24 24" width={40} height={40}><path fill={C.ts} d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </div>
          );
        })}
      </div>

      {/* ── Overview — centered in remaining space ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 }}>
        <div style={{ ...fadeSlideUp(localFrame, 28, 20) }}>
          <div style={{ fontFamily, fontSize: 56, fontWeight: 800, color: C.tp, marginBottom: 16 }}>Overview</div>
          <div style={{ fontFamily, fontSize: 44, color: C.ts, lineHeight: 1.6 }}>{overviewText}</div>
        </div>
      </div>

    </div>
  );
};
