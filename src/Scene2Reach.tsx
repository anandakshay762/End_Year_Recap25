import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene2ReachProps {
  city1: string;
  city2: string;
  startFrame: number;
}

export const Scene2Reach: React.FC<Scene2ReachProps> = ({
  city1,
  city2,
  startFrame,
}) => {
  return (
    <GradientCard
      imageSrc="reach-bg.jpg"
      title="The Reach"
      subtitle={`From ${city1} to ${city2} — your voice carried.`}
      badge="3 cities connected"
      startFrame={startFrame}
    />
  );
};
