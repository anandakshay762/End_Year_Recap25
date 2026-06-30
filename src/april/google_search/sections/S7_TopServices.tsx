import React from "react";
import { CompositionProps } from "../../schema";
import { RankedList, RankedItem } from "../components/RankedList";
import { fontFamily } from "../fonts";

const ENTER_FRAME = 600;
const H = 1920;
const CHROME_H = 180;

const AwardIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 60 80" width={60} height={80}>
    <circle cx={30} cy={28} r={26} fill={color} stroke="#fff" strokeWidth={2}/>
    <text x={30} y={34} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff">1</text>
    <path d="M18,52 L10,72 L30,62 L50,72 L42,52 Z" fill={color} opacity={0.8}/>
  </svg>
);

const RankCircle = ({ n, color }: { n: number; color: string }) => (
  <svg viewBox="0 0 60 60" width={64} height={64}>
    <circle cx={30} cy={30} r={28} fill="none" stroke={color} strokeWidth={2}/>
    <text x={30} y={37} textAnchor="middle" fontSize={24} fontWeight={700} fill={color}>{n}</text>
  </svg>
);

interface S7Props { frame: number; p: CompositionProps }

export const S7_TopServices: React.FC<S7Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  const items: RankedItem[] = [
    {
      icon: <AwardIcon color="#1A73E8"/>,
      title: p.top_services[0].name,
      subtitle: p.top_services[0].badge,
      highlight: true,
    },
    {
      icon: <RankCircle n={2} color="#5F6368"/>,
      title: p.top_services[1].name,
      subtitle: p.top_services[1].badge,
    },
    {
      icon: <RankCircle n={3} color="#5F6368"/>,
      title: p.top_services[2].name,
      subtitle: p.top_services[2].badge,
    },
  ];

  return (
    <div style={{ position: "absolute", top: H * 5, left: 0, width: 1080, height: H, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: CHROME_H, flexShrink: 0 }}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 24 }}>
        <div style={{ padding: "0 60px", fontFamily, fontSize: 32, color: "#5F6368", marginBottom: 20, flexShrink: 0 }}>
          About 8,47,000 results (0.38 seconds)
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <RankedList
            localFrame={localFrame}
            sectionTitle="Top services"
            sectionSubtitle="The services your clients loved the most this April"
            items={items}
            overviewText="The work that resonates most is the work clients come back for."
          />
        </div>
      </div>
    </div>
  );
};
