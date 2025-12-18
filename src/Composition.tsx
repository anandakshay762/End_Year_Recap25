import React from 'react';
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, Audio, staticFile } from 'remotion';
// V3 Redesigned scenes - BRUTALIST BLACK & WHITE
import { Scene0Intro } from './Scene0Intro_v3';
import { Scene1Journey } from './Scene1Journey_v3';
import { Scene2Reach } from './Scene2Reach_v3';
import { Scene3Peak } from './Scene3Peak_v3';
import { Scene4Signature } from './Scene4Signature_v3';
import { Scene5Voices } from './Scene5Voices_v3';
import { Scene6Summit } from './Scene6Summit_v3';
import { Scene7Stars } from './Scene7Stars_v3';
import { Scene9Outro } from './Scene9Outro_v3';
import { ProfilePicture } from './ProfilePicture';
import { CompositionProps } from './types';

export const MyComposition: React.FC<CompositionProps> = ({
  Profile_pic,
  name,
  totalBookings,
  city1,
  city2,
  uniqueCitiesCount,
  mostBookedMonth,
  mostPopularService,
  testimonial,
  testimonialGiverName,
  topPercentage,
  rating,
}) => {
  const frame = useCurrentFrame();

  // Background video plays for the entire duration (2910 frames)
  const bgVideoOpacity = frame < 2910 ? 1 : 0;

  // Scene timing - Scene 8 removed, outro extended to maintain 2910 frame duration
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
    outro: { start: 2328, end: 2910 },                // 582 frames (2x duration for flip animation)
  };


  return (
    <AbsoluteFill>
      {/* Background Video */}
      {frame < 2910 && (
        <OffthreadVideo
          src={staticFile('bg_1_fixed.mp4')}
          muted
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: bgVideoOpacity,
          }}
        />
      )}

      {/* Audio Track */}
      <Audio
        src={staticFile('audi01_clean.mp3')}
        volume={1}
      />

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

      {/* Profile Picture - Bottom Right Throughout Video */}
      <ProfilePicture src={Profile_pic} startFrame={13} endFrame={2910} name={name} />

      {/* Scene 0: Intro - V3 BRUTALIST */}
      {frame >= scenes.intro.start && frame < scenes.intro.end && (
        <Scene0Intro name={name} startFrame={scenes.intro.start} />
      )}

      {/* Scene 2: The Journey - V3 BRUTALIST */}
      {frame >= scenes.journey.start && frame < scenes.journey.end && (
        <Scene1Journey
          totalBookings={totalBookings}
          startFrame={scenes.journey.start}
        />
      )}

      {/* Scene 3: The Reach - V3 BRUTALIST */}
      {frame >= scenes.reach.start && frame < scenes.reach.end && (
        <Scene2Reach
          city1={city1}
          city2={city2}
          uniqueCitiesCount={uniqueCitiesCount}
          startFrame={scenes.reach.start}
        />
      )}

      {/* Scene 3: The Peak - V3 BRUTALIST */}
      {frame >= scenes.peak.start && frame < scenes.peak.end && (
        <Scene3Peak
          mostBookedMonth={mostBookedMonth}
          startFrame={scenes.peak.start}
        />
      )}

      {/* Scene 4: The Signature - V3 BRUTALIST */}
      {frame >= scenes.signature.start && frame < scenes.signature.end && (
        <Scene4Signature
          mostPopularService={mostPopularService}
          startFrame={scenes.signature.start}
        />
      )}

      {/* Scene 5: The Voices - V3 BRUTALIST */}
      {frame >= scenes.voices.start && frame < scenes.voices.end && (
        <Scene5Voices
          testimonial={testimonial}
          testimonialGiverName={testimonialGiverName}
          startFrame={scenes.voices.start}
        />
      )}

      {/* Scene 6: The Summit - V3 BRUTALIST */}
      {frame >= scenes.summit.start && frame < scenes.summit.end && (
        <Scene6Summit
          topPercentage={topPercentage}
          startFrame={scenes.summit.start}
        />
      )}

      {/* Scene 7: The Stars - V3 BRUTALIST */}
      {frame >= scenes.stars.start && frame < scenes.stars.end && (
        <Scene7Stars
          rating={rating}
          startFrame={scenes.stars.start}
        />
      )}

      {/* Scene 8: Outro - Calendar Flip 2025 -> 2026 */}
      {frame >= scenes.outro.start && frame < scenes.outro.end && (
        <Scene9Outro startFrame={scenes.outro.start} />
      )}
    </AbsoluteFill>
  );
};
