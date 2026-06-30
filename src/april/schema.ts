import { z } from "zod";

const ServiceSchema = z.object({
  name: z.string(),
  badge: z.string(),
});

const SourceSchema = z.object({
  name: z.string(),
  badge: z.string(),
});

const CitySchema = z.object({
  name: z.string(),
  badge: z.string(),
});

export const CompositionSchema = z.object({
  // Identity
  user_name: z.string(),
  designation: z.string(),
  profile_pic_url: z.string().url(),
  topmate_link: z.string(),
  month_label: z.string().default("April '26"),

  // Status-bar clock — set to the moment the render was triggered so each
  // creator's video reads "their time" rather than the iPhone marketing 9:41.
  time_label: z.string().default("9:41"),

  // Bookings slide
  month_sessions: z.number(),
  booking_context: z.string(),

  // Rating slide
  rating: z.number(),
  review_count: z.number(),

  // Profile views slide
  profile_views: z.string(),
  views_vs_last_month: z.string(),

  // Recognition slide
  top_pct: z.string(),

  // Top services
  top_services: z.tuple([ServiceSchema, ServiceSchema, ServiceSchema]),

  // Top booking sources
  top_sources: z.tuple([SourceSchema, SourceSchema, SourceSchema]),

  // Top cities
  top_cities: z.tuple([CitySchema, CitySchema, CitySchema]),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;
