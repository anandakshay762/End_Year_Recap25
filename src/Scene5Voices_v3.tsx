import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene5VoicesProps {
  testimonial: string;
  testimonialGiverName: string;
  startFrame: number;
}

export const Scene5Voices: React.FC<Scene5VoicesProps> = ({
  testimonial,
  testimonialGiverName,
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

  // Quote mark
  const quoteOpacity = interpolate(localFrame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const quoteScale = interpolate(
    localFrame,
    [15, 45],
    [1.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // Testimonial text
  const textOpacity = interpolate(localFrame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textY = interpolate(localFrame, [40, 65], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Name animation
  const nameOpacity = interpolate(localFrame, [75, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nameY = interpolate(localFrame, [75, 95], [20, 0], {
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
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '85%' }}>
        {/* Quote mark */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `scale(${quoteScale})`,
            transformOrigin: 'top left',
            marginBottom: '-20px',
          }}
        >
          <div
            style={{
              fontFamily: '"SF Mono", "JetBrains Mono", "Roboto Mono", monospace',
              fontSize: '180px',
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.15)',
              lineHeight: 1,
              margin: 0,
            }}
          >
            "
          </div>
        </div>

        {/* Testimonial */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: testimonial.length > 200 ? '32px' : testimonial.length > 150 ? '36px' : '42px',
              fontWeight: 600,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.4,
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {testimonial}
          </p>
        </div>

        {/* Testimonial Giver Name */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            marginTop: '32px',
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '32px',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-1px',
            }}
          >
            — {testimonialGiverName}
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
