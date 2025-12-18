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

  // 2025 fades out before "onto the next chapter"
  const year2025FadeOut = interpolate(localFrame, [140, 160], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "onto" (small text) appears at frame 160 (absolute frame 2488)
  const ontoSmallOpacity = interpolate(localFrame, [160, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ontoSmallY = interpolate(localFrame, [160, 180], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // "the next chapter" (big/bold text) appears at frame 160 (absolute frame 2488)
  const nextChapterOpacity = interpolate(localFrame, [165, 185], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nextChapterScale = interpolate(
    localFrame,
    [165, 195],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // 2026 appears at frame 380 (absolute frame 2708)
  const year2026Opacity = interpolate(localFrame, [380, 400], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const year2026Scale = interpolate(
    localFrame,
    [380, 410],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  // Show different states
  const showThatWas = localFrame < 160;
  const showOntoNextChapter = localFrame >= 160 && localFrame < 380;
  const show2026 = localFrame >= 380;

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
        {/* Top Label - switches from "THAT WAS" to "onto" */}
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
          {(showOntoNextChapter || show2026) && (
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: '48px',
                fontWeight: 300,
                color: '#ffffff',
                margin: 0,
                textTransform: 'lowercase',
                letterSpacing: '-1px',
                opacity: ontoSmallOpacity,
                transform: `translateY(${ontoSmallY}px)`,
                position: 'absolute',
              }}
            >
              onto
            </p>
          )}
        </div>

        {/* Year/Text Container */}
        <div
          style={{
            position: 'relative',
            marginBottom: '32px',
            height: '260px',
          }}
        >
          {/* 2025 - fades out */}
          {localFrame < 160 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
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
                  opacity: year2025Opacity * year2025FadeOut,
                }}
              >
                2025
              </h1>
            </div>
          )}

          {/* "the next chapter" - appears at frame 160 (absolute 2488) */}
          {showOntoNextChapter && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: nextChapterOpacity,
                transform: `scale(${nextChapterScale})`,
                transformOrigin: 'left top',
              }}
            >
              <h1
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: '120px',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: '-4px',
                  textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
                  textTransform: 'uppercase',
                  whiteSpace: 'pre-line',
                  maxWidth: '800px',
                }}
              >
                {'the next\nchapter'}
              </h1>
            </div>
          )}

          {/* 2026 - appears at frame 380 (absolute 2708) */}
          {show2026 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `scale(${year2026Scale})`,
                transformOrigin: 'left top',
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
                  opacity: year2026Opacity,
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
