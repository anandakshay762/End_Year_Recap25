import { z } from 'zod';

/**
 * Topmate Year-End Recap 2025 - Props Schema
 *
 * All scenes use these props to dynamically generate the year-end recap video.
 * Total Duration: 2910 frames (97 seconds at 30fps)
 * Resolution: 1080x1080px
 */
export const compositionSchema = z.object({
  // Constant across all scenes
  Profile_pic: z.string(), // URL to profile picture (appears bottom right throughout video)

  // Scene 1: Intro - "{NAME}'S TOPMATE RECAP 2025"
  name: z.string(), // User's first name

  // Scene 2: The Journey - "TOTAL BOOKINGS: {totalBookings}"
  totalBookings: z.string(), // Total booking count in 2025 (e.g., "247")

  // Scene 3: The Reach - "FROM {city1} TO {city2}"
  city1: z.string(), // #1 Most booking received from city (if only one city, use same for both)
  city2: z.string(), // #2 Most booking received from city (if only one city, use same for both)
  uniqueCitiesCount: z.string(), // Total number of unique cities bookings received from (e.g., "12", "45")

  // Scene 4: The Peak - "{mostBookedMonth} WAS YOUR BUSIEST MONTH"
  mostBookedMonth: z.string(), // Most booked month (e.g., "August", "December")

  // Scene 5: The Signature - "{mostPopularService}"
  mostPopularService: z.string(), // Most popular service name (e.g., "1-on-1 Career Coaching")

  // Scene 6: The Voices - Testimonial display
  testimonial: z.string(), // Testimonial text (preferred: 75-150 characters)
  testimonialGiverName: z.string(), // Name of person who gave testimonial

  // Scene 7: The Summit - "TOP {topPercentage}%"
  // Calculate percentile - do not go more than 5%
  // Base: all users in 2025 with > 2 bookings
  topPercentage: z.string(), // Top percentile (e.g., "5", "3")

  // Scene 8: The Stars - "AVERAGE RATING {rating}/5"
  // If rating < 4, show "4"
  rating: z.string(), // Average rating in 2025 (e.g., "4.9", "4.5")

  // Scene 9: Outro - "THAT WAS 2025" → "ONTO 2026" (no variables)
  // Scene 10: Final frame (no variables)
});

export type CompositionProps = z.infer<typeof compositionSchema>;
