import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene3PeakProps {
  mostBookedMonth: string;
  startFrame: number;
}

export const Scene3Peak: React.FC<Scene3PeakProps> = ({
  mostBookedMonth,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Responsive font size based on character count
  const charCount = mostBookedMonth.length;
  const monthFontSize = charCount > 8 ? '140px' : '180px';

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label (removed)

  // Month - massive entrance
  const monthScale = interpolate(
    localFrame,
    [12, 42],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const monthOpacity = interpolate(localFrame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Context - "MOST BOOKED MONTH" text animation ends at frame 1032 (local frame 159)
  const contextAnimationEnd = 159;
  const contextOpacity = interpolate(localFrame, [48, contextAnimationEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  const contextY = interpolate(localFrame, [48, contextAnimationEnd], [20, 0], {
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
        {/* MASSIVE MONTH */}
        <div
          style={{
            opacity: monthOpacity,
            transform: `scale(${monthScale})`,
            transformOrigin: 'bottom left',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: monthFontSize,
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 0.8,
              letterSpacing: '-8px',
              textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
              textTransform: 'uppercase',
            }}
          >
            {mostBookedMonth}
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
            MOST BOOKED MONTH
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
