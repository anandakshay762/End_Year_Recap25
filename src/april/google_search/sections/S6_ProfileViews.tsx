import React from "react";
import { CompositionProps } from "../../schema";
import { QuickFactCard } from "../components/QuickFactCard";

const ENTER_FRAME = 480;
const H = 1920;

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width={60} height={60}>
    <path fill="#0F9D58" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

interface S6Props { frame: number; p: CompositionProps }

export const S6_ProfileViews: React.FC<S6Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);

  return (
    <div style={{ position: "absolute", top: H * 4, left: 0, width: 1080, height: H, overflow: "hidden" }}>
      <QuickFactCard
        localFrame={localFrame}
        accentColor="#0F9D58"
        iconBg="#E6F4EA"
        icon={<EyeIcon/>}
        label="Profile Views"
        displayValue={p.profile_views}
        sublabel={p.views_vs_last_month}
        sourcePath="profile"
        overviewText="More eyes on your profile means more doors opening."
      />
    </div>
  );
};
