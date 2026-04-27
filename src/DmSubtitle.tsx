import React, { CSSProperties } from 'react';
import { staticFile } from 'remotion';

interface DmSubtitleProps {
  text: string;
  style?: CSSProperties;
}

export const DmSubtitle: React.FC<DmSubtitleProps> = ({ text, style }) => {
  const bannerStyle: CSSProperties = {
    position: 'relative',
    width: '864px',
    height: '211px',
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '30px 40px',
    ...style,
  };

  const textStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '50px',
    fontWeight: 400,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    width: '100%',
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
      <div style={bannerStyle} data-node-id="174:540">
        <p style={textStyle} data-node-id="174:536">
          {text}
        </p>
      </div>
    </>
  );
};
