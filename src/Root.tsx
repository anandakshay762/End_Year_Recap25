import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import { compositionSchema } from './types';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TopmateYearEndRecap"
        component={MyComposition}
        durationInFrames={1350}
        fps={30}
        width={1080}
        height={1080}
        schema={compositionSchema}
        defaultProps={{
          name: 'Akshay Anand',
          designation: 'Designer',
          profileImage: 'profile-image.png',
          profileViews: '20,456',
          bookings: '350',
          timeSpent: '420 hrs',
          service1: 'Service name 1',
          service2: 'Service name 2',
          country1: 'Country name 1',
          country2: 'Country name 2',
          dm: '325',
          badges1: 'Top 5%',
          badges2: 'Hustler',
          badges3: 'Host Worthy',
          badges1Icon: '',
          badges2Icon: '',
          badges3Icon: '',
          livesMoved: '350',
        }}
      />
      <Composition
        id="Experiments"
        component={MyComposition}
        durationInFrames={1350}
        fps={30}
        width={1080}
        height={1080}
        schema={compositionSchema}
        defaultProps={{
          name: 'Akshay Anand',
          designation: 'Designer',
          profileImage: 'profile-image.png',
          profileViews: '20,456',
          bookings: '350',
          timeSpent: '420 hrs',
          service1: 'Service name 1',
          service2: 'Service name 2',
          country1: 'Country name 1',
          country2: 'Country name 2',
          dm: '325',
          badges1: 'Top 5%',
          badges2: 'Hustler',
          badges3: 'Host Worthy',
          badges1Icon: '',
          badges2Icon: '',
          badges3Icon: '',
          livesMoved: '350',
        }}
      />
    </>
  );
};
