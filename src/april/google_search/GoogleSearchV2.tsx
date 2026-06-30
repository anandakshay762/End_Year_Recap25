import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Easing } from "remotion";
import { CompositionProps } from "../schema";
import { PersistentChrome } from "./components/PersistentChrome";
import { S1_Homepage } from "./sections/S1_Homepage";
import { S2_ProfileCard } from "./sections/S2_ProfileCard";
import { S3_CreatorPhoto } from "./sections/S3_CreatorPhoto";
import { S4_Bookings } from "./sections/S4_Bookings";
import { S5_Rating } from "./sections/S5_Rating";
import { S6_ProfileViews } from "./sections/S6_ProfileViews";
import { S7_TopServices } from "./sections/S7_TopServices";
import { S8_BookingSources } from "./sections/S8_BookingSources";
import { S9_TopCities } from "./sections/S9_TopCities";
import { S10_Recognition } from "./sections/S10_Recognition";

const W = 1080;
const H = 1920;

// ─── Scroll keyframes ─────────────────────────────────────────────────────────
// 10 slides × 120 frames each = 1200 total. 20-frame eased scroll transition.
// Slide order: S1, S3, S4, S5, S6, S7, S8, S9, S10, S2
const SF = [
  0,    100,  // S1 hold
  120,  220,  // S3
  240,  340,  // S4
  360,  460,  // S5
  480,  580,  // S6
  600,  700,  // S7
  720,  820,  // S8
  840,  940,  // S9
  960,  1060, // S10
  1080, 1200, // S2
];

const SY = [
   0,    0,   // S1
  -H,   -H,   // S3
  -2*H, -2*H, // S4
  -3*H, -3*H, // S5
  -4*H, -4*H, // S6
  -5*H, -5*H, // S7
  -6*H, -6*H, // S8
  -7*H, -7*H, // S9
  -8*H, -8*H, // S10
  -9*H, -9*H, // S2
];

const mat = Easing.bezier(0.4, 0, 0.2, 1);

const getScrollY = (frame: number) =>
  interpolate(frame, SF, SY, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: mat,
  });

// ─── Default props ────────────────────────────────────────────────────────────
export const defaultPropsV2: CompositionProps = {
  user_name: "Anjali Dutta",
  designation: "Career Coach",
  profile_pic_url: "https://i.pravatar.cc/400?img=47",
  topmate_link: "topmate.io/anjali_dutta10",
  month_label: "April '26",
  time_label: "9:41",
  month_sessions: 47,
  booking_context: "This April",
  rating: 4.9,
  review_count: 186,
  profile_views: "2.8K",
  views_vs_last_month: "+34% vs March",
  top_pct: "0.1%",
  top_services: [
    { name: "1:1 Career Strategy Session", badge: "Most booked this month" },
    { name: "Resume Review Session", badge: "Popular this month" },
    { name: "Mock Interview Prep", badge: "Frequently booked" },
  ],
  top_sources: [
    { name: "Topmate Discovery", badge: "Most bookings came from here" },
    { name: "LinkedIn", badge: "Strong external traffic" },
    { name: "Direct / Profile link", badge: "Repeat and shared users" },
  ],
  top_cities: [
    { name: "Bangalore", badge: "Highest number of bookings" },
    { name: "Mumbai", badge: "Strong demand this month" },
    { name: "Delhi", badge: "Consistent bookings" },
  ],
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const GoogleSearchV2: React.FC<CompositionProps> = (p) => {
  const frame = useCurrentFrame();
  const scrollY = getScrollY(frame);

  return (
    <AbsoluteFill style={{ background: "#F8F9FA" }}>
      <Audio src={staticFile("bg-audio.mp4")} volume={1} />
      {/* Scrolling canvas — 10 sections tall */}
      <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, overflow: "hidden" }}>
        <div style={{
          position: "relative",
          width: W,
          height: H * 10,
          transform: `translateY(${scrollY}px)`,
          willChange: "transform",
        }}>
          <S1_Homepage frame={frame} p={p}/>
          <S3_CreatorPhoto frame={frame} p={p}/>
          <S4_Bookings frame={frame} p={p}/>
          <S5_Rating frame={frame} p={p}/>
          <S6_ProfileViews frame={frame} p={p}/>
          <S7_TopServices frame={frame} p={p}/>
          <S8_BookingSources frame={frame} p={p}/>
          <S9_TopCities frame={frame} p={p}/>
          <S10_Recognition frame={frame} p={p}/>
          <S2_ProfileCard frame={frame} p={p}/>
        </div>
      </div>

      {/* Persistent chrome — fixed overlay */}
      <PersistentChrome frame={frame} userName={p.user_name} timeLabel={p.time_label}/>
    </AbsoluteFill>
  );
};
