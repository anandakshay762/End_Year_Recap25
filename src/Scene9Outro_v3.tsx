import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene9OutroProps {
  startFrame: number;
}

export const Scene9Outro: React.FC<Scene9OutroProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "THAT WAS" label - appears first
  const labelOpacity = interpolate(localFrame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const labelY = interpolate(localFrame, [5, 25], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 2025 - appears and scales in
  const year2025Opacity = interpolate(localFrame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const year2025Scale = interpolate(
    localFrame,
    [12, 42],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // Calendar flip transition from 2025 to 2026
  // Slowed down: Starts at frame 130 (hold 2025 longer), completes by frame 160
  const flipProgress = interpolate(
    localFrame,
    [130, 160],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // 2025 flips up and fades out
  const year2025FlipRotation = interpolate(flipProgress, [0, 1], [0, -90]);
  const year2025FlipOpacity = interpolate(flipProgress, [0, 0.5], [1, 0], {
    extrapolateRight: 'clamp',
  });

  // 2026 flips down from top
  const year2026FlipRotation = interpolate(flipProgress, [0, 1], [90, 0]);
  const year2026FlipOpacity = interpolate(flipProgress, [0.5, 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  // "ONTO" label - appears during flip
  const ontoOpacity = interpolate(localFrame, [120, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ontoY = interpolate(localFrame, [120, 140], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Show "THAT WAS" before flip, "ONTO" during/after flip
  const showThatWas = localFrame < 120;
  const showOnto = localFrame >= 120;

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
        {/* Top Label - switches from "THAT WAS" to "ONTO" */}
        <div
          style={{
            marginBottom: '12px',
            position: 'relative',
            height: '60px',
          }}
        >
          {showThatWas && (
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: '48px',
                fontWeight: 300,
                color: '#ffffff',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                opacity: labelOpacity,
                transform: `translateY(${labelY}px)`,
                position: 'absolute',
                whiteSpace: 'nowrap',
              }}
            >
              THAT WAS
            </p>
          )}
          {showOnto && (
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: '48px',
                fontWeight: 300,
                color: '#ffffff',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                opacity: ontoOpacity,
                transform: `translateY(${ontoY}px)`,
                position: 'absolute',
              }}
            >
              ONTO
            </p>
          )}
        </div>

        {/* Year Container - for flip effect */}
        <div
          style={{
            position: 'relative',
            marginBottom: '32px',
            perspective: '2000px',
            height: '260px',
          }}
        >
          {/* 2025 - flips up and out */}
          {localFrame < 155 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transformOrigin: 'center bottom',
                transform: `rotateX(${year2025FlipRotation}deg)`,
                opacity: year2025Opacity * year2025FlipOpacity,
                transformStyle: 'preserve-3d',
              }}
            >
              <h1
                style={{
                  fontFamily: FONT_FAMILY,
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
            </div>
          )}

          {/* 2026 - flips down from top */}
          {localFrame >= 130 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transformOrigin: 'center bottom',
                transform: `rotateX(${year2026FlipRotation}deg)`,
                opacity: year2026FlipOpacity,
                transformStyle: 'preserve-3d',
              }}
            >
              <h1
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: '260px',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 0.8,
                  letterSpacing: '-10px',
                  textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
                }}
              >
                2026
              </h1>
            </div>
          )}
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
