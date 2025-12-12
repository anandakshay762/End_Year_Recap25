import { AbsoluteFill, useCurrentFrame, OffthreadVideo, staticFile, interpolate } from 'remotion';
import { ProfileCard } from './ProfileCard';
import { Title } from './Title';
import { Subtitle } from './Subtitle';
import { ProfileViews } from './ProfileViews';
import { ProfileViewsSubtitle } from './ProfileViewsSubtitle';
import { Bookings } from './Bookings';
import { BookingsSubtitle } from './BookingsSubtitle';
import { TimeSpent } from './TimeSpent';
import { TimeSpentSubtitle } from './TimeSpentSubtitle';
import { ServiceSubtitle } from './ServiceSubtitle';
import { Service1 } from './Service1';
import { CountrySubtitle } from './CountrySubtitle';
import { DmSubtitle } from './DmSubtitle';
import { Dm } from './Dm';
import { BadgesSubtitle } from './BadgesSubtitle';
import { Badge } from './Badge';
import { LivesMoved } from './LivesMoved';
import { RecapCompleted } from './RecapCompleted';
import { NextMission } from './NextMission';
import { CompositionProps } from './types';

export const MyComposition: React.FC<CompositionProps> = ({ name, designation, profileImage, profileViews, bookings, timeSpent, service1, service2, country1, country2, dm, badges1, badges2, badges3, badges1Icon, badges2Icon, badges3Icon, livesMoved }) => {
  const frame = useCurrentFrame();

  // Show background video for first 45 seconds (1350 frames at 30fps)
  const bgVideoOpacity = frame < 1350 ? 1 : 0;

  // Card appears at 0.5 seconds (frame 15 at 30fps)
  const cardStartFrame = 15;
  const cardEndFrame = 95;
  const cardVisible = frame >= cardStartFrame && frame < cardEndFrame;

  // Pop-in animation with ease-out (30 frames - slower)
  const popInDuration = 30;

  // Scale animation - starts from 0.5 and pops to 1 with ease-out
  const cardScale = interpolate(
    frame,
    [cardStartFrame, cardStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  // Opacity fade in (20 frames - slower)
  const cardOpacity = interpolate(
    frame,
    [cardStartFrame, cardStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Fade out before disappearing (12 frames - slower)
  const fadeOutDuration = 12;
  const fadeOutStart = cardEndFrame - fadeOutDuration;
  const cardFadeOut = interpolate(
    frame,
    [fadeOutStart, cardEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  // Combined opacity
  const finalOpacity = cardOpacity * cardFadeOut;

  // Stat card appears at frame 137
  const statStartFrame = 137;
  const statEndFrame = 217; // Display for 80 frames (same duration as first scene)
  const statVisible = frame >= statStartFrame && frame < statEndFrame;

  // Stat card animations
  const statScale = interpolate(
    frame,
    [statStartFrame, statStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const statOpacity = interpolate(
    frame,
    [statStartFrame, statStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const statFadeOutStart = statEndFrame - fadeOutDuration;
  const statFadeOut = interpolate(
    frame,
    [statFadeOutStart, statEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const statFinalOpacity = statOpacity * statFadeOut;

  // Bookings card appears at frame 265
  const bookingsStartFrame = 265;
  const bookingsEndFrame = 345; // Display for 80 frames (same duration)
  const bookingsVisible = frame >= bookingsStartFrame && frame < bookingsEndFrame;

  // Bookings animations
  const bookingsScale = interpolate(
    frame,
    [bookingsStartFrame, bookingsStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const bookingsOpacity = interpolate(
    frame,
    [bookingsStartFrame, bookingsStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const bookingsFadeOutStart = bookingsEndFrame - fadeOutDuration;
  const bookingsFadeOut = interpolate(
    frame,
    [bookingsFadeOutStart, bookingsEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const bookingsFinalOpacity = bookingsOpacity * bookingsFadeOut;

  // TimeSpent card appears at frame 442
  const timeSpentStartFrame = 442;
  const timeSpentEndFrame = 522; // Display for 80 frames
  const timeSpentVisible = frame >= timeSpentStartFrame && frame < timeSpentEndFrame;

  // TimeSpent animations
  const timeSpentScale = interpolate(
    frame,
    [timeSpentStartFrame, timeSpentStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const timeSpentOpacity = interpolate(
    frame,
    [timeSpentStartFrame, timeSpentStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const timeSpentFadeOutStart = timeSpentEndFrame - fadeOutDuration;
  const timeSpentFadeOut = interpolate(
    frame,
    [timeSpentFadeOutStart, timeSpentEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const timeSpentFinalOpacity = timeSpentOpacity * timeSpentFadeOut;

  // Services scene starts at frame 528
  const servicesStartFrame = 528;
  const servicesEndFrame = 690; // Display for 162 frames
  const servicesVisible = frame >= servicesStartFrame && frame < servicesEndFrame;

  // Services animations
  const servicesScale = interpolate(
    frame,
    [servicesStartFrame, servicesStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const servicesOpacity = interpolate(
    frame,
    [servicesStartFrame, servicesStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const servicesFadeOutStart = servicesEndFrame - fadeOutDuration;
  const servicesFadeOut = interpolate(
    frame,
    [servicesFadeOutStart, servicesEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const servicesFinalOpacity = servicesOpacity * servicesFadeOut;

  // Countries scene starts at frame 700
  const countriesStartFrame = 700;
  const countriesEndFrame = 762; // Display for 62 frames
  const countriesVisible = frame >= countriesStartFrame && frame < countriesEndFrame;

  // Countries animations
  const countriesScale = interpolate(
    frame,
    [countriesStartFrame, countriesStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const countriesOpacity = interpolate(
    frame,
    [countriesStartFrame, countriesStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const countriesFadeOutStart = countriesEndFrame - fadeOutDuration;
  const countriesFadeOut = interpolate(
    frame,
    [countriesFadeOutStart, countriesEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const countriesFinalOpacity = countriesOpacity * countriesFadeOut;

  // DMs scene starts at frame 763
  const dmsStartFrame = 763;
  const dmsEndFrame = 850; // Display for 87 frames
  const dmsVisible = frame >= dmsStartFrame && frame < dmsEndFrame;

  // DMs animations
  const dmsScale = interpolate(
    frame,
    [dmsStartFrame, dmsStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const dmsOpacity = interpolate(
    frame,
    [dmsStartFrame, dmsStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const dmsFadeOutStart = dmsEndFrame - fadeOutDuration;
  const dmsFadeOut = interpolate(
    frame,
    [dmsFadeOutStart, dmsEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const dmsFinalOpacity = dmsOpacity * dmsFadeOut;

  // Badges scene starts at frame 866
  const badgesStartFrame = 866;
  const badgesEndFrame = 950; // Display for 84 frames
  const badgesVisible = frame >= badgesStartFrame && frame < badgesEndFrame;

  // Badges animations
  const badgesScale = interpolate(
    frame,
    [badgesStartFrame, badgesStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const badgesOpacity = interpolate(
    frame,
    [badgesStartFrame, badgesStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const badgesFadeOutStart = badgesEndFrame - fadeOutDuration;
  const badgesFadeOut = interpolate(
    frame,
    [badgesFadeOutStart, badgesEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const badgesFinalOpacity = badgesOpacity * badgesFadeOut;

  // Lives moved scene starts at frame 1031
  const livesMovedStartFrame = 1031;
  const livesMovedEndFrame = 1116; // Display for 85 frames
  const livesMovedVisible = frame >= livesMovedStartFrame && frame < livesMovedEndFrame;

  // Lives moved animations
  const livesMovedScale = interpolate(
    frame,
    [livesMovedStartFrame, livesMovedStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const livesMovedOpacity = interpolate(
    frame,
    [livesMovedStartFrame, livesMovedStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const livesMovedFadeOutStart = livesMovedEndFrame - fadeOutDuration;
  const livesMovedFadeOut = interpolate(
    frame,
    [livesMovedFadeOutStart, livesMovedEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const livesMovedFinalOpacity = livesMovedOpacity * livesMovedFadeOut;

  // Recap completed scene starts at frame 1175
  const recapCompletedStartFrame = 1175;
  const recapCompletedEndFrame = 1260; // Display for 85 frames
  const recapCompletedVisible = frame >= recapCompletedStartFrame && frame < recapCompletedEndFrame;

  // Recap completed animations
  const recapCompletedScale = interpolate(
    frame,
    [recapCompletedStartFrame, recapCompletedStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const recapCompletedOpacity = interpolate(
    frame,
    [recapCompletedStartFrame, recapCompletedStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const recapCompletedFadeOutStart = recapCompletedEndFrame - fadeOutDuration;
  const recapCompletedFadeOut = interpolate(
    frame,
    [recapCompletedFadeOutStart, recapCompletedEndFrame],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => Math.pow(t, 2), // ease-in for exit
    }
  );

  const recapCompletedFinalOpacity = recapCompletedOpacity * recapCompletedFadeOut;

  // Next mission scene starts at frame 1298
  const nextMissionStartFrame = 1298;
  const nextMissionEndFrame = 1350; // Display until end of video
  const nextMissionVisible = frame >= nextMissionStartFrame && frame < nextMissionEndFrame;

  // Next mission animations
  const nextMissionScale = interpolate(
    frame,
    [nextMissionStartFrame, nextMissionStartFrame + popInDuration],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  const nextMissionOpacity = interpolate(
    frame,
    [nextMissionStartFrame, nextMissionStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // No fade out for next mission - it stays until the end
  const nextMissionFinalOpacity = nextMissionOpacity;

  return (
    <AbsoluteFill>
      {/* Background Video - plays for 45 seconds */}
      {frame < 1350 && (
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

      {/* Title and Profile Card - appear at 0.5s */}
      {cardVisible && (
        <AbsoluteFill>
          {/* Title at the top */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${cardScale})`,
              opacity: finalOpacity,
            }}
          >
            <Title
              text="You were already on a journey. 2025 just took you further."
            />
          </div>

          {/* Profile Card centered */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${cardScale})`,
              opacity: finalOpacity,
            }}
          >
            <ProfileCard
              name={name}
              title={designation}
              profileImage={staticFile(profileImage)}
              logoImage={staticFile('topmate-light.svg')}
            />
          </div>

          {/* Subtitle */}
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${cardScale})`,
              opacity: finalOpacity,
            }}
          >
            <Subtitle text="Topmate Year End Recap" />
          </div>
        </AbsoluteFill>
      )}

      {/* Profile Views and ProfileViewsSubtitle - appear at frame 137 */}
      {statVisible && (
        <AbsoluteFill>
          {/* Profile Views in upper right */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              right: '80px',
              transform: `scale(${statScale})`,
              opacity: statFinalOpacity,
            }}
          >
            <ProfileViews value={profileViews} label="Profile Views" />
          </div>

          {/* Profile Views Subtitle on the left */}
          <div
            style={{
              position: 'absolute',
              left: '80px',
              top: '330px',
              transform: `scale(${statScale})`,
              opacity: statFinalOpacity,
            }}
          >
            <ProfileViewsSubtitle text="People did not just find you. They arrived." />
          </div>
        </AbsoluteFill>
      )}

      {/* Bookings and BookingsSubtitle - appear at frame 265 */}
      {bookingsVisible && (
        <AbsoluteFill>
          {/* Bookings in upper left */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              left: '80px',
              transform: `scale(${bookingsScale})`,
              opacity: bookingsFinalOpacity,
            }}
          >
            <Bookings value={bookings} label="Bookings" />
          </div>

          {/* Bookings Subtitle at bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '80px',
              transform: `scale(${bookingsScale})`,
              opacity: bookingsFinalOpacity,
            }}
          >
            <BookingsSubtitle text="Curiosity turned into conversations." />
          </div>
        </AbsoluteFill>
      )}

      {/* TimeSpent - appears at frame 442 */}
      {timeSpentVisible && (
        <AbsoluteFill>
          {/* TimeSpentSubtitle at the top */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${timeSpentScale})`,
              opacity: timeSpentFinalOpacity,
            }}
          >
            <TimeSpentSubtitle text="Time did not just pass. You travelled through it." />
          </div>

          {/* TimeSpent on the right side, centered */}
          <div
            style={{
              position: 'absolute',
              right: '80px',
              top: '50%',
              transform: `translateY(-50%) scale(${timeSpentScale})`,
              opacity: timeSpentFinalOpacity,
            }}
          >
            <TimeSpent label="Time spent on topmate" value={timeSpent} />
          </div>
        </AbsoluteFill>
      )}

      {/* Services - appears at frame 528 */}
      {servicesVisible && (
        <AbsoluteFill>
          {/* ServiceSubtitle at the top - appears at frame 534 */}
          {frame >= 534 && (
            <div
              style={{
                position: 'absolute',
                top: '70px',
                left: '50%',
                transform: `translateX(-50%) scale(${servicesScale})`,
                opacity: servicesFinalOpacity,
              }}
            >
              <ServiceSubtitle text="Your impact did not come from one place. It came from many." />
            </div>
          )}

          {/* Service1 - popup animation */}
          <div
            style={{
              position: 'absolute',
              left: '50px',
              top: '380px',
              transform: `scale(${servicesScale})`,
              opacity: servicesFinalOpacity,
            }}
          >
            <Service1 text={service1} />
          </div>

          {/* Service2 - popup animation, right side 150px below service1 */}
          <div
            style={{
              position: 'absolute',
              right: '100px',
              top: '505px',
              transform: `scale(${servicesScale})`,
              opacity: servicesFinalOpacity,
            }}
          >
            <Service1 text={service2} />
          </div>
        </AbsoluteFill>
      )}

      {/* Countries - appears at frame 700 */}
      {countriesVisible && (
        <AbsoluteFill>
          {/* CountrySubtitle at the top */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${countriesScale})`,
              opacity: countriesFinalOpacity,
            }}
          >
            <CountrySubtitle text="Your impact was not local. It was widespread." />
          </div>

          {/* Country1 - popup animation */}
          <div
            style={{
              position: 'absolute',
              left: '50px',
              top: '380px',
              transform: `scale(${countriesScale})`,
              opacity: countriesFinalOpacity,
            }}
          >
            <Service1 text={country1} />
          </div>

          {/* Country2 - popup animation, right side */}
          <div
            style={{
              position: 'absolute',
              right: '100px',
              top: '505px',
              transform: `scale(${countriesScale})`,
              opacity: countriesFinalOpacity,
            }}
          >
            <Service1 text={country2} />
          </div>
        </AbsoluteFill>
      )}

      {/* DMs - appears at frame 763 */}
      {dmsVisible && (
        <AbsoluteFill>
          {/* DmSubtitle at the top */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${dmsScale})`,
              opacity: dmsFinalOpacity,
            }}
          >
            <DmSubtitle text="Messages started coming in. From everywhere." />
          </div>

          {/* Dm card on the right side */}
          <div
            style={{
              position: 'absolute',
              right: '150px',
              top: '300px',
              transform: `scale(${dmsScale})`,
              opacity: dmsFinalOpacity,
            }}
          >
            <Dm value={dm} label="Priority DMs" />
          </div>
        </AbsoluteFill>
      )}

      {/* Badges - appears at frame 866 */}
      {badgesVisible && (
        <AbsoluteFill>
          {/* BadgesSubtitle at the top left */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '100px',
              transform: `scale(${badgesScale})`,
              opacity: badgesFinalOpacity,
            }}
          >
            <BadgesSubtitle text="Along the way, you earned your place." />
          </div>

          {/* Badge 1 - left side */}
          <div
            style={{
              position: 'absolute',
              left: '250px',
              top: '350px',
              transform: `scale(${badgesScale})`,
              opacity: badgesFinalOpacity,
            }}
          >
            <Badge text={badges1} icon={badges1Icon} offset={0} />
          </div>

          {/* Badge 2 - top right */}
          <div
            style={{
              position: 'absolute',
              right: '150px',
              top: '320px',
              transform: `scale(${badgesScale})`,
              opacity: badgesFinalOpacity,
            }}
          >
            <Badge text={badges2} icon={badges2Icon} offset={20} />
          </div>

          {/* Badge 3 - center bottom, shifted 50px right and 25px down */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% + 50px)',
              top: '545px',
              transform: `translateX(-50%) scale(${badgesScale})`,
              opacity: badgesFinalOpacity,
            }}
          >
            <Badge text={badges3} icon={badges3Icon} offset={40} />
          </div>
        </AbsoluteFill>
      )}

      {/* Lives Moved - appears at frame 1031 */}
      {livesMovedVisible && (
        <AbsoluteFill>
          {/* LivesMoved banner at the top center */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${livesMovedScale})`,
              opacity: livesMovedFinalOpacity,
            }}
          >
            <LivesMoved text={`${livesMoved} lives moved forward because of you.`} />
          </div>
        </AbsoluteFill>
      )}

      {/* Recap Completed - appears at frame 1175 */}
      {recapCompletedVisible && (
        <AbsoluteFill>
          {/* RecapCompleted banner at the top center */}
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: `translateX(-50%) scale(${recapCompletedScale})`,
              opacity: recapCompletedFinalOpacity,
            }}
          >
            <RecapCompleted text="Your 2025 Recap is complete" />
          </div>
        </AbsoluteFill>
      )}

      {/* Next Mission - appears at frame 1304 */}
      {nextMissionVisible && (
        <AbsoluteFill>
          {/* NextMission centered on screen */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${nextMissionScale})`,
              opacity: nextMissionFinalOpacity,
            }}
          >
            <NextMission
              text="Next mission. 2026"
              logoImage={staticFile('topmate.svg')}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
