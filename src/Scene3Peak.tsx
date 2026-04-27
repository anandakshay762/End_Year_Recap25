import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene3PeakProps {
  mostBookedMonth: string;
  startFrame: number;
}

export const Scene3Peak: React.FC<Scene3PeakProps> = ({
  mostBookedMonth,
  startFrame,
}) => {
  return (
    <GradientCard
      imageSrc="peak-bg.jpg"
      title="The Peak"
      subtitle={`${mostBookedMonth} hit different.`}
      startFrame={startFrame}
    />
  );
};
