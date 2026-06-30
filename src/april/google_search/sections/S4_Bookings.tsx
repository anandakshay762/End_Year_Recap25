import React from "react";
import { CompositionProps } from "../../schema";
import { QuickFactCard } from "../components/QuickFactCard";
import { countUp } from "../animations";

const ENTER_FRAME = 240;
const H = 1920;

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width={60} height={60}>
    <path fill="#4285F4" d="M19 3h-1V1h-2v2H8V1H6v2H5C3.89 3 3 3.9 3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

interface S4Props { frame: number; p: CompositionProps }

export const S4_Bookings: React.FC<S4Props> = ({ frame, p }) => {
  const localFrame = Math.max(0, frame - ENTER_FRAME);
  const count = countUp(localFrame, p.month_sessions, 50, 5);

  return (
    <div style={{ position: "absolute", top: H * 2, left: 0, width: 1080, height: H, overflow: "hidden" }}>
      <QuickFactCard
        localFrame={localFrame}
        accentColor="#4285F4"
        iconBg="#E8F0FE"
        icon={<CalendarIcon/>}
        label="Bookings"
        displayValue={String(count)}
        sublabel={p.booking_context}
        sourcePath="bookings"
        overviewText="Clients kept showing up. Consistency is your strongest signal."
      />
    </div>
  );
};
