import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

interface GradientCardProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  badge?: string;
  startFrame: number;
  animationDuration?: number;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  imageSrc,
  title,
  subtitle,
  badge,
  startFrame,
  animationDuration = 30,
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

  // Title slide up animation
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

  // Subtitle slide up animation (delayed)
  const subtitleY = interpolate(
    frame,
    [startFrame + contentDelay + 10, startFrame + contentDelay + 30],
    [30, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3),
    }
  );

  const subtitleOpacity = interpolate(
    frame,
    [startFrame + contentDelay + 10, startFrame + contentDelay + 30],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Badge slide in from left (delayed more)
  const badgeX = interpolate(
    frame,
    [startFrame + contentDelay + 20, startFrame + contentDelay + 40],
    [-20, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3),
    }
  );

  const badgeOpacity = interpolate(
    frame,
    [startFrame + contentDelay + 20, startFrame + contentDelay + 40],
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
          marginBottom: subtitle ? '20px' : badge ? '32px' : 0,
          maxWidth: '100%',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: title.length > 35 ? '48px' : title.length > 28 ? '56px' : '72px',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleOpacity,
            marginBottom: badge ? '32px' : 0,
            maxWidth: '90%',
          }}
        >
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '32px',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              lineHeight: 1.5,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {subtitle}
          </p>
        </div>
      )}

      {/* Glassmorphic Badge */}
      {badge && (
        <div
          style={{
            transform: `translateX(${badgeX}px)`,
            opacity: badgeOpacity,
          }}
        >
          <div
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '16px 32px',
              borderRadius: '100px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              display: 'inline-block',
            }}
          >
            {badge}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
