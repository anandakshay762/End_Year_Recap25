import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene9OutroProps {
  startFrame: number;
}

export const Scene9Outro: React.FC<Scene9OutroProps> = ({ startFrame }) => {
  return (
    <GradientCard
      imageSrc="outro-bg.jpg"
      title="That was 2025."
      subtitle="The door's open. See you in 2026."
      startFrame={startFrame}
    />
  );
};
