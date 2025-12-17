import { z } from 'zod';

export const compositionSchema = z.object({
  // Profile Picture
  Profile_pic: z.string(),

  // Scene 0: Intro & Scene 8: Universe
  name: z.string(),

  // Scene 1: The Journey
  firstBookingDate: z.string(),
  totalBookings: z.string(),

  // Scene 2: The Reach
  city1: z.string(),
  city2: z.string(),

  // Scene 3: The Peak
  mostBookedMonth: z.string(),

  // Scene 4: The Signature
  mostPopularService: z.string(),

  // Scene 5: The Voices
  testimonial: z.string(),

  // Scene 6: The Summit
  topPercentage: z.string(),

  // Scene 7: The Stars
  rating: z.string(),

  // Legacy fields (keeping for backwards compatibility)
  designation: z.string(),
  profileImage: z.string(),
  profileViews: z.string(),
  bookings: z.string(),
  timeSpent: z.string(),
  service1: z.string(),
  service2: z.string(),
  country1: z.string(),
  country2: z.string(),
  dm: z.string(),
  badges1: z.string(),
  badges2: z.string(),
  badges3: z.string(),
  badges1Icon: z.string(),
  badges2Icon: z.string(),
  badges3Icon: z.string(),
  livesMoved: z.string(),
});

export type CompositionProps = z.infer<typeof compositionSchema>;
