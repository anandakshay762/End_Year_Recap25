import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface Scene5VoicesProps {
  testimonial: string;
  startFrame: number;
}

export const Scene5Voices: React.FC<Scene5VoicesProps> = ({
  testimonial,
  startFrame,
}) => {
  const frame = useCurrentFrame();

  const contentDelay = 10;

  // Opacity fade in
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Title animation
  const titleY = interpolate(
    frame,
    [startFrame + contentDelay, startFrame + contentDelay + 20],
    [40, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3),
    }
  );

  const titleOpacity = interpolate(
    frame,
    [startFrame + contentDelay, startFrame + contentDelay + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Quote slide up (delayed)
  const quoteY = interpolate(
    frame,
    [startFrame + contentDelay + 10, startFrame + contentDelay + 30],
    [30, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3),
    }
  );

  const quoteOpacity = interpolate(
    frame,
    [startFrame + contentDelay + 10, startFrame + contentDelay + 30],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: '60px',
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          marginBottom: '20px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '72px',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          The Voices
        </h1>
      </div>

      {/* Testimonial Quote */}
      <div
        style={{
          width: '100%',
          maxWidth: '85%',
          transform: `translateY(${quoteY}px)`,
          opacity: quoteOpacity,
        }}
      >
        {/* Quote Mark */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: testimonial.length > 200 ? '80px' : '100px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.25)',
            lineHeight: 1,
            marginBottom: testimonial.length > 200 ? '-15px' : '-20px',
          }}
        >
          "
        </div>

        {/* Testimonial Text */}
        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: testimonial.length > 250 ? '28px' : testimonial.length > 180 ? '32px' : '36px',
            fontWeight: '400',
            color: 'white',
            margin: 0,
            lineHeight: testimonial.length > 200 ? 1.4 : 1.5,
            fontStyle: 'italic',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {testimonial}
        </p>
      </div>
    </AbsoluteFill>
  );
};
