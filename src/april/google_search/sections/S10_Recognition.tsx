import React from "react";
import { Lottie } from "@remotion/lottie";
import trophyAnimation from "../../../../public/Trophy_Badge_award_Animation.json";
import { fontFamily } from "../fonts";
import { fadeSlideUp, scalePop } from "../animations";
import { CompositionProps } from "../../schema";

const H = 1920;
const CHROME_H = 180;
const ENTER_FRAME = 960;
const C = {
  tp: "#202124",
  ts: "#5F6368",
  link: "#1A0DAB",
  border: "#DFE1E5",
  cardBg: "#FFFFFF",
  iconHalo: "#FEF7E0",
  // Google logo brand palette — used as a rainbow stripe to mark this as the
  // "summary" card. Same four hexes as the user's reference.
  brandBlue: "#4285F4",
  brandRed: "#DB4437",
  brandYellow: "#F4B400",
  brandGreen: "#0F9D58",
};

interface S10Props { frame: number; p: CompositionProps }

// 8px-tall, 4-segment Google logo stripe — the iconic Google identity bar.
// Order matches the Google logo (Blue, Red, Yellow, Blue, Green, Red).
// We use 4 equal segments here for a clean recognition cue.
const GoogleStripe: React.FC = () => (
  <div style={{ display: "flex", height: 8, width: "100%" }}>
    <div style={{ flex: 1, background: C.brandBlue }}/>
    <div style={{ flex: 1, background: C.brandRed }}/>
    <div style={{ flex: 1, background: C.brandYellow }}/>
    <div style={{ flex: 1, background: C.brandGreen }}/>
  </div>
);

export const S10_Recognition: React.FC<S10Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  const headerAnim = fadeSlideUp(localFrame, 0, 20);
  const cardAnim = scalePop(localFrame, 8, 30);
  const bottomAnim = fadeSlideUp(localFrame, 45, 20);

  return (
    <div style={{ position: "absolute", top: H * 8, left: 0, width: 1080, height: H, background: C.cardBg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: CHROME_H, flexShrink: 0 }}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 60px 0" }}>
        <div style={{ flexShrink: 0, ...headerAnim }}>
          <div style={{ fontFamily, fontSize: 32, color: C.ts }}>About 8,47,000 results (0.38 seconds)</div>
          <div style={{ height: 1, background: C.border, marginTop: 20 }}/>
          <div style={{ fontFamily, fontSize: 60, fontWeight: 800, color: C.tp, marginTop: 28, marginBottom: 8 }}>Recognition</div>
          <div style={{ fontFamily, fontSize: 32, color: C.ts }}>Your achievement on Topmate this April</div>
        </div>

        <div style={{ height: 28, flexShrink: 0 }}/>

        {/* Featured-snippet card with the Google rainbow stripe at the top —
            same Knowledge Panel chrome as the Quick Facts cards, but the stripe
            signals "this is the summary moment". */}
        <div style={{
          background: C.cardBg,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: "0 1px 6px rgba(32,33,36,0.08), 0 4px 20px rgba(32,33,36,0.04)",
          width: 960,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          ...cardAnim,
        }}>
          <GoogleStripe/>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 40px 36px" }}>
            {/* Pale gold halo behind the trophy */}
            <div style={{
              width: 380, height: 380,
              borderRadius: "50%",
              background: C.iconHalo,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* @remotion/lottie reads useCurrentFrame() internally so the
                  animation progresses during render. lottie-react is rAF-driven
                  and freezes on the first frame, which clips the badge ribbon. */}
              <Lottie
                animationData={trophyAnimation}
                loop
                style={{ width: 340, height: 340 }}
              />
            </div>

            <div style={{ height: 32 }}/>
            <div style={{ fontFamily, fontSize: 64, fontWeight: 800, color: C.tp, textAlign: "center", letterSpacing: "-0.02em" }}>
              Top <span style={{ color: C.brandBlue }}>{p.top_pct}</span> on Topmate
            </div>
            <div style={{ fontFamily, fontSize: 32, color: C.ts, textAlign: "center", maxWidth: 740, marginTop: 14, lineHeight: 1.5 }}>
              You're among the highest performing creators this month
            </div>

            {/* Source attribution */}
            <div style={{ width: "100%", height: 1, background: C.border, marginTop: 36 }}/>
            <div style={{ fontFamily, fontSize: 22, color: C.ts, marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Source:</span>
              <span style={{ color: C.link, fontWeight: 500 }}>topmate.io</span>
              <span>›</span>
              <span>creators › top</span>
            </div>
          </div>
        </div>

        {/* Overview — centered in remaining space */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 }}>
          <div style={{ ...bottomAnim }}>
            <div style={{ fontFamily, fontSize: 48, fontWeight: 800, color: C.tp, marginBottom: 16 }}>Overview</div>
            <div style={{ fontFamily, fontSize: 40, color: C.ts, lineHeight: 1.5 }}>
              An incredible milestone! Your impact, consistency and dedication set you apart.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
