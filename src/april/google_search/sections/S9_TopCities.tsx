import React from "react";
import { CompositionProps } from "../../schema";
import { RankedList, RankedItem } from "../components/RankedList";
import { fontFamily } from "../fonts";

const ENTER_FRAME = 840;
const H = 1920;
const CHROME_H = 180;

const PIN_COLORS = ["#1A73E8", "#15803D", "#7C3AED"];

const PinIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 60 80" width={60} height={80}>
    <path d="M30 4 C16 4 8 14 8 26 C8 42 30 72 30 72 C30 72 52 42 52 26 C52 14 44 4 30 4 Z" fill={color}/>
    <circle cx={30} cy={26} r={10} fill="#fff" opacity={0.4}/>
  </svg>
);

interface S9Props { frame: number; p: CompositionProps }

export const S9_TopCities: React.FC<S9Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  const items: RankedItem[] = p.top_cities.map((city, i) => ({
    icon: <PinIcon color={PIN_COLORS[i]}/>,
    title: city.name,
    subtitle: city.badge,
    highlight: i === 0,
  }));

  return (
    <div style={{ position: "absolute", top: H * 7, left: 0, width: 1080, height: H, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: CHROME_H, flexShrink: 0 }}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 24 }}>
        <div style={{ padding: "0 60px", fontFamily, fontSize: 32, color: "#5F6368", marginBottom: 20, flexShrink: 0 }}>
          About 8,47,000 results (0.38 seconds)
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <RankedList
            localFrame={localFrame}
            sectionTitle="Top cities"
            sectionSubtitle="Cities where most of your bookings came from this April"
            items={items}
            overviewText="Your impact doesn't stay local — it travels."
          />
        </div>
      </div>
    </div>
  );
};
