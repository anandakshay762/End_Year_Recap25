import React, { CSSProperties } from 'remotion';
import { staticFile } from 'remotion';

interface ProfileViewsProps {
  value: string;
  label: string;
  style?: CSSProperties;
}

export const ProfileViews: React.FC<ProfileViewsProps> = ({ value, label, style }) => {
  const cardStyle: CSSProperties = {
    position: 'relative',
    width: '490px',
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
      <div style={cardStyle} data-node-id="164:497">
        <p style={valueStyle} data-node-id="164:494">
          {value}
        </p>
        <p style={labelStyle} data-node-id="164:493">
          {label}
        </p>
      </div>
    </>
  );
};
