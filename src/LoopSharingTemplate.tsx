import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { LoopSharingProps } from './types';

const IMAGE_START_FRAME = 1118; // 37.25s × 30fps
const SCALE_END_FRAME = 1235;   // 00:41.05 timecode (41s + 5 frames)

export const LoopSharingTemplate: React.FC<LoopSharingProps> = ({ profile_pic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pop entrance: spring bounces from 0 → ~1.2 → 1.0
  const popScale = spring({
    frame: frame - IMAGE_START_FRAME,
    fps,
    config: { damping: 10, stiffness: 280, mass: 0.5 },
  });

  // Gradual scale up from entry point to 41.06s
  const gradualScale = interpolate(
    frame,
    [IMAGE_START_FRAME, SCALE_END_FRAME],
    [1, 1.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const scale = popScale * gradualScale;

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center',
  };

  const showImage = frame >= IMAGE_START_FRAME && frame <= SCALE_END_FRAME;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <OffthreadVideo
        src={staticFile('loop-sharing-template.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {showImage && (
        profile_pic ? (
          <img
            src={profile_pic}
            style={{
              ...imageStyle,
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div
            style={{
              ...imageStyle,
              width: 400,
              height: 400,
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '3px dashed rgba(255,255,255,0.5)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 24,
              fontFamily: 'sans-serif',
            }}
          >
            Image Placeholder
          </div>
        )
      )}
    </AbsoluteFill>
  );
};
