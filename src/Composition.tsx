import React from 'react';
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, staticFile, interpolate } from 'remotion';
import { Scene0Intro } from './Scene0Intro';
import { Scene1Journey } from './Scene1Journey';
import { Scene2Reach } from './Scene2Reach';
import { Scene3Peak } from './Scene3Peak';
import { Scene4Signature } from './Scene4Signature';
import { Scene5Voices } from './Scene5Voices';
import { Scene6Summit } from './Scene6Summit';
import { Scene7Stars } from './Scene7Stars';
import { Scene8Universe } from './Scene8Universe';
import { Scene9Outro } from './Scene9Outro';
import { ProfilePicture } from './ProfilePicture';
import { CompositionProps } from './types';

export const MyComposition: React.FC<CompositionProps> = ({
  Profile_pic,
  name,
  firstBookingDate,
  totalBookings,
  city1,
  city2,
  mostBookedMonth,
  mostPopularService,
  testimonial,
  topPercentage,
  rating,
}) => {
  const frame = useCurrentFrame();

  // Background video plays for the entire duration
  const bgVideoOpacity = frame < 2910 ? 1 : 0;

  // Scene timing - equal duration for all scenes (291 frames each = ~9.7 seconds)
  const sceneDuration = 291;
  const scenes = {
    intro: { start: 0, end: 291 },                    // 291 frames
    journey: { start: 291, end: 582 },                // 291 frames
    reach: { start: 582, end: 873 },                  // 291 frames
    peak: { start: 873, end: 1164 },                  // 291 frames
    signature: { start: 1164, end: 1455 },            // 291 frames
    voices: { start: 1455, end: 1746 },               // 291 frames
    summit: { start: 1746, end: 2037 },               // 291 frames
    stars: { start: 2037, end: 2328 },                // 291 frames
    universe: { start: 2328, end: 2619 },             // 291 frames
    outro: { start: 2619, end: 2910 },                // 291 frames
  };

  // Fade out duration for all scenes
  const fadeOutDuration = 15;

  // Helper function to calculate scene opacity with fade in/out
  const getSceneOpacity = (startFrame: number, endFrame: number) => {
    if (frame < startFrame || frame >= endFrame) return 0;

    // Fade in
    const fadeInOpacity = interpolate(
      frame,
      [startFrame, startFrame + 20],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );

    // Fade out
    const fadeOutOpacity = interpolate(
      frame,
      [endFrame - fadeOutDuration, endFrame],
      [1, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: (t) => Math.pow(t, 2),
      }
    );

    return Math.min(fadeInOpacity, fadeOutOpacity);
  };

  return (
    <AbsoluteFill>
      {/* Background Video */}
      {frame < 2910 && (
        <OffthreadVideo
          src={staticFile('bg_1.mp4')}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: bgVideoOpacity,
          }}
        />
      )}

      {/* Black Gradient Overlay - Fades from bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '65%',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 35%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Profile Picture - Shows from frame 13 to 289 */}
      <ProfilePicture src={Profile_pic} startFrame={13} endFrame={289} name={name} />

      {/* Scene 0: Intro */}
      {frame >= scenes.intro.start && frame < scenes.intro.end && (
        <div style={{ opacity: getSceneOpacity(scenes.intro.start, scenes.intro.end) }}>
          <Scene0Intro name={name} startFrame={scenes.intro.start} />
        </div>
      )}

      {/* Scene 1: The Journey */}
      {frame >= scenes.journey.start && frame < scenes.journey.end && (
        <div style={{ opacity: getSceneOpacity(scenes.journey.start, scenes.journey.end) }}>
          <Scene1Journey
            firstBookingDate={firstBookingDate}
            totalBookings={totalBookings}
            startFrame={scenes.journey.start}
          />
        </div>
      )}

      {/* Scene 2: The Reach */}
      {frame >= scenes.reach.start && frame < scenes.reach.end && (
        <div style={{ opacity: getSceneOpacity(scenes.reach.start, scenes.reach.end) }}>
          <Scene2Reach
            city1={city1}
            city2={city2}
            startFrame={scenes.reach.start}
          />
        </div>
      )}

      {/* Scene 3: The Peak */}
      {frame >= scenes.peak.start && frame < scenes.peak.end && (
        <div style={{ opacity: getSceneOpacity(scenes.peak.start, scenes.peak.end) }}>
          <Scene3Peak
            mostBookedMonth={mostBookedMonth}
            startFrame={scenes.peak.start}
          />
        </div>
      )}

      {/* Scene 4: The Signature */}
      {frame >= scenes.signature.start && frame < scenes.signature.end && (
        <div style={{ opacity: getSceneOpacity(scenes.signature.start, scenes.signature.end) }}>
          <Scene4Signature
            mostPopularService={mostPopularService}
            startFrame={scenes.signature.start}
          />
        </div>
      )}

      {/* Scene 5: The Voices */}
      {frame >= scenes.voices.start && frame < scenes.voices.end && (
        <div style={{ opacity: getSceneOpacity(scenes.voices.start, scenes.voices.end) }}>
          <Scene5Voices
            testimonial={testimonial}
            startFrame={scenes.voices.start}
          />
        </div>
      )}

      {/* Scene 6: The Summit */}
      {frame >= scenes.summit.start && frame < scenes.summit.end && (
        <div style={{ opacity: getSceneOpacity(scenes.summit.start, scenes.summit.end) }}>
          <Scene6Summit
            topPercentage={topPercentage}
            startFrame={scenes.summit.start}
          />
        </div>
      )}

      {/* Scene 7: The Stars */}
      {frame >= scenes.stars.start && frame < scenes.stars.end && (
        <div style={{ opacity: getSceneOpacity(scenes.stars.start, scenes.stars.end) }}>
          <Scene7Stars
            rating={rating}
            startFrame={scenes.stars.start}
          />
        </div>
      )}

      {/* Scene 8: The Universe */}
      {frame >= scenes.universe.start && frame < scenes.universe.end && (
        <div style={{ opacity: getSceneOpacity(scenes.universe.start, scenes.universe.end) }}>
          <Scene8Universe
            name={name}
            startFrame={scenes.universe.start}
          />
        </div>
      )}

      {/* Scene 9: Outro */}
      {frame >= scenes.outro.start && frame < scenes.outro.end && (
        <div style={{ opacity: getSceneOpacity(scenes.outro.start, scenes.outro.end) }}>
          <Scene9Outro startFrame={scenes.outro.start} />
        </div>
      )}
    </AbsoluteFill>
  );
};
