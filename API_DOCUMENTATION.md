# TopMate Year-End Recap Video Generator - API Documentation

## Overview

This API allows you to programmatically generate personalized year-end recap videos using the TopMate Remotion template. The API provides endpoints for video rendering, progress tracking, and profile picture uploads.

**Base URL:** `http://localhost:3001`
**Video Format:** MP4 (H.264), 1080x1080px, 30fps
**Video Duration:** ~97 seconds (2910 frames)

---

## Quick Start

### 1. Start the Server

```bash
npm run server
```

Server will start on port 3001.

### 2. Basic Video Generation

```bash
curl -X POST http://localhost:3001/render-video \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah",
    "totalBookings": "247",
    "city1": "Mumbai",
    "city2": "Tokyo",
    "uniqueCitiesCount": "12",
    "mostBookedMonth": "August",
    "mostPopularService": "1-on-1 Career Coaching",
    "testimonial": "Working with Sarah completely transformed my career path.",
    "testimonialGiverName": "Alex Johnson",
    "topPercentage": "5",
    "rating": "4.9"
  }'
```

---

## API Endpoints

### 1. Upload Profile Picture

Upload a profile picture to be used in the video.

**Endpoint:** `POST /upload-profile-pic`
**Content-Type:** `multipart/form-data`

#### Request

```bash
curl -X POST http://localhost:3001/upload-profile-pic \
  -F "profilePic=@/path/to/image.jpg"
```

#### Response

```json
{
  "url": "D:\\path\\to\\uploads\\1234567890-image.jpg"
}
```

#### Notes
- Uploaded files are stored in `public/uploads/`
- Filename format: `{timestamp}-{originalname}`
- Supported formats: JPG, PNG, GIF, WebP
- Use the returned `url` in the `Profile_pic` field when rendering

---

### 2. Generate Video (Async)

Start an asynchronous video rendering job.

**Endpoint:** `POST /render-video`
**Content-Type:** `application/json`

#### Request Body

```json
{
  "Profile_pic": "D:\\path\\to\\profile.jpg",  // Optional
  "name": "Sarah",                              // Required
  "totalBookings": "247",                       // Required
  "city1": "Mumbai",                            // Required
  "city2": "Tokyo",                             // Required
  "uniqueCitiesCount": "12",                    // Required
  "mostBookedMonth": "August",                  // Required
  "mostPopularService": "1-on-1 Career Coaching", // Required
  "testimonial": "Your testimonial text here.", // Required
  "testimonialGiverName": "Alex Johnson",       // Required
  "topPercentage": "5",                         // Required (max: 5)
  "rating": "4.9"                               // Required (min: 4.0)
}
```

#### Response

```json
{
  "jobId": "1234567890-abc123"
}
```

#### Field Specifications

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `Profile_pic` | string | No | Absolute file path or URL | `"D:\\uploads\\pic.jpg"` |
| `name` | string | Yes | First name only | `"Sarah"` |
| `totalBookings` | string | Yes | Numeric string | `"247"` |
| `city1` | string | Yes | City name (#1 most booked) | `"Mumbai"` |
| `city2` | string | Yes | City name (#2 most booked) | `"Tokyo"` |
| `uniqueCitiesCount` | string | Yes | Numeric string | `"12"` |
| `mostBookedMonth` | string | Yes | Full month name, capitalized | `"August"` |
| `mostPopularService` | string | Yes | Service name (< 50 chars) | `"1-on-1 Career Coaching"` |
| `testimonial` | string | Yes | Client testimonial (75-150 chars preferred) | `"Working with Sarah..."` |
| `testimonialGiverName` | string | Yes | Name of testimonial giver | `"Alex Johnson"` |
| `topPercentage` | string | Yes | Percentile (whole number ≤ 5) | `"5"` |
| `rating` | string | Yes | Average rating (decimal ≥ 4.0) | `"4.9"` |

#### Notes
- Returns immediately with a `jobId`
- Use the `jobId` to track progress via `/render-progress/:jobId`
- Video rendering typically takes 5-15 minutes depending on system resources
- Background video must be at least 97 seconds long

---

### 3. Track Rendering Progress (SSE)

Monitor video rendering progress in real-time using Server-Sent Events.

**Endpoint:** `GET /render-progress/:jobId`
**Response Type:** `text/event-stream`

#### Request

```bash
curl -N http://localhost:3001/render-progress/1234567890-abc123
```

#### Event Types

##### Progress Event
```
event: progress
data: {"progress":45.2}
```

##### Completion Event
```
event: done
data: {"success":true,"videoUrl":"/outputs/video-1234567890.mp4","downloadUrl":"http://localhost:3001/outputs/video-1234567890.mp4"}
```

##### Error Event
```
event: error
data: {"error":"Background video is too short. Required: 97s, Got: 60s"}
```

#### JavaScript Example

```javascript
const jobId = '1234567890-abc123';
const eventSource = new EventSource(`http://localhost:3001/render-progress/${jobId}`);

eventSource.addEventListener('progress', (e) => {
  const data = JSON.parse(e.data);
  console.log(`Progress: ${data.progress.toFixed(1)}%`);
});

eventSource.addEventListener('done', (e) => {
  const data = JSON.parse(e.data);
  console.log('Video ready!', data.downloadUrl);
  eventSource.close();
});

eventSource.addEventListener('error', (e) => {
  const data = JSON.parse(e.data);
  console.error('Rendering failed:', data.error);
  eventSource.close();
});
```

#### Python Example

```python
import requests
import json

job_id = '1234567890-abc123'
url = f'http://localhost:3001/render-progress/{job_id}'

with requests.get(url, stream=True) as response:
    for line in response.iter_lines():
        if line:
            line = line.decode('utf-8')
            if line.startswith('data: '):
                data = json.loads(line[6:])
                if 'progress' in data:
                    print(f"Progress: {data['progress']:.1f}%")
                elif 'success' in data:
                    print(f"Done! Download: {data['downloadUrl']}")
                    break
                elif 'error' in data:
                    print(f"Error: {data['error']}")
                    break
```

#### Notes
- Connection stays open until rendering completes or fails
- Progress updates are emitted in real-time
- If job is already completed, returns cached result immediately
- Returns 404 if `jobId` doesn't exist

---

### 4. Generate Fast Preview

Generate a low-resolution preview video for quick validation.

**Endpoint:** `POST /preview`
**Content-Type:** `application/json`

#### Request Body

Same as `/render-video` (see Field Specifications above)

#### Response

```json
{
  "previewUrl": "/outputs/preview-1234567890.mp4"
}
```

#### Notes
- **Resolution:** 360x360px (1/3 of final resolution)
- **Frame Rate:** 15fps (1/2 of final frame rate)
- **Generation Time:** ~4 seconds
- Uses cached bundle for faster rendering
- Useful for testing props before full render
- Accessible at: `http://localhost:3001{previewUrl}`

---

### 5. Bundle Information (Debug)

Get bundle status and available files.

**Endpoint:** `GET /bundle-info`

#### Response

```json
{
  "ready": true,
  "path": "D:\\path\\to\\bundle",
  "entries": [
    "index.html",
    "bundle.js",
    "bundle.css"
  ]
}
```

---

## Complete Workflow Example

### Node.js/JavaScript

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function generateVideo() {
  try {
    // Step 1: Upload profile picture (optional)
    let profilePicUrl = null;
    if (fs.existsSync('./profile.jpg')) {
      const formData = new FormData();
      formData.append('profilePic', fs.createReadStream('./profile.jpg'));

      const uploadResponse = await axios.post(
        `${BASE_URL}/upload-profile-pic`,
        formData,
        { headers: formData.getHeaders() }
      );

      profilePicUrl = uploadResponse.data.url;
      console.log('Profile picture uploaded:', profilePicUrl);
    }

    // Step 2: Start video rendering
    const renderResponse = await axios.post(`${BASE_URL}/render-video`, {
      Profile_pic: profilePicUrl,
      name: 'Sarah',
      totalBookings: '247',
      city1: 'Mumbai',
      city2: 'Tokyo',
      uniqueCitiesCount: '12',
      mostBookedMonth: 'August',
      mostPopularService: '1-on-1 Career Coaching',
      testimonial: 'Working with Sarah completely transformed my career path.',
      testimonialGiverName: 'Alex Johnson',
      topPercentage: '5',
      rating: '4.9'
    });

    const jobId = renderResponse.data.jobId;
    console.log('Rendering started. Job ID:', jobId);

    // Step 3: Track progress with SSE
    const EventSource = require('eventsource');
    const eventSource = new EventSource(`${BASE_URL}/render-progress/${jobId}`);

    eventSource.addEventListener('progress', (e) => {
      const data = JSON.parse(e.data);
      console.log(`Progress: ${data.progress.toFixed(1)}%`);
    });

    eventSource.addEventListener('done', (e) => {
      const data = JSON.parse(e.data);
      console.log('Video ready!');
      console.log('Download URL:', data.downloadUrl);
      eventSource.close();
    });

    eventSource.addEventListener('error', (e) => {
      const data = JSON.parse(e.data);
      console.error('Error:', data.error);
      eventSource.close();
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateVideo();
```

### Python

```python
import requests
import json

BASE_URL = 'http://localhost:3001'

def generate_video():
    # Step 1: Upload profile picture (optional)
    profile_pic_url = None
    try:
        with open('profile.jpg', 'rb') as f:
            files = {'profilePic': f}
            response = requests.post(f'{BASE_URL}/upload-profile-pic', files=files)
            profile_pic_url = response.json()['url']
            print(f'Profile picture uploaded: {profile_pic_url}')
    except FileNotFoundError:
        print('No profile picture found, skipping upload')

    # Step 2: Start video rendering
    props = {
        'Profile_pic': profile_pic_url,
        'name': 'Sarah',
        'totalBookings': '247',
        'city1': 'Mumbai',
        'city2': 'Tokyo',
        'uniqueCitiesCount': '12',
        'mostBookedMonth': 'August',
        'mostPopularService': '1-on-1 Career Coaching',
        'testimonial': 'Working with Sarah completely transformed my career path.',
        'testimonialGiverName': 'Alex Johnson',
        'topPercentage': '5',
        'rating': '4.9'
    }

    response = requests.post(f'{BASE_URL}/render-video', json=props)
    job_id = response.json()['jobId']
    print(f'Rendering started. Job ID: {job_id}')

    # Step 3: Track progress with SSE
    with requests.get(f'{BASE_URL}/render-progress/{job_id}', stream=True) as r:
        for line in r.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    if 'progress' in data:
                        print(f"Progress: {data['progress']:.1f}%")
                    elif 'success' in data:
                        print('Video ready!')
                        print(f"Download URL: {data['downloadUrl']}")
                        break
                    elif 'error' in data:
                        print(f"Error: {data['error']}")
                        break

if __name__ == '__main__':
    generate_video()
```

### cURL

```bash
#!/bin/bash

# Step 1: Upload profile picture
PROFILE_PIC_RESPONSE=$(curl -s -X POST http://localhost:3001/upload-profile-pic \
  -F "profilePic=@./profile.jpg")

PROFILE_PIC_URL=$(echo $PROFILE_PIC_RESPONSE | jq -r '.url')
echo "Profile picture uploaded: $PROFILE_PIC_URL"

# Step 2: Start video rendering
RENDER_RESPONSE=$(curl -s -X POST http://localhost:3001/render-video \
  -H "Content-Type: application/json" \
  -d "{
    \"Profile_pic\": \"$PROFILE_PIC_URL\",
    \"name\": \"Sarah\",
    \"totalBookings\": \"247\",
    \"city1\": \"Mumbai\",
    \"city2\": \"Tokyo\",
    \"uniqueCitiesCount\": \"12\",
    \"mostBookedMonth\": \"August\",
    \"mostPopularService\": \"1-on-1 Career Coaching\",
    \"testimonial\": \"Working with Sarah completely transformed my career path.\",
    \"testimonialGiverName\": \"Alex Johnson\",
    \"topPercentage\": \"5\",
    \"rating\": \"4.9\"
  }")

JOB_ID=$(echo $RENDER_RESPONSE | jq -r '.jobId')
echo "Rendering started. Job ID: $JOB_ID"

# Step 3: Track progress
echo "Tracking progress..."
curl -N http://localhost:3001/render-progress/$JOB_ID
```

---

## Error Responses

### Background Video Too Short

```json
{
  "error": "Background video is too short. Required: 97 seconds, Got: 60 seconds"
}
```

**Solution:** Ensure `public/bg_final.mp4` is at least 97 seconds long.

### Missing Required Field

If a required field is missing, the video will render but may display default values or cause visual issues. Ensure all required fields are provided.

### Invalid Job ID

```
404 Not Found
```

**Solution:** Verify the `jobId` is correct and the job exists.

---

## Video Scene Breakdown

Your generated video will contain these scenes:

| Scene | Duration | Content | Props Used |
|-------|----------|---------|------------|
| **Scene 0: Intro** | 0-10s | "{{NAME}}'S TOPMATE RECAP 2025" | `name` |
| **Scene 1: The Journey** | 10-19s | "TOTAL BOOKINGS: {{totalBookings}}" | `totalBookings` |
| **Scene 2: The Reach** | 19-29s | "FROM {{city1}} TO {{city2}}" + "{{uniqueCitiesCount}} UNIQUE CITIES" | `city1`, `city2`, `uniqueCitiesCount` |
| **Scene 3: The Peak** | 29-39s | "{{mostBookedMonth}} WAS YOUR BUSIEST MONTH" | `mostBookedMonth` |
| **Scene 4: The Signature** | 39-49s | "YOUR SIGNATURE {{mostPopularService}}" | `mostPopularService` |
| **Scene 5: The Voices** | 49-68s | Client testimonial display | `testimonial`, `testimonialGiverName` |
| **Scene 6: The Summit** | 68-78s | "TOP {{topPercentage}}%" | `topPercentage` |
| **Scene 7: The Stars** | 78-88s | "AVERAGE RATING {{rating}}/5" | `rating` |
| **Scene 8: Outro** | 88-97s | "THAT WAS 2025" → "ONTO 2026" | - |

**Profile Picture:** Appears in bottom-right corner throughout entire video (if provided).

---

## Rate Limits & Performance

- **Preview Generation:** ~4 seconds
- **Full Video Rendering:** 5-15 minutes (varies by system)
- **Concurrent Renders:** Supported (each gets unique `jobId`)
- **File Retention:** Rendered videos remain in `outputs/` directory until manually deleted
- **Bundle Caching:** First render triggers bundling (~30s), subsequent renders use cached bundle

---

## Deployment Considerations

### Production Checklist

1. **Change Base URL:** Update `BASE_URL` in your client code
2. **Secure Uploads:** Add file validation (size, type, dimensions)
3. **Add Authentication:** Protect endpoints with API keys or JWT
4. **Storage Strategy:** Use cloud storage (S3, GCS) instead of local `outputs/` directory
5. **CDN Integration:** Serve rendered videos via CDN for faster delivery
6. **Background Jobs:** Consider using queue system (Bull, BullMQ) for scaling
7. **Resource Limits:** Set memory/CPU limits for Remotion rendering
8. **Cleanup Strategy:** Implement automated cleanup for old videos
9. **Error Monitoring:** Add logging and error tracking (Sentry, LogRocket)
10. **CORS Configuration:** Restrict origins in production

### Environment Variables

Create a `.env` file:

```bash
PORT=3001
OUTPUT_DIR=./outputs
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760  # 10MB
VIDEO_RETENTION_DAYS=7
API_KEY_SECRET=your-secret-key
```

### Nginx Reverse Proxy Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # SSE support
        proxy_buffering off;
        proxy_cache off;
    }

    # Serve static videos directly
    location /outputs/ {
        alias /var/www/video-generator/outputs/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Troubleshooting

### Issue: "Background video is too short"

**Cause:** `public/bg_final.mp4` is shorter than 97 seconds.
**Solution:** Replace with a video >= 97 seconds, or adjust `durationInFrames` in `src/Root.tsx`.

### Issue: Profile picture not showing

**Cause:** Invalid file path or URL.
**Solution:**
- Ensure uploaded path is absolute (e.g., `D:\path\to\file.jpg`)
- For URLs, ensure they're publicly accessible
- Check file exists at the specified path

### Issue: Rendering stuck at 0%

**Cause:** Bundle generation in progress.
**Solution:** Wait 30-60 seconds for initial bundle creation. Subsequent renders will be faster.

### Issue: Video has black frames

**Cause:** Background video codec incompatibility.
**Solution:** Re-encode `bg_final.mp4` using:
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 192k bg_final.mp4
```

### Issue: SSE connection drops

**Cause:** Network timeout or proxy buffering.
**Solution:**
- Increase server timeout settings
- Disable proxy buffering for `/render-progress/*` routes
- Use WebSocket alternative for long-running renders

---

## Support

For issues, questions, or feature requests:

1. Check the [README.md](./README.md) for setup instructions
2. Review [PROPS_SUMMARY.md](./PROPS_SUMMARY.md) for prop validation details
3. Consult [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for integration examples

---

## License

MIT License - See LICENSE file for details

---

**Last Updated:** December 2025
**API Version:** 1.0.0
**Remotion Version:** 4.0.0
