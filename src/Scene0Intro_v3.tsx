import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene0IntroProps {
  name: string;
  startFrame: number;
}

export const Scene0Intro: React.FC<Scene0IntroProps> = ({
  name,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Name text - appears first
  const nameOpacity = interpolate(localFrame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nameY = interpolate(localFrame, [5, 25], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Year number - massive entrance
  const yearScale = interpolate(
    localFrame,
    [15, 45],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const yearOpacity = interpolate(localFrame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Topmate text - appears last
  const topmateOpacity = interpolate(localFrame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const topmateY = interpolate(localFrame, [55, 75], [20, 0], {
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
        {/* Name - Light weight */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
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
            {name}'S
          </p>
        </div>

        {/* MASSIVE YEAR NUMBER */}
        <div
          style={{
            opacity: yearOpacity,
            transform: `scale(${yearScale})`,
            transformOrigin: 'bottom left',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <h1
            style={{
              fontFamily: '"SF Mono", "JetBrains Mono", "Roboto Mono", monospace',
              fontSize: '260px',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 0.8,
              letterSpacing: '-10px',
              textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
            }}
          >
            2025
          </h1>

          {/* Underline */}
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: `${underlineWidth}%`,
              maxWidth: '600px',
              height: '6px',
              background: '#ffffff',
            }}
          />
        </div>

        {/* Topmate.io Recap - Light weight */}
        <div
          style={{
            opacity: topmateOpacity,
            transform: `translateY(${topmateY}px)`,
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
            }}
          >
            TOPMATE.IO RECAP
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
