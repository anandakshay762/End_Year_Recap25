# Topmate Year-End Recap 2025 - Integration Guide

## Overview
This Remotion project generates a personalized year-end recap video for Topmate creators. The video is 97 seconds long (2910 frames at 30fps) with a 1080x1080px resolution, designed in a brutalist black & white aesthetic.

## Project Structure
```
End_Year_Recap25_v2/
├── public/
│   ├── bg_1_fixed.mp4          # Background video (required)
│   └── audi01_clean.mp3        # Audio track (required)
├── src/
│   ├── Composition.tsx         # Main composition orchestrating all scenes
│   ├── Root.tsx                # Remotion root with schema and default props
│   ├── types.ts                # TypeScript types and Zod schema
│   ├── fonts.ts                # Font configuration (Instrument Sans)
│   ├── ProfilePicture.tsx      # Profile picture component (bottom right)
│   ├── Scene0Intro_v3.tsx      # Scene 1: Intro
│   ├── Scene1Journey_v3.tsx    # Scene 2: The Journey
│   ├── Scene2Reach_v3.tsx      # Scene 3: The Reach
│   ├── Scene3Peak_v3.tsx       # Scene 4: The Peak
│   ├── Scene4Signature_v3.tsx  # Scene 5: The Signature
│   ├── Scene5Voices_v3.tsx     # Scene 6: The Voices
│   ├── Scene6Summit_v3.tsx     # Scene 7: The Summit
│   ├── Scene7Stars_v3.tsx      # Scene 8: The Stars
│   └── Scene9Outro_v3.tsx      # Scene 9: Outro
└── package.json
```

## Required Assets
Place these files in the `/public` directory:
- **bg_1_fixed.mp4** - Background video (plays throughout entire 97s duration)
- **audi01_clean.mp3** - Audio track (97s duration)

## Video Composition Schema

### Composition ID
`TopMateRecap2025`

### Specifications
- **Duration**: 2910 frames (97 seconds at 30fps)
- **FPS**: 30
- **Resolution**: 1080x1080px (square format)
- **Design**: Brutalist Black & White with 3-text hierarchy

---

## Scene-by-Scene Variable Breakdown

### Constant Across All Scenes
| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `Profile_pic` | string | URL to creator's profile picture (appears bottom right throughout video) | `"https://example.com/profile.jpg"` |

---

### Scene 1: Intro (Frames 0-291, ~9.7s)
**Visual**: "{NAME}'S / TOPMATE / RECAP 2025"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `name` | string | Creator's first name | `"Sarah"` | Displayed in light weight (300) |

**Text Hierarchy**:
- Top: "{NAME}'S" (light, 48px)
- Hero: "TOPMATE" (heavy, 260px)
- Bottom: "RECAP 2025" (light, 48px)

---

### Scene 2: The Journey (Frames 291-582, ~9.7s)
**Visual**: "YOUR JOURNEY / {BOOKINGS} / BOOKINGS IN 2025"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `totalBookings` | string | Total booking count in 2025 | `"247"` | Animates with counter effect |

**Text Hierarchy**:
- Top: "YOUR JOURNEY" (light, 48px)
- Hero: "{totalBookings}" (heavy, 260px) - animated counter
- Bottom: "BOOKINGS IN 2025" (light, 48px)

---

### Scene 3: The Reach (Frames 582-873, ~9.7s)
**Visual**: "THE REACH / {CITY1} → {CITY2} / Your offerings reached {N} unique cities"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `city1` | string | #1 Most bookings received from city | `"Mumbai"` | If only one city, use same for both |
| `city2` | string | #2 Most bookings received from city | `"Tokyo"` | If only one city, use same for both |
| `uniqueCitiesCount` | string | Total number of unique cities bookings received from | `"12"` | Count of all unique cities |

**Text Hierarchy**:
- Top: "THE REACH" (label, 16px)
- Hero: "{city1} → {city2}" (heavy, 120px)
- Bottom: "Your offerings reached {uniqueCitiesCount} unique cities" (light, 32px)

---

### Scene 4: The Peak (Frames 873-1164, ~9.7s)
**Visual**: "{MONTH} / WAS YOUR BUSIEST MONTH"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `mostBookedMonth` | string | Most booked month | `"August"` | Use full month name (e.g., "August", "December") |

**Text Hierarchy**:
- Hero: "{mostBookedMonth}" (heavy, 260px)
- Bottom: "WAS YOUR BUSIEST MONTH" (light, 48px)
- **Note**: No top label (2-text hierarchy)

---

### Scene 5: The Signature (Frames 1164-1455, ~9.7s)
**Visual**: "YOUR SIGNATURE SERVICE / {SERVICE} / MOST POPULAR OFFERING"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `mostPopularService` | string | Most popular service name | `"1-on-1 Career Coaching"` | Dynamic font sizing for long service names |

**Text Hierarchy**:
- Top: "YOUR SIGNATURE SERVICE" (light, 48px)
- Hero: "{mostPopularService}" (heavy, dynamically scaled)
- Bottom: "MOST POPULAR OFFERING" (light, 48px)

---

### Scene 6: The Voices (Frames 1455-1746, ~9.7s)
**Visual**: Large quote mark / Testimonial text / "— {Name}"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `testimonial` | string | Testimonial text | `"Working with Sarah transformed my career path."` | **Preferred: 75-150 characters** |
| `testimonialGiverName` | string | Name of person who gave testimonial | `"Alex Johnson"` | Displayed with em dash prefix |

**Text Hierarchy**:
- Top: Large quote mark `"` (light, 200px)
- Hero: Testimonial text (medium, 38px)
- Bottom: "— {testimonialGiverName}" (light, 32px)

---

### Scene 7: The Summit (Frames 1746-2037, ~9.7s)
**Visual**: "TOP / {PERCENTAGE}% / AMONG ALL CREATORS"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `topPercentage` | string | Top percentile score | `"5"` | **Do not go more than 5%**. Base: all users in 2025 with > 2 bookings |

**Calculation Logic**:
- Calculate percentile among all users in 2025 with more than 2 bookings
- Cap at maximum 5% (do not show "Top 1%" or "Top 0.5%")
- Round to whole number

**Text Hierarchy**:
- Top: "TOP" (light, 48px)
- Hero: "{topPercentage}%" (heavy, 260px)
- Bottom: "AMONG ALL CREATORS" (light, 48px)

---

### Scene 8: The Stars (Frames 2037-2328, ~9.7s)
**Visual**: "AVERAGE RATING / {RATING}/5 / IN 2025"

| Variable | Type | Description | Example | Notes |
|----------|------|-------------|---------|-------|
| `rating` | string | Average rating in 2025 | `"4.9"` | **If rating < 4, show "4" instead** |

**Display Logic**:
```javascript
const displayRating = parseFloat(rating) < 4 ? "4.0" : rating;
```

**Text Hierarchy**:
- Top: "AVERAGE RATING" (light, 48px)
- Hero: "{rating}/5" (heavy, 260px) - animated counter
- Bottom: "IN 2025" (light, 48px)

---

### Scene 9: Outro - Year Transition (Frames 2328-2910, ~19.4s)
**Visual**: "THAT WAS / 2025" → (flip) → "ONTO / 2026"

**No variables required** - Static text with calendar flip animation

**Animation Flow**:
1. Frames 2328-2458 (~4.3s): Display "THAT WAS 2025"
2. Frames 2458-2488 (~1s): Calendar flip transition from 2025 to 2026
3. Frames 2488-2910 (~14s): Display "ONTO 2026"

**Text Hierarchy**:
- Phase 1: "THAT WAS" (light) / "2025" (heavy)
- Phase 2: "ONTO" (light) / "2026" (heavy)

---

## Implementation Example

### TypeScript Interface
```typescript
interface VideoProps {
  // Constant
  Profile_pic: string;

  // Scene 1
  name: string;

  // Scene 2
  totalBookings: string;

  // Scene 3
  city1: string;
  city2: string;
  uniqueCitiesCount: string;

  // Scene 4
  mostBookedMonth: string;

  // Scene 5
  mostPopularService: string;

  // Scene 6
  testimonial: string;
  testimonialGiverName: string;

  // Scene 7
  topPercentage: string;

  // Scene 8
  rating: string;
}
```

### Sample API Call (using @remotion/lambda or @remotion/renderer)
```javascript
const inputProps = {
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
};

// Render video
await renderMedia({
  composition: "TopMateRecap2025",
  serveUrl: bundleLocation,
  codec: "h264",
  inputProps: inputProps,
  outputLocation: "out/recap-sarah-2025.mp4"
});
```

---

## Data Validation Rules

### Scene 2: Total Bookings
- Must be numeric string
- No decimals
- Example: `"247"`, `"1523"`

### Scene 3: Cities and Reach
- `city1` and `city2` must be city names (not countries)
- If only one city has bookings, use the same city for both `city1` and `city2`
- Example: `city1: "Mumbai", city2: "Mumbai"`
- `uniqueCitiesCount` must be numeric string (count of all unique cities)
- Example: `"12"`, `"45"`, `"1"`

### Scene 4: Most Booked Month
- Must be full month name (not abbreviated)
- Capitalized: `"August"`, `"December"`
- NOT: `"Aug"`, `"Dec"`

### Scene 5: Most Popular Service
- Dynamic font sizing handles long service names
- Maximum recommended length: ~50 characters
- Example: `"1-on-1 Career Coaching"`, `"Product Management Consultation"`

### Scene 6: Testimonial
- **Preferred length: 75-150 characters**
- Longer testimonials will wrap across multiple lines
- Avoid testimonials longer than 200 characters for optimal readability
- Remove line breaks - component handles wrapping automatically

### Scene 7: Top Percentage
- Must be whole number string
- **Maximum value: 5** (do not show "Top 1%" or lower)
- Base calculation: all users in 2025 with > 2 bookings
- Example: `"5"`, `"3"` (NOT `"5.5"` or `"1"`)

### Scene 8: Rating
- Must be numeric string with one decimal place
- **If rating < 4, display "4.0" instead**
- Valid range: 4.0 - 5.0
- Example: `"4.9"`, `"4.5"`, `"4.0"`

```javascript
// Example validation logic
const validateRating = (rating) => {
  const ratingValue = parseFloat(rating);
  if (ratingValue < 4) return "4.0";
  return ratingValue.toFixed(1);
};
```

---

## Design System

### Typography
- **Font Family**: Instrument Sans (loaded via @remotion/google-fonts)
- **Light weight**: 300 (supporting text)
- **Medium weight**: 500 (testimonial body text)
- **Heavy weight**: 900 (hero numbers and text)

### Color Palette
- **Primary Text**: `#ffffff` (white)
- **Background**: Video background with dark gradient overlay
- **Vignette**: Radial gradient from transparent to `rgba(0,0,0,0.6)`

### 3-Text Hierarchy Pattern
Most scenes follow this pattern:
1. **Top Label** - Light weight (300), 48px, uppercase
2. **Hero Element** - Heavy weight (900), 260px (or dynamically scaled)
3. **Bottom Label** - Light weight (300), 48px, uppercase

### Animations
- **Fade-in**: 0-20 frames (opacity 0 → 1)
- **Scale-in**: Hero elements scale from 1.4 → 1.0
- **Counter animations**: Numbers animate over 30-35 frames
- **Underline expansion**: 0 → 100% width over ~15 frames
- **Easing**: Primarily `Easing.out(Easing.cubic)` and `Easing.out(Easing.exp)`

---

## Testing Locally

### Installation
```bash
cd End_Year_Recap25_v2
npm install
```

### Development Server
```bash
npm start
```
Opens Remotion Studio at http://localhost:3000

### Render Single Video
```bash
npx remotion render TopMateRecap2025 output.mp4 --props='{"Profile_pic":"https://example.com/profile.jpg","name":"Sarah",...}'
```

### Update Default Props
Edit `src/Root.tsx` to change the default props shown in Remotion Studio:
```typescript
defaultProps={{
  Profile_pic: 'https://example.com/profile.jpg',
  name: 'Sarah',
  totalBookings: '247',
  // ... other props
}}
```

---

## Production Deployment

### Option 1: Remotion Lambda (AWS)
Best for scalable, serverless rendering.

```bash
# Deploy site
npx remotion lambda sites create src/index.ts --site-name=topmate-recap

# Render video
npx remotion lambda render <site-id> TopMateRecap2025 --props='...'
```

### Option 2: Remotion Render (Server)
Run on your own server infrastructure.

```javascript
import { renderMedia, selectComposition } from '@remotion/renderer';

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: 'TopMateRecap2025',
  inputProps: inputProps,
});

await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: `out/recap-${name}-2025.mp4`,
  inputProps: inputProps,
});
```

### Recommended Video Settings
```javascript
{
  codec: 'h264',
  pixelFormat: 'yuv420p',  // Maximum compatibility
  videoBitrate: '5M',       // High quality for 1080x1080
  audioBitrate: '192k',
}
```

---

## Performance Considerations

### Bundle Size
- Keep `node_modules` optimized
- Ensure only v3 scene files are included (legacy files removed)
- Total bundle size: ~2-3 MB (excluding video/audio assets)

### Render Time
- Expected render time: 2-4 minutes per video (depending on hardware)
- Lambda cold start: ~30s, warm start: ~90s

### Memory Usage
- Recommended: 2GB+ RAM
- Lambda: Use at least 2048MB memory configuration

---

## Troubleshooting

### Common Issues

#### 1. Text Going Out of Frame
**Scene 5 (Signature)**: Has dynamic font sizing for long service names
```typescript
// Automatically scales down for services longer than 30 characters
const serviceLength = mostPopularService.length;
const fontSize = serviceLength > 30
  ? Math.max(120, 260 * (30 / serviceLength))
  : 260;
```

#### 2. Profile Picture Not Showing
- Ensure `Profile_pic` URL is publicly accessible
- Check CORS headers if loading from external domain
- Verify image format (JPEG, PNG supported)

#### 3. Video/Audio Not Loading
- Place `bg_1_fixed.mp4` and `audi01_clean.mp3` in `/public` folder
- Check file names match exactly (case-sensitive)
- Verify video is 97 seconds duration

#### 4. Font Not Loading
- Instrument Sans is loaded via `@remotion/google-fonts`
- Ensure internet connection during render
- Check `src/fonts.ts` configuration

---

## Scene Numbering Reference

| Scene # | File | Content | Frames |
|---------|------|---------|--------|
| 1 | Scene0Intro_v3.tsx | Intro | 0-291 |
| 2 | Scene1Journey_v3.tsx | Total Bookings | 291-582 |
| 3 | Scene2Reach_v3.tsx | Cities | 582-873 |
| 4 | Scene3Peak_v3.tsx | Most Booked Month | 873-1164 |
| 5 | Scene4Signature_v3.tsx | Popular Service | 1164-1455 |
| 6 | Scene5Voices_v3.tsx | Testimonial | 1455-1746 |
| 7 | Scene6Summit_v3.tsx | Top Percentile | 1746-2037 |
| 8 | Scene7Stars_v3.tsx | Rating | 2037-2328 |
| 9 | Scene9Outro_v3.tsx | Year Transition | 2328-2910 |

**Total Duration**: 2910 frames (97 seconds at 30fps)

---

## Support & Maintenance

### File Structure Clean-up Completed
All legacy files have been removed. Only the following files remain:
- ✅ v3 scene files (final versions)
- ✅ Core files (Composition.tsx, Root.tsx, types.ts, fonts.ts, ProfilePicture.tsx)
- ❌ Old versions (v1, v2, legacy components) - removed

### Props Schema
The `types.ts` schema has been cleaned and documented with all required props only. No legacy props remain.

---

## Contact & Questions

For integration support, please ensure:
1. All required assets are in `/public` folder
2. Props match the schema exactly (check spelling and casing)
3. Data validation rules are followed
4. Test with default props first before custom data

---

**Last Updated**: December 2025
**Version**: V3 (Final)
**Remotion Version**: 4.x
