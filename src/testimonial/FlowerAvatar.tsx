import React from "react";
import { staticFile } from "remotion";

const FLOWER_IMAGES = [
  staticFile("1.jpg"),
  staticFile("2.jpg"),
  staticFile("3.jpg"),
];

export const FlowerAvatar: React.FC<{ index: number; size?: number }> = ({ index, size = 80 }) => {
  const src = FLOWER_IMAGES[index % FLOWER_IMAGES.length];
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};
