import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene7StarsProps {
  rating: string;
  startFrame: number;
}

export const Scene7Stars: React.FC<Scene7StarsProps> = ({
  rating,
  startFrame,
}) => {
  return (
    <GradientCard
      imageSrc="stars-bg.jpg"
      title="The Stars"
      subtitle="The sound of promises kept."
      badge={`${rating} ★`}
      startFrame={startFrame}
    />
  );
};
