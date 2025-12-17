import { AbsoluteFill, useCurrentFrame, staticFile, interpolate } from 'remotion';

export const ExperimentsComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Card appears at 0.5 seconds (frame 15 at 30fps)
  const cardStartFrame = 15;

  // Scale animation using interpolate with ease-out
  const cardScale = interpolate(
    frame,
    [cardStartFrame, cardStartFrame + 20],
    [0.5, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    }
  );

  // Opacity fade in
  const cardOpacity = interpolate(
    frame,
    [cardStartFrame, cardStartFrame + 15],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cardVisible = frame >= cardStartFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Video */}
      <video
        src={staticFile('bg.mp4')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        muted
        loop
        autoPlay
      />

      {/* Card from Figma - Placeholder for now */}
      {cardVisible && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${cardScale})`,
            opacity: cardOpacity,
            width: '600px',
            height: '400px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h1 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            Figma Card Placeholder
          </h1>
        </div>
      )}
    </AbsoluteFill>
  );
};
