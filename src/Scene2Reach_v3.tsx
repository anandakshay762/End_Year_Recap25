import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene2ReachProps {
  city1: string;
  city2: string;
  uniqueCitiesCount: string;
  startFrame: number;
}

export const Scene2Reach: React.FC<Scene2ReachProps> = ({
  city1,
  city2,
  uniqueCitiesCount,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label
  const labelOpacity = interpolate(localFrame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cities text - staggered entrance
  const city1Opacity = interpolate(localFrame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const city1Scale = interpolate(
    localFrame,
    [15, 45],
    [1.3, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // Arrow
  const arrowOpacity = interpolate(localFrame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const arrowX = interpolate(localFrame, [40, 60], [-20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // City 2
  const city2Opacity = interpolate(localFrame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const city2Scale = interpolate(
    localFrame,
    [55, 85],
    [1.3, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // Parse unique cities count
  const uniqueCities = parseInt(uniqueCitiesCount) || 2;

  const contextOpacity = interpolate(localFrame, [85, 105], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const contextY = interpolate(localFrame, [85, 105], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: '100px 80px',
      }}
    >
      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '90%' }}>
        {/* Label */}
        <div
          style={{
            opacity: labelOpacity,
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '16px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              margin: 0,
            }}
          >
            THE REACH
          </p>
        </div>

        {/* Cities row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* City 1 */}
          <div
            style={{
              opacity: city1Opacity,
              transform: `scale(${city1Scale})`,
              transformOrigin: 'left center',
            }}
          >
            <h1
              style={{
                fontFamily: '"SF Mono", "JetBrains Mono", "Roboto Mono", monospace',
                fontSize: '120px',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-4px',
                textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
                textTransform: 'uppercase',
              }}
            >
              {city1}
            </h1>
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: arrowOpacity,
              transform: `translateX(${arrowX}px)`,
            }}
          >
            <div
              style={{
                fontFamily: '"SF Mono", "JetBrains Mono", "Roboto Mono", monospace',
                fontSize: '80px',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1,
              }}
            >
              →
            </div>
          </div>

          {/* City 2 */}
          <div
            style={{
              opacity: city2Opacity,
              transform: `scale(${city2Scale})`,
              transformOrigin: 'left center',
            }}
          >
            <h1
              style={{
                fontFamily: '"SF Mono", "JetBrains Mono", "Roboto Mono", monospace',
                fontSize: '120px',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-4px',
                textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
                textTransform: 'uppercase',
              }}
            >
              {city2}
            </h1>
          </div>
        </div>

        {/* Context */}
        <div
          style={{
            opacity: contextOpacity,
            transform: `translateY(${contextY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '32px',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
              letterSpacing: '0px',
              lineHeight: 1.3,
            }}
          >
            Your offerings reached <span style={{ fontWeight: 600 }}>{uniqueCities} unique cities</span>
          </p>
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at bottom left, transparent 30%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
