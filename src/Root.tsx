import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import { compositionSchema } from './types';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TopMateRecap2025"
        component={MyComposition}
        durationInFrames={2910}
        fps={30}
        width={1080}
        height={1080}
        schema={compositionSchema}
        defaultProps={{
          // Profile Picture (constant across all scenes)
          Profile_pic: 'https://static.topmate.io/9WMZGjPLx1QxaoUmT8MZug.png',

          // Scene 1: Intro
          name: 'Sarah',

          // Scene 2: The Journey
          totalBookings: '247',

          // Scene 3: The Reach
          city1: 'Mumbai',
          city2: 'Tokyo',
          uniqueCitiesCount: '12',

          // Scene 4: The Peak
          mostBookedMonth: 'August',

          // Scene 5: The Signature
          mostPopularService: '1-on-1 Career Coaching',

          // Scene 6: The Voices
          testimonial: 'Working with Sarah completely transformed my career path. Her insights were exactly what I needed.',
          testimonialGiverName: 'Alex Johnson',

          // Scene 7: The Summit
          topPercentage: '5',

          // Scene 8: The Stars
          rating: '4.9',
        }}
      />
    </>
  );
};
