import React, { CSSProperties } from 'react';
import { staticFile, interpolate } from 'remotion';

interface BookingsProps {
  value: string;
  label: string;
  style?: CSSProperties;
  animationProgress?: number;
}

export const Bookings: React.FC<BookingsProps> = ({ value, label, style, animationProgress = 1 }) => {
  // Parse the numeric value from the string (remove commas)
  const numericValue = parseInt(value.replace(/,/g, '')) || 0;

  // Animate the number from 0 to the target value
  const animatedValue = Math.floor(interpolate(
    animationProgress,
    [0, 1],
    [0, numericValue],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  ));

  // Format the number with commas
  const displayValue = animatedValue.toLocaleString();
  const cardStyle: CSSProperties = {
    position: 'relative',
    width: '446px',
    height: '206px',
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 40px',
    ...style,
  };

  const valueStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '85.714px',
    fontWeight: 400,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '-0.8571px',
    textAlign: 'center',
  };

  const labelStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '50px',
    fontWeight: 400,
    color: '#ffffff',
    margin: '8px 0 0 0',
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
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
      <div style={cardStyle} data-node-id="166:504">
        <p style={valueStyle} data-node-id="166:503">
          {displayValue}
        </p>
        <p style={labelStyle} data-node-id="166:502">
          {label}
        </p>
      </div>
    </>
  );
};
