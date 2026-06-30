import React from "react";
import { fontFamily } from "../fonts";
import { fadeSlideUp } from "../animations";

interface StatMiniCardProps {
  localFrame: number;
  delay: number;
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  growth: string;
}

export const StatMiniCard: React.FC<StatMiniCardProps> = ({
  localFrame, delay, iconBg, icon, label, value, growth,
}) => {
  const anim = fadeSlideUp(localFrame, delay, 20);
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      borderRadius: 20,
      border: "1px solid #F3F4F6",
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      ...anim,
    }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ fontFamily, fontSize: 30, color: "#6B7280", fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily, fontSize: 52, fontWeight: 800, color: "#202124", lineHeight: 1, fontFeatureSettings: "'tnum'" }}>{value}</div>
      <div>
        <span style={{ fontFamily, fontSize: 28, fontWeight: 700, color: "#7C3AED" }}>{growth}</span>
        <span style={{ fontFamily, fontSize: 28, color: "#9CA3AF" }}> vs March</span>
      </div>
    </div>
  );
};
