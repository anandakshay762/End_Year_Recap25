import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene0IntroProps {
  name: string;
  startFrame: number;
}

export const Scene0Intro: React.FC<Scene0IntroProps> = ({ name, startFrame }) => {
  return (
    <GradientCard
      imageSrc="intro-bg.jpg"
      title={`${name}, your 2025`}
      subtitle="A year of impact, connection, and growth."
      startFrame={startFrame}
    />
  );
};
