import React, { CSSProperties } from 'remotion';
import { useCurrentFrame, interpolate } from 'remotion';

interface BadgeProps {
  text: string;
  icon?: string;
  offset?: number;
  style?: CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ text, icon, offset = 0, style }) => {
  const frame = useCurrentFrame();

  // Wiggle animation - rotates back and forth with offset for variation
  const wiggle = interpolate(
    (frame + offset) % 60, // Loop every 60 frames (2 seconds at 30fps) with offset
    [0, 15, 30, 45, 60],
    [0, -5, 0, 5, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const placeholderStyle: CSSProperties = {
    position: 'relative',
    width: '200px',
    height: '200px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: `rotate(${wiggle}deg)`,
    ...style,
  };

  return (
    <div style={placeholderStyle} data-node-id="177:551">
      {icon && (
        <img
          src={icon}
          alt={text}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '20px',
          }}
        />
      )}
    </div>
  );
};
