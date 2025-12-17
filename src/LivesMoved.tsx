import React, { CSSProperties } from 'react';
import { staticFile, interpolate } from 'remotion';

interface LivesMovedProps {
  text: string;
  style?: CSSProperties;
  animationProgress?: number;
}

export const LivesMoved: React.FC<LivesMovedProps> = ({ text, style, animationProgress = 1 }) => {
  // Extract the number from the text (e.g., "350 lives moved forward because of you.")
  const match = text.match(/^(\d+)/);
  const numericValue = match ? parseInt(match[1]) : 0;

  // Animate the number from 0 to the target value
  const animatedValue = Math.floor(interpolate(
    animationProgress,
    [0, 1],
    [0, numericValue],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  ));

  // Replace the number in the original text with the animated value
  const displayText = text.replace(/^\d+/, animatedValue.toString());
  const bannerStyle: CSSProperties = {
    position: 'relative',
    width: '876px',
    height: '211px',
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 40px',
    ...style,
  };

  const textStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '50px',
    fontWeight: 400,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    width: '100%',
  };

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'AUTOMATA';
            src: url('${staticFile('AUTOMATA.ttf')}') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={bannerStyle} data-node-id="178:558">
        <p style={textStyle} data-node-id="178:556">
          {displayText}
        </p>
      </div>
    </>
  );
};
