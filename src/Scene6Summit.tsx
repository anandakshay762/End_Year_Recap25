import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene6SummitProps {
  topPercentage: string;
  startFrame: number;
}

export const Scene6Summit: React.FC<Scene6SummitProps> = ({
  topPercentage,
  startFrame,
}) => {
  return (
    <GradientCard
      imageSrc="summit-bg.jpg"
      title="The Summit"
      subtitle="The stairs were worth it."
      badge={`Top ${topPercentage}%`}
      startFrame={startFrame}
    />
  );
};
