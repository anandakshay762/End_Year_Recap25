import React from 'react';
import { GradientCard } from './GradientCard';

interface Scene4SignatureProps {
  mostPopularService: string;
  startFrame: number;
}

export const Scene4Signature: React.FC<Scene4SignatureProps> = ({
  mostPopularService,
  startFrame,
}) => {
  return (
    <GradientCard
      imageSrc="signature-bg.jpg"
      title="The Signature"
      subtitle={`They came for ${mostPopularService}. They stayed for you.`}
      startFrame={startFrame}
    />
  );
};
