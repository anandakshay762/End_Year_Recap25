import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import {
  renderMediaOnLambda,
  getRenderProgress as getLambdaProgress,
} from '@remotion/lambda/client';
import { films as filmsRegistry } from './lambda/films.config.mjs';

const runBin = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'out');
const PORT = 3002;

// Topmate backend used for both the user lookup (year-end-recap prefetch) AND
// the post-render UserShareContent registration. Default = galactus (prod),
// where SharingPostTemplate id=1312 (loop video sharing) lives.
// Override per-call to staging: `BACKEND_URL=https://api.gravitron.run`.
const BACKEND_URL = process.env.BACKEND_URL || 'https://api.galactus.run';
// Keep API_BASE separately overridable, but default it to the same backend so
// prefetch/lookup and share-content register stay consistent.
const API_BASE = process.env.API_BASE || BACKEND_URL;
const REMOTION_TOKEN = process.env.REMOTION_TOKEN || '';
// Externally-reachable URL of THIS render server. Override to your ngrok host
// when you want anyone other than your local browser to play back the URL we
// register with the backend (PUBLIC_BASE/video/<file>.mp4).
const PUBLIC_BASE = process.env.PUBLIC_BASE || `http://localhost:${3002}`;

// Lambda mode — when USE_LAMBDA=true the server skips the local head+tail
// pipeline and dispatches the render to AWS Lambda. Output lands in public S3
// (URL is what gets registered in UserShareContent), so any browser can play.
const USE_LAMBDA = process.env.USE_LAMBDA === 'true';
const LAMBDA_FUNCTION =
  process.env.LAMBDA_FUNCTION ||
  'arn:aws:lambda:us-east-1:072528252688:function:remotion-render-4-0-340-mem2048mb-disk2048mb-120sec';
const LAMBDA_REGION = process.env.LAMBDA_REGION || 'us-east-1';
const LAMBDA_SERVE_URL =
  process.env.LAMBDA_SERVE_URL ||
  'https://remotionlambda-useast1-unuossiqe1.s3.us-east-1.amazonaws.com/sites/topmate-loop-launch-renderer/index.html';

// Frames before this are visually identical to the source video — pre-encode once.
// Frames from this onward are rendered per-user (image overlay appears at 1118).
const HEAD_FRAMES = 1110;
const SRC_VIDEO = path.join(__dirname, 'public/loop-launch-sharing-template-1080p30.mp4');
const HEAD_PATH = path.join(OUT_DIR, '_head-720p.mp4');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('[server] Bundling Remotion project…');
const serveUrl = await bundle({
  entryPoint: path.join(__dirname, 'src/index.ts'),
  webpackOverride: (c) => c,
});
console.log('[server] Bundle ready.');

// Pre-encode the unchanged head once at startup. Same codec params as renderMedia
// (libx264, ultrafast, crf 26, yuv420p, 720p) so concat-demuxer stream-copy works.
async function ensureHead() {
  if (fs.existsSync(HEAD_PATH)) {
    console.log('[server] Head cache hit.');
    return;
  }
  console.log('[server] Pre-encoding head…');
  const t = Date.now();
  // 1110 frames @ 30fps = 37.0s exact; -to clips both video AND audio cleanly.
  await runBin('ffmpeg', [
    '-y', '-i', SRC_VIDEO,
    '-to', '37.0',
    '-vf', 'scale=1280:720:flags=fast_bilinear',
    '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'fastdecode',
    '-crf', '26', '-pix_fmt', 'yuv420p',
    '-profile:v', 'high', '-level', '4.0',
    '-r', '30', '-video_track_timescale', '15360',
    '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '48000',
    '-movflags', '+faststart',
    HEAD_PATH,
  ]);
  console.log(`[server] Head ready (${Date.now() - t}ms): ${HEAD_PATH}`);
}
await ensureHead();

const jobs = new Map();
// key = `${film}:${username}`, value = { mode, videoUrl } (lambda) or fileName (local)
const cacheByKey = new Map();

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

function send(res, code, body, extraHeaders = {}) {
  res.writeHead(code, { 'content-type': 'application/json', ...cors, ...extraHeaders });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

async function concatHeadAndTail(tailPath, finalPath) {
  // Filter-based concat — re-encodes but produces correct timestamps and splices A+V.
  // 44s of 720p with libx264 ultrafast ≈ 1s.
  await runBin('ffmpeg', [
    '-y', '-i', HEAD_PATH, '-i', tailPath,
    '-filter_complex', '[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]',
    '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '26',
    '-pix_fmt', 'yuv420p', '-r', '30',
    '-c:a', 'aac', '-b:a', '128k', '-ar', '48000',
    '-movflags', '+faststart',
    finalPath,
  ]);
}

async function registerShareContent({ user_id, video_url, film }) {
  if (!user_id) return { skipped: 'no user_id' };
  if (!REMOTION_TOKEN) return { skipped: 'no REMOTION_TOKEN' };

  const url = `${BACKEND_URL.replace(/\/$/, '')}/create-topmate-recap-share-content/`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-remotion-token': REMOTION_TOKEN,
    },
    body: JSON.stringify({
      user_id,
      video_url,
      campaign: film.share.campaign,
      title: film.share.title,
      description: film.share.description,
    }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(`share-content register HTTP ${r.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return { ok: true, body };
}

async function startLambdaRender(username, user_id, filmName) {
  filmName = filmName || 'loop-sharing-template';
  const film = filmsRegistry[filmName];
  if (!film) throw Object.assign(new Error(`unknown_film: ${filmName}`), { code: 'UNKNOWN_FILM' });

  const jobId = `lambda-${filmName}-${username}-${Date.now()}`;
  const t0 = Date.now();

  const { inputProps, raw } = await film.prefetch(username, API_BASE);

  const elig = film.eligibility(raw);
  if (!elig.ok) {
    throw Object.assign(
      new Error(elig.reason || 'not eligible'),
      { code: 'NOT_ELIGIBLE', reason: elig.reason },
    );
  }

  const outName = `${film.outDir}/${username}.mp4`;

  const { renderId, bucketName } = await renderMediaOnLambda({
    functionName: LAMBDA_FUNCTION,
    region: LAMBDA_REGION,
    serveUrl: LAMBDA_SERVE_URL,
    composition: film.compositionId,
    codec: 'h264',
    inputProps,
    privacy: 'public',
    outName,
    framesPerLambda: film.framesPerLambda,
  });

  jobs.set(jobId, {
    status: 'rendering',
    progress: 0,
    fileName: null,
    username,
    user_id,
    film,
    filmName,
    error: null,
    share: null,
    mode: 'lambda',
    renderId,
    bucketName,
    t0,
  });

  console.log(`[server] λ ${jobId} started  renderId=${renderId}`);
  return jobId;
}

// Polled lazily from /progress/:jobId — drives Lambda → S3 → UserShareContent.
async function lambdaTick(jobId) {
  const job = jobs.get(jobId);
  if (!job || job.mode !== 'lambda' || job.status !== 'rendering') return job;

  const p = await getLambdaProgress({
    renderId: job.renderId,
    bucketName: job.bucketName,
    functionName: LAMBDA_FUNCTION,
    region: LAMBDA_REGION,
  });

  if (p.fatalErrorEncountered) {
    const errMsg = (p.errors || []).map((e) => e?.message || String(e)).join('; ');
    jobs.set(jobId, { ...job, status: 'error', error: errMsg || 'Lambda render failed' });
    console.error(`[server] ✗ ${jobId} fatal: ${errMsg}`);
    return jobs.get(jobId);
  }

  if (!p.done) {
    jobs.set(jobId, { ...job, progress: p.overallProgress });
    return jobs.get(jobId);
  }

  // Done — register share content (best-effort).
  let shareResult = null;
  try {
    shareResult = await registerShareContent({
      user_id: job.user_id,
      video_url: p.outputFile,
      film: job.film,
    });
  } catch (err) {
    shareResult = { error: String(err.message || err) };
    console.error(`[server] share-content register failed for ${jobId}:`, err.message || err);
  }

  const tTotal = Date.now() - job.t0;
  jobs.set(jobId, {
    ...job,
    status: 'done',
    progress: 1,
    videoUrl: p.outputFile,
    share: shareResult,
    ms: tTotal,
  });
  cacheByKey.set(`${job.filmName}:${job.username}`, { mode: 'lambda', videoUrl: p.outputFile });
  console.log(
    `[server] ✓ λ ${jobId}  total=${tTotal}ms  url=${p.outputFile}  share=${shareResult?.ok ? 'registered' : shareResult?.skipped ? `skipped: ${shareResult.skipped}` : shareResult?.error ? 'FAILED' : 'n/a'}`,
  );
  return jobs.get(jobId);
}

async function startRender(username, user_id, filmName) {
  filmName = filmName || 'loop-sharing-template';
  const film = filmsRegistry[filmName];
  if (!film) throw Object.assign(new Error(`unknown_film: ${filmName}`), { code: 'UNKNOWN_FILM' });

  // HEAD/TAIL ffmpeg optimization is tightly coupled to the loop-sharing-template
  // pre-encoded head video. Other films must use USE_LAMBDA=true.
  if (film.compositionId !== 'loop-sharing-template') {
    throw Object.assign(
      new Error(`film '${filmName}' requires USE_LAMBDA=true`),
      { code: 'LAMBDA_REQUIRED' },
    );
  }

  const COMPOSITION_ID = film.compositionId;
  const jobId = `${username}-${Date.now()}`;
  const tailFile = `_tail-${jobId}.mp4`;
  const finalFile = `${jobId}.mp4`;
  const tailPath = path.join(OUT_DIR, tailFile);
  const finalPath = path.join(OUT_DIR, finalFile);
  const t0 = Date.now();

  const { inputProps: prefetchedProps } = await film.prefetch(username, API_BASE);
  const { profile_pic } = prefetchedProps;
  const inputProps = { username, apiBase: API_BASE, profile_pic };
  const tFetch = Date.now() - t0;

  const composition = await selectComposition({ serveUrl, id: COMPOSITION_ID, inputProps });
  const tSelect = Date.now() - t0;

  jobs.set(jobId, { status: 'rendering', progress: 0, fileName: finalFile, username, user_id, film, filmName, error: null, share: null });

  // Render ONLY frames HEAD_FRAMES → end (the only ones that differ from the source).
  const tailRange = [HEAD_FRAMES, composition.durationInFrames - 1];

  renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: tailPath,
    inputProps,
    frameRange: tailRange,
    onProgress: ({ progress }) => {
      const j = jobs.get(jobId);
      if (j) jobs.set(jobId, { ...j, progress: progress * 0.9 });
    },
    concurrency: null,
    x264Preset: 'ultrafast',
    crf: 26,
    jpegQuality: 70,
    scale: 0.667,
    chromiumOptions: { headless: true, gl: 'angle' },
    audioCodec: 'aac',
    audioBitrate: '128k',
    enforceAudioTrack: true,
  })
    .then(async () => {
      const tRender = Date.now() - t0;
      const tConcatStart = Date.now();
      await concatHeadAndTail(tailPath, finalPath);
      const tConcat = Date.now() - tConcatStart;
      fs.unlink(tailPath, () => {});

      const publicVideoUrl = `${PUBLIC_BASE.replace(/\/$/, '')}/video/${finalFile}`;

      // Best-effort register UserShareContent for this user.
      let shareResult = null;
      const tShareStart = Date.now();
      try {
        shareResult = await registerShareContent({ user_id, video_url: publicVideoUrl, film });
      } catch (err) {
        shareResult = { error: String(err.message || err) };
        console.error(`[server] share-content register failed for ${jobId}:`, err.message || err);
      }
      const tShare = Date.now() - tShareStart;

      const tTotal = Date.now() - t0;
      jobs.set(jobId, { ...jobs.get(jobId), status: 'done', progress: 1, ms: tTotal, share: shareResult });
      cacheByKey.set(`${filmName}:${username}`, finalFile);
      console.log(
        `[server] ✓ ${jobId}  total=${tTotal}ms  prefetch=${tFetch}ms  select=${tSelect - tFetch}ms  render=${tRender - tSelect}ms  concat=${tConcat}ms  share=${tShare}ms${shareResult?.ok ? ' (registered)' : shareResult?.skipped ? ` (skipped: ${shareResult.skipped})` : shareResult?.error ? ' (FAILED)' : ''}  frames=[${tailRange[0]}..${tailRange[1]}]`,
      );
    })
    .catch((err) => {
      console.error(`[server] ✗ ${jobId}:`, err);
      jobs.set(jobId, { ...jobs.get(jobId), status: 'error', error: String(err.message || err) });
    });

  return jobId;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/render') {
    try {
      const body = await readJson(req);
      const username = (body.username || '').trim();
      const user_id = Number.isFinite(body.user_id) ? body.user_id : null;
      const filmName = body.film || 'loop-sharing-template';

      if (!username) return send(res, 400, { error: 'username required' });
      if (!filmsRegistry[filmName]) return send(res, 400, { error: 'unknown_film' });

      const cacheKey = `${filmName}:${username}`;
      const cached = cacheByKey.get(cacheKey);
      // Lambda cache (S3 URL) — return immediately + idempotent re-register.
      if (USE_LAMBDA && cached && typeof cached === 'object' && cached.mode === 'lambda') {
        let share = null;
        try {
          share = await registerShareContent({ user_id, video_url: cached.videoUrl, film: filmsRegistry[filmName] });
        } catch (err) {
          share = { error: String(err.message || err) };
        }
        return send(res, 200, { status: 'ready', video_url: cached.videoUrl, cached: true, share });
      }
      // Local cache (file on disk).
      if (!USE_LAMBDA && typeof cached === 'string' && fs.existsSync(path.join(OUT_DIR, cached))) {
        const publicVideoUrl = `${PUBLIC_BASE.replace(/\/$/, '')}/video/${cached}`;
        let share = null;
        try {
          share = await registerShareContent({ user_id, video_url: publicVideoUrl, film: filmsRegistry[filmName] });
        } catch (err) {
          share = { error: String(err.message || err) };
        }
        return send(res, 200, { status: 'ready', video_url: publicVideoUrl, cached: true, share });
      }

      try {
        const jobId = USE_LAMBDA
          ? await startLambdaRender(username, user_id, filmName)
          : await startRender(username, user_id, filmName);
        return send(res, 200, { status: 'rendering', jobId, mode: USE_LAMBDA ? 'lambda' : 'local' });
      } catch (e) {
        if (e.code === 'USER_NOT_FOUND') return send(res, 404, { error: e.message });
        if (e.code === 'NOT_ELIGIBLE') return send(res, 422, { error: 'not_eligible', reason: e.reason });
        if (e.code === 'LAMBDA_REQUIRED') return send(res, 400, { error: e.message });
        if (e.code === 'UNKNOWN_FILM') return send(res, 400, { error: 'unknown_film' });
        return send(res, 502, { error: 'backend_unavailable', detail: String(e.message || e) });
      }
    } catch (e) {
      if (e.code === 'USER_NOT_FOUND') return send(res, 404, { error: e.message });
      return send(res, 500, { error: String(e.message || e) });
    }
  }

  if (req.method === 'GET' && url.pathname.startsWith('/progress/')) {
    const jobId = url.pathname.slice('/progress/'.length);
    let job = jobs.get(jobId);
    if (!job) return send(res, 404, { error: 'unknown job' });
    // Lambda jobs poll on demand — each /progress hit advances the state.
    if (job.mode === 'lambda' && job.status === 'rendering') {
      try {
        job = await lambdaTick(jobId);
      } catch (err) {
        return send(res, 500, { status: 'error', error: String(err.message || err) });
      }
    }
    if (job.status === 'done') {
      const videoUrl = job.mode === 'lambda'
        ? job.videoUrl
        : `${PUBLIC_BASE.replace(/\/$/, '')}/video/${job.fileName}`;
      return send(res, 200, { status: 'ready', progress: 1, video_url: videoUrl, share: job.share });
    }
    if (job.status === 'error') return send(res, 500, { status: 'error', error: job.error });
    return send(res, 200, { status: 'rendering', progress: job.progress });
  }

  if (req.method === 'GET' && url.pathname.startsWith('/video/')) {
    const fileName = url.pathname.slice('/video/'.length);
    const filePath = path.join(OUT_DIR, fileName);
    if (!filePath.startsWith(OUT_DIR) || !fs.existsSync(filePath)) {
      return send(res, 404, { error: 'not found' });
    }
    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    const headers = { 'content-type': 'video/mp4', 'accept-ranges': 'bytes', ...cors };
    if (range) {
      const [s, e] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(s, 10);
      const end = e ? parseInt(e, 10) : stat.size - 1;
      res.writeHead(206, {
        ...headers,
        'content-range': `bytes ${start}-${end}/${stat.size}`,
        'content-length': end - start + 1,
      });
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...headers, 'content-length': stat.size });
    return fs.createReadStream(filePath).pipe(res);
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { ok: true, jobs: jobs.size, cached: cacheByKey.size });
  }

  send(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`[server] Render API on http://localhost:${PORT}`);
  console.log(`[server]   POST /render          { "username": "dinesh", "film": "loop-sharing-template" }`);
  console.log(`[server]   GET  /progress/:jobId`);
  console.log(`[server]   GET  /video/:fileName`);
});
