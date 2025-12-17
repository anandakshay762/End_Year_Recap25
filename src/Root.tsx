import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import { compositionSchema } from './types';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="final"
        component={MyComposition}
        durationInFrames={2910}
        fps={30}
        width={1080}
        height={1080}
        schema={compositionSchema}
        defaultProps={{
          // Profile Picture
          Profile_pic: '',

          // New Scene Props with Dummy Data
          name: 'Sarah',
          firstBookingDate: 'January 15, 2025',
          totalBookings: '247',
          city1: 'Mumbai',
          city2: 'Tokyo',
          mostBookedMonth: 'August',
          mostPopularService: '1-on-1 Career Coaching',
          testimonial: 'Working with Sarah completely transformed my career path. Her insights were exactly what I needed.',
          topPercentage: '5',
          rating: '4.9',

          // Legacy Props
          designation: '',
          profileImage: '',
          profileViews: '',
          bookings: '',
          timeSpent: '',
          service1: '',
          service2: '',
          country1: '',
          country2: '',
          dm: '',
          badges1: '',
          badges2: '',
          badges3: '',
          badges1Icon: '',
          badges2Icon: '',
          badges3Icon: '',
          livesMoved: '',
        }}
      />
    </>
  );
};
