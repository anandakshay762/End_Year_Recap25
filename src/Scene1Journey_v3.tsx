import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { FONT_FAMILY } from './fonts';

interface Scene1JourneyProps {
  totalBookings: string;
  startFrame: number;
}

export const Scene1Journey: React.FC<Scene1JourneyProps> = ({
  totalBookings,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const bookingsValue = parseInt(totalBookings) || 247;

  // Responsive font size based on digit count
  const digitCount = totalBookings.replace(/,/g, '').length;
  const numberFontSize = digitCount >= 7 ? '140px' 
                       : digitCount === 6 ? '180px'
                       : '260px';
  const sceneDuration = 291; // Total scene duration

  // Scene fade
  const sceneOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Booking counter - animates until last 1.5 seconds (45 frames at 30fps)
  const counterEndFrame = sceneDuration - 45;
  const animatedBookings = Math.floor(
    interpolate(
      localFrame,
      [12, counterEndFrame],
      [0, bookingsValue],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      }
    )
  );

  // Scale
  const numberScale = interpolate(
    localFrame,
    [12, 42],
    [1.4, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const numberOpacity = interpolate(localFrame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Top label
  const topLabelOpacity = interpolate(localFrame, [5, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const topLabelY = interpolate(localFrame, [5, 25], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Month cycling animation
  const animatedMonth = Math.floor(
    interpolate(
      localFrame,
      [48, counterEndFrame],
      [0, 11],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.linear,
      }
    )
  );

  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  const currentMonth = months[animatedMonth];

  // Month text opacity
  const monthOpacity = interpolate(localFrame, [48, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const monthY = interpolate(localFrame, [48, 68], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Underline
  const underlineWidth = interpolate(localFrame, [42, 58], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        {/* Top Text - Light weight */}
        <div
          style={{
            opacity: topLabelOpacity,
            transform: `translateY(${topLabelY}px)`,
            marginBottom: '12px',
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '48px',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-1px',
            }}
          >
            TOTAL BOOKINGS
          </p>
        </div>

        {/* MASSIVE NUMBER */}
        <div
          style={{
            opacity: numberOpacity,
            transform: `scale(${numberScale})`,
            transformOrigin: 'bottom left',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: numberFontSize,
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 0.8,
              letterSpacing: '-10px',
              textShadow: '0 10px 60px rgba(0, 0, 0, 1)',
            }}
          >
            {animatedBookings}
          </h1>

          {/* Underline */}
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: `${underlineWidth}%`,
              maxWidth: '500px',
              height: '6px',
              background: '#ffffff',
            }}
          />
        </div>

        {/* Animated Month Counter */}
        <div
          style={{
            opacity: monthOpacity,
            transform: `translateY(${monthY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: '48px',
              fontWeight: 300,
              color: '#ffffff',
              margin: 0,
              textTransform: 'UPPERCASE',
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            {currentMonth}
          </p>
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
