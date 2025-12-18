import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene7StarsProps {
  rating: string;
  startFrame: number;
}

export const Scene7Stars: React.FC<Scene7StarsProps> = ({
  rating,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const ratingValue = parseFloat(rating) || 4.9;

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Rating counter
  const animatedRating = interpolate(
    localFrame,
    [12, 48],
    [0, ratingValue],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // Scale
  const numberScale = interpolate(
    localFrame,
    [12, 42],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const numberOpacity = interpolate(localFrame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Top label
  const topLabelOpacity = interpolate(localFrame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const topLabelY = interpolate(localFrame, [5, 25], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Bottom label
  const bottomLabelOpacity = interpolate(localFrame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomLabelY = interpolate(localFrame, [55, 75], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Underline
  const underlineWidth = interpolate(localFrame, [42, 58], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
        {/* Top Text - Light weight */}
        <div
          style={{
            opacity: topLabelOpacity,
            transform: `translateY(${topLabelY}px)`,
            marginBottom: '12px',
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '48px',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-1px',
            }}
          >
            AVERAGE RATING
          </p>
        </div>

        {/* MASSIVE RATING NUMBER */}
        <div
          style={{
            opacity: numberOpacity,
            transform: `scale(${numberScale})`,
            transformOrigin: 'bottom left',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '260px',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 0.8,
              letterSpacing: '-10px',
              textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
            }}
          >
            {animatedRating.toFixed(1)}/5
          </h1>

          {/* Underline */}
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: `${underlineWidth}%`,
              maxWidth: '500px',
              height: '6px',
              background: '#ffffff',
            }}
          />
        </div>

        {/* Bottom Text - Light weight */}
        <div
          style={{
            opacity: bottomLabelOpacity,
            transform: `translateY(${bottomLabelY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '48px',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              textTransform: 'UPPERCASE',
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            IN 2025
          </p>
        </div>
      </div>

      {/* Simple vignette */}
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
