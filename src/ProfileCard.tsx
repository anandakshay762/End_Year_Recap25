import React, { CSSProperties } from 'react';
import { staticFile } from 'remotion';

interface ProfileCardProps {
  name: string;
  title: string;
  profileImage: string;
  logoImage?: string;
  style?: CSSProperties;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  profileImage,
  logoImage,
  style,
}) => {
  const cardStyle: CSSProperties = {
    position: 'relative',
    width: '329px',
    height: '367px',
    backdropFilter: 'blur(25.5px)',
    WebkitBackdropFilter: 'blur(25.5px)',
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    border: '5px solid #2366a0',
    borderRadius: '51px',
    boxShadow: 'inset 0px 0px 25px 0px rgba(255, 255, 255, 0.51)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 30px 30px 30px',
    ...style,
  };

  const profileImageStyle: CSSProperties = {
    width: '114px',
    height: '114px',
    borderRadius: '50%',
    backgroundColor: '#d1d1d1',
    objectFit: 'cover',
    marginBottom: '20px',
  };

  const nameStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '27.592px',
    fontWeight: 400,
    color: '#ffffff',
    margin: 0,
    textAlign: 'center',
    lineHeight: 'normal',
  };

  const titleStyle: CSSProperties = {
    fontFamily: 'AUTOMATA, sans-serif',
    fontSize: '21.224px',
    fontWeight: 400,
    color: '#ffffff',
    margin: '8px 0 0 0',
    textAlign: 'center',
    lineHeight: 'normal',
  };

  const logoStyle: CSSProperties = {
    width: '107px',
    height: '20px',
    marginTop: 'auto',
  };

  const contentContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
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
      <div style={cardStyle} data-node-id="149:479">
        <div style={contentContainerStyle}>
          <img
            src={profileImage}
            alt={name}
            style={profileImageStyle}
            data-node-id="149:472"
          />
          <p style={nameStyle} data-node-id="149:469">
            {name}
          </p>
          <p style={titleStyle} data-node-id="149:468">
            {title}
          </p>
        </div>
        {logoImage && (
          <img
            src={logoImage}
            alt="Topmate"
            style={logoStyle}
            data-node-id="149:473"
          />
        )}
      </div>
    </>
  );
};
