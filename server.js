const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const { getVideoDurationInSeconds } = require('get-video-duration');

const app = express();
const PORT = 3001;

// Cache bundle to avoid re-bundling on every preview request
let cachedBundleLocation = null;
let bundlingPromise = null;
async function ensureBundled() {
  if (cachedBundleLocation) return cachedBundleLocation;
  if (!bundlingPromise) {
    console.log('Starting initial bundle (this may take a few seconds)...');
    bundlingPromise = bundle({ entryPoint: path.join(__dirname, 'src', 'index.ts') })
      .then((loc) => {
        cachedBundleLocation = loc;
        bundlingPromise = null;
        console.log('Initial bundle ready at:', loc);
        return loc;
      })
      .catch((err) => {
        bundlingPromise = null;
        throw err;
      });
  }
  return bundlingPromise;
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/outputs', express.static('outputs'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return absolute file path for Remotion to access
  const absolutePath = path.join(__dirname, 'public', 'uploads', req.file.filename);
  res.json({ url: absolutePath });
});

// Fast preview endpoint: renders first 5 seconds at 540x540
app.post('/preview', async (req, res) => {
  try {
    const inputProps = req.body;
    console.log('Preview request received:', { name: inputProps.name });
    const previewFrames = 60; // 4 seconds at 15fps (shorter for faster preview)
    const previewWidth = 360;
    const previewHeight = 360;
    const outputDir = path.join(__dirname, 'outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const previewFile = path.join(outputDir, `preview-${Date.now()}.mp4`);

    // Ensure we have a cached bundle (fast after first run)
    const bundleLocation = await ensureBundled();

    // Find composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'TopMateRecap2025',
      inputProps,
    });

    // Render preview video (short, low-res for speed)
    await renderMedia({
      serveUrl: bundleLocation,
      composition,
      codec: 'h264',
      outputLocation: previewFile,
      inputProps,
      startFrame: 0,
      endFrame: previewFrames - 1,
      width: previewWidth,
      height: previewHeight,
      fps: 15,
      overwrite: true,
    });

    // Return preview URL
    const previewUrl = `/outputs/${path.basename(previewFile)}`;
    res.json({ previewUrl });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

const { EventEmitter } = require('events');

// In-memory job tracking for progress events and final results
const jobEmitters = new Map(); // jobId -> EventEmitter
const jobResults = new Map(); // jobId -> { success, videoUrl, downloadUrl, error }

app.get('/render-progress/:jobId', (req, res) => {
  const { jobId } = req.params;

  // If job already finished, return final result immediately
  if (jobResults.has(jobId)) {
    const result = jobResults.get(jobId);
    res.json({ jobId, ...result });
    return;
  }

  const emitter = jobEmitters.get(jobId);
  if (!emitter) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Setup SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  const onProgress = (p) => {
    res.write(`event: progress\n`);
    res.write(`data: ${JSON.stringify({ progress: p })}\n\n`);
  };

  const onDone = (info) => {
    res.write(`event: done\n`);
    res.write(`data: ${JSON.stringify(info)}\n\n`);
    res.end();
  };

  const onError = (err) => {
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ error: err })}\n\n`);
    res.end();
  };

  emitter.on('progress', onProgress);
  emitter.on('done', onDone);
  emitter.on('error', onError);

  req.on('close', () => {
    emitter.off('progress', onProgress);
    emitter.off('done', onDone);
    emitter.off('error', onError);
  });
});

app.post('/render-video', (req, res) => {
  try {
    console.log('Received render request:', req.body);

    const inputProps = req.body;

    // Convert relative profile pic URL to absolute path if needed
    if (inputProps.Profile_pic && inputProps.Profile_pic.startsWith('/uploads/')) {
      inputProps.Profile_pic = path.join(__dirname, 'public', inputProps.Profile_pic);
    }

    const jobId = Date.now().toString() + '-' + Math.random().toString(36).slice(2, 8);
    const emitter = new EventEmitter();
    jobEmitters.set(jobId, emitter);

    // Respond immediately with jobId so the client can subscribe to progress
    res.status(202).json({ jobId });

    // Run the render job in background
    (async () => {
      try {
        const outputDir = path.join(__dirname, 'outputs');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `video-${Date.now()}.mp4`);

        // Validate background video duration to avoid compositor seeking past file duration
        const bgPath = path.join(__dirname, 'public', 'bg_final.mp4');
        try {
          if (fs.existsSync(bgPath)) {
            const dur = await getVideoDurationInSeconds(bgPath);
            const requiredSecs = 2910 / 30; // frames / fps from composition
            if (dur < requiredSecs - 0.5) {
              const errInfo = { success: false, error: `Background video too short (${dur.toFixed(2)}s). Required >= ${requiredSecs}s. Please replace or re-encode the file to at least ${requiredSecs}s.` };
              console.error(errInfo.error);
              jobResults.set(jobId, errInfo);
              emitter.emit('error', errInfo);
              return;
            }
          }
        } catch (err) {
          console.warn('Could not determine background video duration:', err.message);
        }

        console.log('Starting bundle process...');
        const bundleLocation = await bundle({
          entryPoint: path.join(__dirname, 'src', 'index.ts'),
          webpackOverride: (config) => config,
        });

        console.log('Bundle created at:', bundleLocation);

        const composition = await selectComposition({
          serveUrl: bundleLocation,
          id: 'TopMateRecap2025',
          inputProps,
        });

        console.log('Composition selected:', composition);
        console.log('Starting render process...');

        await renderMedia({
          composition,
          serveUrl: bundleLocation,
          codec: 'h264',
          outputLocation: outputPath,
          inputProps,
          onProgress: ({ progress }) => {
            const pct = Math.round(progress * 100);
            console.log(`Rendering progress: ${pct}%`);
            emitter.emit('progress', pct);
          },
        });

        console.log('Video rendered successfully at:', outputPath);

        const fileName = path.basename(outputPath);
        const result = {
          success: true,
          message: 'Video rendered successfully',
          videoUrl: `/outputs/${fileName}`,
          downloadUrl: `http://localhost:${PORT}/outputs/${fileName}`,
        };

        jobResults.set(jobId, result);
        emitter.emit('done', result);
      } catch (error) {
        console.error('Error rendering video (jobId:', jobId, '):', error);
        const errInfo = { success: false, error: error.message };
        jobResults.set(jobId, errInfo);
        emitter.emit('error', errInfo);
      } finally {
        // Cleanup emitter after a short delay to allow clients to receive final event
        setTimeout(() => {
          jobEmitters.delete(jobId);
        }, 5000);
      }
    })();

  } catch (error) {
    console.error('Failed to start render job:', error);
    res.status(500).json({ error: 'Failed to start render job', details: error.message });
  }
});

// Serve bundle files dynamically after ensuring bundling
app.get('/bundle/*', async (req, res) => {
  try {
    await ensureBundled();
    const relPath = req.path.replace(/^\/bundle\//, '');
    const filePath = path.join(cachedBundleLocation, relPath || 'index.html');
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Bundle file not found');
    }
  } catch (err) {
    res.status(500).send('Bundle not ready');
  }
});

// Debug: return bundle path and top-level files
app.get('/bundle-info', async (req, res) => {
  try {
    if (!cachedBundleLocation) {
      return res.json({ ready: false });
    }
    const entries = await fs.promises.readdir(cachedBundleLocation);
    res.json({ ready: true, path: cachedBundleLocation, entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Upload profile pictures and generate videos!`);

  // Start initial bundling in background so first preview is faster
  try {
    await ensureBundled();
  } catch (err) {
    console.warn('Initial bundle failed (it will be retried on first request):', err.message);
  }
});
