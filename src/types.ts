import { z } from 'zod';

export const compositionSchema = z.object({
  name: z.string(),
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
