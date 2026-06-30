import React from "react";
import { interpolate, Img, staticFile } from "remotion";
import { fontFamily } from "../fonts";
import { CompositionProps } from "../../schema";
import { AutoFitText } from "../../components/AutoFitText";

const H = 1920;
const CHROME_H = 180;
const ENTER_FRAME = 120;

const EX = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], EX);

const C = {
  tp: "#202124", ts: "#5F6368",
  tabBlue: "#1A73E8", blue: "#1A0DAB",
  border: "#DFE1E5", hairline: "#DADCE0",
  bg: "#FFFFFF", bgGray: "#F8F9FA", bgChrome: "#F1F3F4",
} as const;

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width={44} height={44}>
    <path fill={C.ts} d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);
const MicIcon = () => (
  <svg viewBox="0 0 24 24" width={42} height={42}>
    <path fill={C.tabBlue} d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.87 6.43 6.5 6.93V21h1v-3.07C16.13 17.43 19 14.53 19 11h-2z"/>
  </svg>
);
const DotsIcon = () => (
  <svg viewBox="0 0 24 24" width={36} height={36}>
    <circle cx={12} cy={5}  r={2} fill={C.ts}/>
    <circle cx={12} cy={12} r={2} fill={C.ts}/>
    <circle cx={12} cy={19} r={2} fill={C.ts}/>
  </svg>
);
const ShareIcon2 = () => (
  <svg viewBox="0 0 24 24" width={32} height={32}>
    <path fill={C.ts} d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
  </svg>
);

interface S3Props { frame: number; p: CompositionProps }

export const S3_CreatorPhoto: React.FC<S3Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  const query    = p.user_name.toLowerCase();
  const initials = p.user_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const chars    = Math.floor(interpolate(localFrame, [15, 90], [0, query.length], EX));
  const cursor   = chars < query.length && Math.floor(localFrame / 12) % 2 === 0;

  const oLogo  = lerp(localFrame,  0, 20);
  const oBar   = lerp(localFrame,  8, 26);
  const oTabs  = lerp(localFrame, 14, 30);
  const oName  = lerp(localFrame, 20, 40);
  const oPills = lerp(localFrame, 30, 50);
  const oLinks = lerp(localFrame, 55, 75);
  const oPhoto = lerp(localFrame, 60, 80);

  return (
    <div style={{ position: "absolute", top: H, left: 0, width: 1080, height: H, background: C.bg, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: CHROME_H, flexShrink: 0 }}/>

      {/* Google logo row */}
      <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "0 36px", opacity: oLogo, flexShrink: 0 }}>
        <div style={{ position: "absolute", left: 36, width: 72, height: 72, borderRadius: "50%", background: C.bgGray, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 24 24" width={38} height={38}><path fill={C.ts} d="M19.8 18.4L14 10.67V6h1c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1h1v4.67L4.2 18.4C3.71 19.06 4.18 20 5 20h14c.82 0 1.29-.94.8-1.6z"/></svg>
        </div>
        <Img src={staticFile("Google_2015_logo.svg")} style={{ width: 300, height: "auto" }}/>
        <div style={{ position: "absolute", right: 36, width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#4285F4,#EA4335)", border: "3px solid #FBBC04", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontSize: 28, fontWeight: 700, color: "#fff" }}>{initials}</div>
      </div>

      <div style={{ height: 16, flexShrink: 0 }}/>

      {/* Search bar */}
      <div style={{ margin: "0 60px", height: 110, background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 55, display: "flex", alignItems: "center", padding: "0 36px", gap: 18, boxShadow: "0 2px 8px rgba(32,33,36,0.22)", opacity: oBar, flexShrink: 0 }}>
        <SearchIcon/>
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
          <span style={{ fontFamily, fontSize: 52, fontWeight: 400, color: C.tp }}>{query.slice(0, chars)}</span>
          {cursor && <div style={{ width: 3, height: 58, background: C.tp, marginLeft: 3, flexShrink: 0 }}/>}
        </div>
        {chars > 0 && <span style={{ fontFamily, fontSize: 40, color: C.ts, flexShrink: 0 }}>✕</span>}
        <div style={{ width: 1, height: 50, background: C.border, flexShrink: 0 }}/>
        <MicIcon/>
      </div>

      <div style={{ height: 30, flexShrink: 0 }}/>

      {/* Tabs: AI Mode, All, Images, News, Videos, Shorts */}
      <div style={{ height: 88, display: "flex", alignItems: "flex-end", padding: "0 60px", opacity: oTabs, flexShrink: 0 }}>
        {(["AI Mode", "All", "Images", "News", "Videos", "Shorts"] as const).map(tab => {
          const sel = tab === "All";
          return (
            <div key={tab} style={{ paddingBottom: 14, paddingRight: 55, flexShrink: 0, borderBottom: sel ? `4px solid ${C.tp}` : "4px solid transparent", boxSizing: "border-box" as const }}>
              <span style={{ fontFamily, fontSize: 42, fontWeight: sel ? 700 : 400, color: sel ? C.tp : C.ts }}>{tab}</span>
            </div>
          );
        })}
      </div>
      <div style={{ height: 1, background: C.hairline, flexShrink: 0 }}/>
      <div style={{ height: 40, flexShrink: 0 }}/>

      {/* Name + designation + pills */}
      <div style={{ padding: "0 60px", opacity: oName, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <AutoFitText maxWidth={820} baseFontSize={92} style={{ fontFamily, fontWeight: 700, color: C.tp, lineHeight: 1.05 }}>{p.user_name}</AutoFitText>
          <div style={{ display: "flex", gap: 14, marginLeft: 16, marginTop: 8, flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><DotsIcon/></div>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><ShareIcon2/></div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <AutoFitText maxWidth={820} baseFontSize={46} style={{ fontFamily, fontWeight: 400, color: C.ts }}>{"April Recap '26"}</AutoFitText>
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 36, opacity: oPills }}>
          {([{ l: "Overview", s: true }, { l: "Sessions", s: false }, { l: "Reviews", s: false }] as const).map(({ l, s }) => (
            <div key={l} style={{ height: 78, padding: "0 38px", borderRadius: 39, background: s ? "#E8F0FE" : C.bgChrome, border: s ? `1.5px solid ${C.tabBlue}` : `1px solid ${C.border}`, display: "flex", alignItems: "center", fontFamily, fontSize: 38, fontWeight: s ? 700 : 400, color: s ? C.tabBlue : C.tp }}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: C.hairline, margin: "10px 0 0", flexShrink: 0 }}/>

      {/* Results count + photo */}
      <div style={{ padding: "0 60px", flexShrink: 0 }}>
        <div style={{ paddingTop: 24, fontFamily, fontSize: 32, color: C.ts, lineHeight: 1.4, opacity: oLinks }}>
          About 8,47,000 results (0.38 seconds)
        </div>
        <div style={{ height: 40 }}/>
        <div style={{ opacity: oPhoto }}>
          <div style={{ width: 880, margin: "0 auto", position: "relative", borderRadius: 32, overflow: "hidden" }}>
            <Img
              src={p.profile_pic_url}
              style={{ width: 880, height: 880, objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}/>
            <div style={{ position: "absolute", bottom: 22, left: 22, fontFamily, fontSize: 28, color: "#fff" }}>
              Source: Topmate.io
            </div>
          </div>
          <div style={{ height: 30 }}/>
          <div style={{ width: 880, margin: "0 auto", fontFamily, fontSize: 28, color: C.ts }}>
            Image · Topmate.io{" "}<span style={{ color: C.blue }}>›</span>
          </div>
        </div>
      </div>
    </div>
  );
};
