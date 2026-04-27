import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { GradientCard } from './GradientCard';

interface Scene1JourneyProps {
  firstBookingDate: string;
  totalBookings: string;
  startFrame: number;
}

export const Scene1Journey: React.FC<Scene1JourneyProps> = ({
  firstBookingDate,
  totalBookings,
  startFrame,
}) => {
  const frame = useCurrentFrame();

  // Counter animation - counts from 1 to totalBookings
  const currentCount = Math.floor(
    interpolate(
      frame,
      [startFrame + 20, startFrame + 60],
      [1, parseInt(totalBookings) || 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    )
  );

  return (
    <GradientCard
      imageSrc="journey-bg.jpg"
      title="The Journey"
      subtitle={`Your first booking — ${firstBookingDate}`}
      badge={`${currentCount} conversations that mattered`}
      startFrame={startFrame}
    />
  );
};
