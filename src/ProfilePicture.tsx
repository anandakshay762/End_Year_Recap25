import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from 'remotion';

interface ProfilePictureProps {
  src: string;
  startFrame: number;
  endFrame: number;
  name?: string;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  startFrame,
  endFrame,
  name = '',
}) => {
  const frame = useCurrentFrame();

  // Only show between startFrame and endFrame
  if (frame < startFrame || frame >= endFrame) {
    return null;
  }

  // Calculate margin based on name length to prevent overlap
  // Account for text wrapping AND subtitle height
  const titleText = `${name}, your 2025`;

  // Base calculation:
  // - Subtitle is ~40px (24px font * 1.5 line-height)
  // - Title single line is ~80px (72px font * 1.1 line-height)
  // - Need ~40px spacing between image and text
  // Total base = 40 + 80 + 40 = 160px minimum

  let calculatedMargin = 225; // Base for single line title + subtitle + spacing

  if (titleText.length > 25) {
    // Text will wrap to 2 lines - need space for 2 lines + subtitle + spacing
    // ~80px + ~80px + ~40px + ~40px = 240px
    calculatedMargin = 305;
  }
  if (titleText.length > 28) {
    // Text scales down to 56px but might still wrap
    calculatedMargin = 325;
  }
  if (titleText.length > 35) {
    // Text scales down to 48px - less wrapping
    calculatedMargin = 295;
  }

  // Scale animation - pops in
  const scale = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  // Opacity fade in
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Fade out before disappearing
  const fadeOutOpacity = interpolate(
    frame,
    [endFrame - 20, endFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2),
    }
  );

  const finalOpacity = opacity * fadeOutOpacity;

  // Check if src is valid
  const hasValidSrc = src && src.trim() !== '';

  return (
    <AbsoluteFill
      style={{
        opacity: finalOpacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: `${calculatedMargin}px`,
          left: '60px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden',
          transform: `scale(${scale})`,
          border: '4px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          backgroundColor: hasValidSrc ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {hasValidSrc ? (
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          // Placeholder when no image is provided
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '36px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            ?
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
