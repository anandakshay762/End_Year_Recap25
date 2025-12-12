import React, { CSSProperties } from 'remotion';

interface GlassmorphicCardProps {
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  width = '100%',
  height = '100%',
  style,
  children,
}) => {
  const cardStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)', // Safari support
    backgroundColor: 'rgba(217, 217, 217, 0.15)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    ...style,
  };

  return (
    <div style={cardStyle} data-node-id="149:478">
      {children}
    </div>
  );
};
