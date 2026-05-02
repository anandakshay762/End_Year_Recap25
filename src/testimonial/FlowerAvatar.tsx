import React from "react";

// Color palette for initials avatars — chosen for contrast against white
// testimonial-card backgrounds + good differentiation between cards.
const PALETTE = [
  "#7C3AED", // purple-600
  "#0EA5E9", // sky-500
  "#F59E0B", // amber-500
  "#10B981", // emerald-500
  "#EC4899", // pink-500
];

const initialsFor = (name: string): string => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const colorFor = (name: string, index: number): string => {
  // Hash the name so the same person gets the same color across renders;
  // fall back to index-based color when name is empty.
  const seed = (name || "").split("").reduce((h, c) => h + c.charCodeAt(0), 0);
  const slot = (name ? seed : index) % PALETTE.length;
  return PALETTE[slot];
};

export const FlowerAvatar: React.FC<{
  index: number;
  name?: string;
  size?: number;
}> = ({ index, name = "", size = 80 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colorFor(name, index),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontFamily: "'SF Pro Display', sans-serif",
        fontWeight: 700,
        fontSize: Math.round(size * 0.42),
        letterSpacing: "0.02em",
        userSelect: "none",
      }}
    >
      {initialsFor(name)}
    </div>
  );
};
