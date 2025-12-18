import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene4SignatureProps {
  mostPopularService: string;
  startFrame: number;
}

export const Scene4Signature: React.FC<Scene4SignatureProps> = ({
  mostPopularService,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label (removed)

  // Service name - massive entrance
  const serviceScale = interpolate(
    localFrame,
    [12, 42],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const serviceOpacity = interpolate(localFrame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Context
  const contextOpacity = interpolate(localFrame, [48, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const contextY = interpolate(localFrame, [48, 68], [20, 0], {
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
        {/* SERVICE NAME */}
        <div
          style={{
            opacity: serviceOpacity,
            transform: `scale(${serviceScale})`,
            transformOrigin: 'bottom left',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-2px',
              textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
              textTransform: 'uppercase',
              maxWidth: '800px',
            }}
          >
            {mostPopularService}
          </h1>

          {/* Underline */}
          <div
            style={{
              marginTop: '16px',
              width: `${underlineWidth}%`,
              maxWidth: '400px',
              height: '6px',
              background: '#ffffff',
            }}
          />
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
              fontSize: '48px',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              textTransform: 'UPPERCASE',
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            MOST POPULAR OFFERING
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
