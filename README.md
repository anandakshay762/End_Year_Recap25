# Topmate Year End Recap Video Generator

A web application that generates personalized year-end recap videos using Remotion. Users can input their data through a form and generate custom videos.

## Features

- User-friendly web form for data input
- Profile picture upload (optional)
- Automatic video generation using Remotion
- Download generated videos directly

## Input Fields

The application accepts the following inputs:

1. **Profile Picture** - User's profile image (optional)
2. **Name** - User's name
3. **Total Bookings** - Total number of bookings (e.g., "247")
4. **Top Cities** - Two cities with the most bookings
5. **Unique Cities Count** - Total number of unique cities bookings received from
6. **Most Booked Month** - Peak month for bookings
7. **Most Popular Service** - The most booked service
8. **Testimonial** - A featured client testimonial (75-150 characters preferred)
9. **Testimonial Giver Name** - Name of the person who gave the testimonial
10. **Top Percentage** - User's ranking percentile (e.g., "5" for top 5%)
11. **Average Rating** - User's average rating out of 5

## Installation

Dependencies are already installed. If you need to reinstall:
```bash
npm install
```

## Usage

### Web Application (Recommended)

1. Start the server:
```bash
npm run server
```

2. Open your browser and navigate to:
```
http://localhost:3001
```

3. Fill in the form with your data
4. Upload your profile picture (optional)
5. Click "Generate Video"
6. Wait for the video to be generated (this may take a few minutes)
7. Download your video when ready

### Remotion Studio (Development)

1. Start Remotion Studio:
```bash
npm start
```

2. Edit the default props in `src/Root.tsx`
3. Preview and export the video from the studio

## Project Structure

```
End_Year_Recap25/
├── public/
│   ├── index.html          # Web form interface
│   ├── uploads/            # Uploaded profile pictures
│   └── [assets]            # Fonts, videos, images
├── src/
│   ├── Root.tsx            # Remotion root component
│   ├── Composition.tsx     # Main video composition
│   ├── types.ts            # TypeScript types
│   └── Scene*_v3.tsx       # Individual scene components (v3)
├── outputs/                # Generated videos
├── server.js               # Express server for video generation
└── package.json
```

## Video Scenes

The generated video contains 10 scenes:

1. **Scene 0: Intro** - Welcome with name
2. **Scene 1: The Journey** - Total bookings
3. **Scene 2: The Reach** - Top cities and unique cities count
4. **Scene 3: The Peak** - Most booked month
5. **Scene 4: The Signature** - Most popular service
6. **Scene 5: The Voices** - Featured testimonial with giver's name
7. **Scene 6: The Summit** - Top percentage achievement
8. **Scene 7: The Stars** - Average rating
9. **Scene 8: Outro** - "THAT WAS 2025" → "ONTO 2026"
10. **Scene 9: Final frame**

## Technical Details

- **Duration:** 97 seconds (2910 frames at 30 fps)
- **Resolution:** 1080x1080
- **Format:** MP4 (H.264 codec)
- **Framework:** Remotion 4.0
- **Backend:** Express.js
- **Frontend:** Vanilla HTML/CSS/JavaScript

## API Endpoints

### POST /upload-profile-pic
Uploads a profile picture and returns the absolute file path.

**Request:** multipart/form-data with 'profilePic' field

**Response:**
```json
{
  "url": "D:\\path\\to\\uploads\\filename.jpg"
}
```

### POST /render-video
Generates a video with the provided data.

**Request:**
```json
{
  "Profile_pic": "D:\\path\\to\\image.jpg",
  "name": "Sarah",
  "totalBookings": "247",
  "city1": "Mumbai",
  "city2": "Tokyo",
  "uniqueCitiesCount": "12",
  "mostBookedMonth": "August",
  "mostPopularService": "1-on-1 Career Coaching",
  "testimonial": "Working with Sarah...",
  "testimonialGiverName": "Alex Johnson",
  "topPercentage": "5",
  "rating": "4.9"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video rendered successfully",
  "videoUrl": "/outputs/video-timestamp.mp4",
  "downloadUrl": "http://localhost:3001/outputs/video-timestamp.mp4"
}
```

## Important Notes

- **DO NOT** run `npm start` unless you want to open Remotion Studio
- **RUN** `npm run server` to start the web application
- Profile picture is optional - a placeholder will be shown if not provided
- All generated videos are saved in the `outputs/` directory
- Uploaded images are stored in `public/uploads/`

## Troubleshooting

1. **Port already in use:** Change the PORT variable in `server.js`
2. **Video generation fails:** Check that all input fields are filled correctly
3. **Profile picture not uploading:** Ensure the image format is supported (jpg, png, etc.)
4. **Server not starting:** Make sure you're in the correct directory and dependencies are installed

## Quick Start

```bash
# Start the server
npm run server

# Open browser to http://localhost:3001
```

## License

This project is for Topmate's year-end recap video generation.
