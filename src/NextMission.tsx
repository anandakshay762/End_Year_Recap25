import React, { CSSProperties } from 'react';
import { staticFile } from 'remotion';

interface NextMissionProps {
  text: string;
  logoImage?: string;
  style?: CSSProperties;
}

export const NextMission: React.FC<NextMissionProps> = ({ text, logoImage, style }) => {
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '60px',
    ...style,
  };

  const logoStyle: CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  };

  const bannerStyle: CSSProperties = {
    position: 'relative',
    width: '669px',
    height: '109px',
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 40px',
  };

  const textStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '50px',
    fontWeight: 400,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  };

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'AUTOMATA';
            src: url('${staticFile('AUTOMATA.ttf')}') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={containerStyle} data-node-id="180:566">
        {logoImage && (
          <img
            src={logoImage}
            alt="Logo"
            style={logoStyle}
          />
        )}
        <div style={bannerStyle} data-node-id="180:564">
          <p style={textStyle} data-node-id="180:565">
            {text}
          </p>
        </div>
      </div>
    </>
  );
};
