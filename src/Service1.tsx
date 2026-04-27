import React, { CSSProperties } from 'react';
import { staticFile } from 'remotion';

interface Service1Props {
  text: string;
  style?: CSSProperties;
}

export const Service1: React.FC<Service1Props> = ({ text, style }) => {
  const pillStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '320px',
    height: '70px',
    backdropFilter: 'blur(11.618px)',
    WebkitBackdropFilter: 'blur(11.618px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '3px solid #2366a0',
    borderRadius: '35px',
    boxShadow: 'inset 0px 0px 11.39px 0px rgba(255, 255, 255, 0.51)',
    padding: '10px 40px',
    ...style,
  };

  const textStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '32px',
    fontWeight: 400,
    color: '#ffffff',
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
    margin: 0,
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
      <div style={pillStyle} data-node-id="171:529">
        <p style={textStyle} data-node-id="169:520">
          {text}
        </p>
      </div>
    </>
  );
};
