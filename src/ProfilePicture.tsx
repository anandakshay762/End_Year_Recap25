import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from 'remotion';
import { FONT_FAMILY } from './fonts';

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

  // Check if src is valid
  const hasValidSrc = src && src.trim() !== '';

  return (
    <AbsoluteFill
      style={{
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '80px',
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
              fontFamily: FONT_FAMILY,
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
