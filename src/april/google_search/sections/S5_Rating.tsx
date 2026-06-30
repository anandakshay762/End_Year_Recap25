import React from "react";
import { CompositionProps } from "../../schema";
import { QuickFactCard } from "../components/QuickFactCard";
import { countUpFloat } from "../animations";

const ENTER_FRAME = 360;
const H = 1920;

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width={60} height={60}>
    <path fill="#F4B400" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

interface S5Props { frame: number; p: CompositionProps }

export const S5_Rating: React.FC<S5Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);
  const val = countUpFloat(localFrame, p.rating, 1, 50, 5);

  return (
    <div style={{ position: "absolute", top: H * 3, left: 0, width: 1080, height: H, overflow: "hidden" }}>
      <QuickFactCard
        localFrame={localFrame}
        accentColor="#F4B400"
        iconBg="#FEF7E0"
        icon={<StarIcon/>}
        label="Rating"
        displayValue={val}
        sublabel={`From ${p.review_count} clients`}
        sourcePath="reviews"
        overviewText="Every session left an impression worth remembering."
      />
    </div>
  );
};
