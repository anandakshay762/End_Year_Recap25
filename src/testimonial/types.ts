import { z } from 'zod';

export const testimonialReelSchema = z.object({
  profilePic: z.string(),
  topmateLink: z.string(),
  creatorName: z.string(),
  name1: z.string(), name2: z.string(), name3: z.string(),
  testimonial1: z.string(), testimonial2: z.string(), testimonial3: z.string(),
});

export type TestimonialReelProps = z.infer<typeof testimonialReelSchema>;
