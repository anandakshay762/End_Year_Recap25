import React from "react";
import { CompositionProps } from "../../schema";
import { RankedList, RankedItem } from "../components/RankedList";
import { fontFamily } from "../fonts";

const ENTER_FRAME = 720;
const H = 1920;
const CHROME_H = 180;

const CompassIcon = () => (
  <svg viewBox="0 0 60 60" width={64} height={64}>
    <circle cx={30} cy={30} r={28} fill="none" stroke="#1A73E8" strokeWidth={2}/>
    <circle cx={30} cy={30} r={3} fill="#1A73E8"/>
    <path d="M30,8 L35,30 L30,52 L25,30 Z" fill="#1A73E8" opacity={0.3}/>
    <path d="M8,30 L30,25 L52,30 L30,35 Z" fill="#1A73E8" opacity={0.3}/>
    <path d="M30,12 L33,28 L30,30 L27,28 Z" fill="#EA4335"/>
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 60 60" width={64} height={64}>
    <circle cx={30} cy={30} r={28} fill="#EEF2FF"/>
    <circle cx={22} cy={21} r={7} fill="#4F46E5"/>
    <path d="M6 45 C6 33 38 33 38 45 Z" fill="#4F46E5"/>
    <circle cx={40} cy={19} r={6} fill="#818CF8"/>
    <path d="M28 45 C30 34 54 34 54 45 Z" fill="#818CF8"/>
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 60 60" width={64} height={64}>
    <circle cx={30} cy={30} r={28} fill="#F0EBFF"/>
    <rect x={6} y={23} width={28} height={14} rx={7} fill="#F0EBFF" stroke="#7C3AED" strokeWidth={3.5}/>
    <rect x={26} y={23} width={28} height={14} rx={7} fill="#F0EBFF" stroke="#7C3AED" strokeWidth={3.5}/>
  </svg>
);

const icons = [<CompassIcon/>, <PeopleIcon/>, <LinkIcon/>];

interface S8Props { frame: number; p: CompositionProps }

export const S8_BookingSources: React.FC<S8Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  const items: RankedItem[] = p.top_sources.map((src, i) => ({
    icon: icons[i],
    title: src.name,
    subtitle: src.badge,
    highlight: i === 0,
  }));

  return (
    <div style={{ position: "absolute", top: H * 6, left: 0, width: 1080, height: H, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: CHROME_H, flexShrink: 0 }}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 24 }}>
        <div style={{ padding: "0 60px", fontFamily, fontSize: 32, color: "#5F6368", marginBottom: 20, flexShrink: 0 }}>
          About 8,47,000 results (0.38 seconds)
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <RankedList
            localFrame={localFrame}
            sectionTitle="Top booking sources"
            sectionSubtitle="Where your bookings came from this April"
            items={items}
            overviewText="Your reach is wider than one channel. That's a strength."
          />
        </div>
      </div>
    </div>
  );
};
