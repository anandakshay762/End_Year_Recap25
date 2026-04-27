import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { LoopSharingProps } from './types';

const IMAGE_START_FRAME = 1118; // 37.25s × 30fps
const SCALE_END_FRAME = 1235;   // 00:41.05 timecode (41s + 5 frames)

export const LoopSharingTemplate: React.FC<LoopSharingProps> = ({ profile_pic }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [IMAGE_START_FRAME, SCALE_END_FRAME],
    [1, 1.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

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
        src={staticFile('loop-launch-sharing-template.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {showImage && (
        profile_pic ? (
          <img
            src={profile_pic}
            style={{
              ...imageStyle,
              width: 500,
              height: 500,
              objectFit: 'contain',
            }}
          />
        ) : (
          <div
            style={{
              ...imageStyle,
              width: 500,
              height: 500,
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
