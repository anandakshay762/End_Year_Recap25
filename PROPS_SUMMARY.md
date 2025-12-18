# Props Quick Reference - Topmate Recap 2025

## All Required Props

```typescript
{
  // Constant - Profile Picture
  Profile_pic: string,           // URL to profile picture
                                 // Example: "https://static.topmate.io/9WMZGjPLx1QxaoUmT8MZug.png"

  // Scene 1: Intro
  name: string,                  // First name only
                                 // Example: "Sarah"

  // Scene 2: The Journey
  totalBookings: string,         // Total bookings count in 2025
                                 // Example: "247"

  // Scene 3: The Reach
  city1: string,                 // #1 Most booked city
                                 // Example: "Mumbai"
  city2: string,                 // #2 Most booked city (use same if only 1)
                                 // Example: "Tokyo"
  uniqueCitiesCount: string,     // Total unique cities count
                                 // Example: "12"

  // Scene 4: The Peak
  mostBookedMonth: string,       // Most booked month (full name)
                                 // Example: "August"

  // Scene 5: The Signature
  mostPopularService: string,    // Most popular service name
                                 // Example: "1-on-1 Career Coaching"

  // Scene 6: The Voices
  testimonial: string,           // Testimonial text (75-150 chars preferred)
                                 // Example: "Working with Sarah transformed my career."
  testimonialGiverName: string,  // Name of testimonial giver
                                 // Example: "Alex Johnson"

  // Scene 7: The Summit
  topPercentage: string,         // Top percentile (max 5%)
                                 // Example: "5"
                                 // Base: users with > 2 bookings

  // Scene 8: The Stars
  rating: string,                // Average rating (if < 4, show "4")
                                 // Example: "4.9"
}
```

## Calculation Logic

### Scene 7: Top Percentage
```javascript
// Calculate percentile among users with > 2 bookings in 2025
// Cap at maximum 5%
const topPercentage = Math.min(
  Math.ceil(calculatePercentile(userId, usersWithMoreThan2Bookings)),
  5
).toString();
```

### Scene 8: Rating
```javascript
// If rating < 4, display "4.0"
const displayRating = parseFloat(avgRating) < 4
  ? "4.0"
  : parseFloat(avgRating).toFixed(1);
```

### Scene 3: Unique Cities
```javascript
// If only one city, use same for both
const city1 = topCities[0] || "Unknown";
const city2 = topCities[1] || city1;
const uniqueCitiesCount = allUniqueCities.length.toString();
```

## Sample Complete Props Object

```javascript
{
  Profile_pic: "https://static.topmate.io/9WMZGjPLx1QxaoUmT8MZug.png",
  name: "Sarah",
  totalBookings: "247",
  city1: "Mumbai",
  city2: "Tokyo",
  uniqueCitiesCount: "12",
  mostBookedMonth: "August",
  mostPopularService: "1-on-1 Career Coaching",
  testimonial: "Working with Sarah completely transformed my career path. Her insights were exactly what I needed.",
  testimonialGiverName: "Alex Johnson",
  topPercentage: "5",
  rating: "4.9"
}
```

## Validation Checklist

- [ ] Profile_pic is a valid publicly accessible URL
- [ ] name is first name only (not full name)
- [ ] totalBookings is numeric string (no decimals)
- [ ] city1 and city2 are city names (not countries)
- [ ] uniqueCitiesCount is numeric string
- [ ] mostBookedMonth is full month name, capitalized
- [ ] mostPopularService is under 50 characters (recommended)
- [ ] testimonial is 75-150 characters (preferred)
- [ ] topPercentage is whole number ≤ 5
- [ ] rating is decimal string, displayed as ≥ 4.0

## Common Mistakes to Avoid

❌ **DON'T**:
- Use full name for `name` (use first name only)
- Use abbreviated months (`"Aug"` → use `"August"`)
- Show percentile < 5% (`"1"` → cap at `"5"`)
- Show rating < 4.0 (`"3.8"` → display `"4.0"`)
- Use country names for cities (`"India"` → use `"Mumbai"`)
- Include decimals in counts (`"247.5"` → use `"247"`)

✅ **DO**:
- Use first name only: `"Sarah"`
- Use full month names: `"August"`, `"December"`
- Cap percentile at 5%: `"5"`
- Ensure rating displays ≥ 4.0: `"4.9"`, `"4.0"`
- Use city names: `"Mumbai"`, `"Tokyo"`
- Use whole numbers for counts: `"247"`, `"12"`
