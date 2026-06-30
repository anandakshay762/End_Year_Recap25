import React from "react";
import { interpolate, Img, staticFile } from "remotion";
import { fontFamily } from "../fonts";
import { fadeSlideUp, scalePop } from "../animations";
import { CompositionProps } from "../../schema";
import { AutoFitText } from "../../components/AutoFitText";

const H = 1920;
const CHROME_H = 180;
const ENTER_FRAME = 1080;

const C = { tp: "#202124", ts: "#5F6368", tabBlue: "#1A73E8", border: "#E8EAED" };

// Four-pointed star SVG shape
const Star4 = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill={color} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

interface S2Props { frame: number; p: CompositionProps }

export const S2_ProfileCard: React.FC<S2Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  const cardAnim = fadeSlideUp(localFrame, 0, 25);
  const avatarAnim = scalePop(localFrame, 8, 22);

  // Sparkle stagger
  const sp = (d: number) => ({
    opacity: interpolate(localFrame, [d, d + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `scale(${interpolate(localFrame, [d, d + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
  });

  const poweredAnim = fadeSlideUp(localFrame, 50, 20);

  return (
    <div style={{ position: "absolute", top: H * 9, left: 0, width: 1080, height: H, background: "#F8F9FA", overflow: "hidden" }}>
      <div style={{ height: CHROME_H }}/>
      <div style={{ background: "#fff", padding: "0 0 0" }}>
        <div style={{ padding: "24px 60px 0", fontFamily, fontSize: 32, color: C.ts }}>
          About 8,47,000 results (0.38 seconds)
        </div>
        <div style={{ height: 40 }}/>

        {/* Profile card */}
        <div style={{
          margin: "0 60px",
          background: "#fff",
          borderRadius: 24,
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          padding: "140px 40px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...cardAnim,
        }}>
          {/* Circular profile photo with sparkles */}
          <div style={{ position: "relative", width: 196, height: 196, alignSelf: "center", ...avatarAnim }}>
            <div style={{ width: 196, height: 196, borderRadius: "50%", overflow: "hidden", border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
              <Img
                src={p.profile_pic_url}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
            </div>

            {/* Sparkles */}
            <div style={{ position: "absolute", top: -10, left: -10, ...sp(4) }}>
              <Star4 size={30} color="#7C3AED"/>
            </div>
            <div style={{ position: "absolute", top: 18, right: -18, ...sp(8) }}>
              <Star4 size={24} color="#F59E0B"/>
            </div>
            <div style={{ position: "absolute", bottom: 8, left: -6, ...sp(12) }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22C55E" }}/>
            </div>
            <div style={{ position: "absolute", bottom: 8, right: -6, ...sp(16) }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3B82F6" }}/>
            </div>
          </div>

          {/* Name */}
          <div style={{ marginTop: 40, width: "100%" }}>
            <AutoFitText maxWidth={840} baseFontSize={72} style={{ fontFamily, fontWeight: 800, color: C.tp, textAlign: "center", display: "block" }}>
              {p.user_name}
            </AutoFitText>
          </div>

          {/* Subtitle */}
          <div style={{ marginTop: 12, fontFamily, fontSize: 44, color: C.ts, textAlign: "center" }}>{"April Recap '26"}</div>

          {/* Link pill */}
          <div style={{ marginTop: 48, width: 840, alignSelf: "center", height: 100, border: `1.5px solid ${C.border}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px", gap: 20 }}>
            <svg viewBox="0 0 24 24" width={36} height={36}><path fill="#7C3AED" d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-2-4h6v-2H9z"/></svg>
            <div style={{ flex: 1 }}>
              <AutoFitText maxWidth={680} baseFontSize={44} style={{ fontFamily, color: C.tabBlue, fontWeight: 500 }}>
                {p.topmate_link}
              </AutoFitText>
            </div>
            <svg viewBox="0 0 24 24" width={28} height={28}><path fill="#9AA0A6" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
          </div>
        </div>
      </div>

      {/* Powered by Topmate — pinned to bottom */}
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, ...poweredAnim, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "0 60px" }}>
        <div style={{ height: 1, background: C.border, width: "100%", marginBottom: 12 }}/>
        <div style={{ fontFamily, fontSize: 32, color: C.ts }}>Powered by</div>
        <Img src={staticFile("topmate-dark.svg")} style={{ width: 240, height: "auto" }}/>
        <div style={{ fontFamily, fontSize: 32, color: C.ts }}>India's home for creators</div>
      </div>
    </div>
  );
};
