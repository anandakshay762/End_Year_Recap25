import React, { CSSProperties } from 'react';
import { staticFile } from 'remotion';

interface RatingsProps {
  rating: string;
  style?: CSSProperties;
}

export const Ratings: React.FC<RatingsProps> = ({ rating, style }) => {
  const bannerStyle: CSSProperties = {
    position: 'relative',
    width: '892px',
    height: '211px',
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
    width: '100%',
  };

  const ratingStyle: CSSProperties = {
    fontSize: '80px',
    fontWeight: 700,
    color: '#ffffff',
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
      <div style={bannerStyle} data-node-id="179:561">
        <p style={textStyle} data-node-id="179:560">
          Excellence confirmed: <span style={ratingStyle}>{rating}</span> rating
        </p>
      </div>
    </>
  );
};
