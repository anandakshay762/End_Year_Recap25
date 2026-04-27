import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene8UniverseProps {
  name: string;
  startFrame: number;
}

export const Scene8Universe: React.FC<Scene8UniverseProps> = ({
  name,
  startFrame,
}) => {
  return (
    <GradientCard
      imageSrc="universe-bg.jpg"
      title="The Universe"
      subtitle={`Welcome to ${name} verse`}
      startFrame={startFrame}
    />
  );
};
