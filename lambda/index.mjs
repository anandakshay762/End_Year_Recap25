// Stateless orchestrator for personalized films (Loop launch + testimonial reel + …).
// Deployed in account 072528252688 (us-east-1) as a Lambda Function URL.
//
// Routes:
//   POST /render { username, user_id, film }            → kick off render
//   GET  /progress/:renderId?user_id=N&film=<id>        → poll, on done copy + register share
//   GET  /eligibility/:film/:username                   → cheap (no render) eligibility check
//   GET  /health                                        → liveness
//
// State is externalized: anonymous S3 HEAD on `<film.outDir>/<username>.mp4` is the cache.

import {
  renderMediaOnLambda,
  getRenderProgress,
} from '@remotion/lambda/client';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';
import { films } from './films.config.mjs';

const FUNCTION = process.env.LAMBDA_FUNCTION;
const REGION = process.env.LAMBDA_REGION || 'us-east-1';
const SERVE_URL = process.env.LAMBDA_SERVE_URL;
const BUCKET = process.env.LAMBDA_BUCKET || 'remotionlambda-useast1-unuossiqe1';
const BACKEND = (process.env.BACKEND_URL || 'https://api.galactus.run').replace(/\/$/, '');
const TOKEN = process.env.REMOTION_TOKEN || '';

const s3 = new S3Client({ region: REGION });

const cors = ({ statusCode = 200, body = null } = {}) => ({
  statusCode,
  headers: {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'content-type': 'application/json',
  },
  body: body == null ? '' : JSON.stringify(body),
});

const publicS3Url = (key) => `https://s3.${REGION}.amazonaws.com/${BUCKET}/${key}`;
const filmKey = (film, username) => `${film.outDir}/${username}.mp4`;

async function s3Exists(key) {
  try {
    const r = await fetch(publicS3Url(key), { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

async function registerShareContent({ user_id, video_url, film }) {
  if (!user_id || !TOKEN) return { skipped: 'missing user_id or token' };
  const r = await fetch(`${BACKEND}/create-topmate-recap-share-content/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-remotion-token': TOKEN,
    },
    body: JSON.stringify({
      user_id: Number(user_id),
      video_url,
      campaign: film.share.campaign,
      title: film.share.title,
      description: film.share.description,
    }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    return { error: `register HTTP ${r.status}: ${JSON.stringify(body).slice(0, 200)}` };
  }
  return { ok: true };
}

// ───────── route handlers ─────────

async function handleRender(event) {
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  const username = (body.username || '').trim();
  const user_id = body.user_id;
  // Back-compat: existing TopMateRecapPopup omits `film`. Default to loop until
  // it's retired (Phase 3 ships the new popup behind a flag; until 100%
  // rollout, both clients hit this Lambda).
  const filmKeyName = body.film || 'loop-sharing-template';
  const film = films[filmKeyName];
  if (!username) return cors({ statusCode: 400, body: { error: 'username required' } });
  if (!film) return cors({ statusCode: 400, body: { error: 'unknown_film' } });

  const key = filmKey(film, username);

  // 1. Cache hit → re-register share + return.
  if (await s3Exists(key)) {
    const url = publicS3Url(key);
    const share = await registerShareContent({ user_id, video_url: url, film });
    return cors({ body: { status: 'ready', video_url: url, cached: true, share } });
  }

  // 2. Prefetch + eligibility.
  let inputProps;
  let raw;
  try {
    ({ inputProps, raw } = await film.prefetch(username, BACKEND));
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return cors({ statusCode: 404, body: { error: err.message } });
    }
    return cors({ statusCode: 502, body: { error: 'backend_unavailable', detail: String(err.message || err) } });
  }
  const elig = film.eligibility(raw);
  if (!elig.ok) {
    return cors({ statusCode: 422, body: { error: 'not_eligible', reason: elig.reason } });
  }

  // 3. Dispatch render.
  try {
    const { renderId } = await renderMediaOnLambda({
      functionName: FUNCTION,
      region: REGION,
      serveUrl: SERVE_URL,
      composition: film.compositionId,
      codec: 'h264',
      inputProps,
      privacy: 'public',
      outName: key,
      framesPerLambda: film.framesPerLambda,
      scale: 0.5,
      x264Preset: 'ultrafast',
      crf: 26,
      jpegQuality: 70,
      audioCodec: 'aac',
      audioBitrate: '128k',
    });
    return cors({ body: { status: 'rendering', jobId: renderId, film: filmKeyName } });
  } catch (err) {
    return cors({ statusCode: 500, body: { error: String(err.message || err) } });
  }
}

async function handleProgress(event, renderId) {
  const user_id = event.queryStringParameters?.user_id;
  const filmKeyName = event.queryStringParameters?.film || 'loop-sharing-template';
  const film = films[filmKeyName];
  if (!film) return cors({ statusCode: 400, body: { error: 'unknown_film' } });

  let p;
  try {
    p = await getRenderProgress({
      renderId, bucketName: BUCKET, functionName: FUNCTION, region: REGION,
    });
  } catch (err) {
    return cors({ statusCode: 500, body: { status: 'error', error: String(err.message || err) } });
  }

  if (p.fatalErrorEncountered) {
    const errMsg = (p.errors || []).map((e) => e?.message || String(e)).join('; ');
    return cors({ statusCode: 500, body: { status: 'error', error: errMsg || 'Lambda render failed' } });
  }

  if (!p.done) return cors({ body: { status: 'rendering', progress: p.overallProgress } });

  // Render done. Copy renders/<renderId>/<outName> → <outDir>/<username>.mp4
  // so subsequent /render hits cache.
  let videoUrl = p.outputFile;
  try {
    const out = new URL(p.outputFile);
    const segments = out.pathname.split('/').filter(Boolean);
    const key = segments[0] === BUCKET ? segments.slice(1).join('/') : segments.join('/');
    const match = key.match(new RegExp(`${film.outDir}/([^/]+)\\.mp4$`));
    if (match) {
      const username = match[1];
      const destKey = filmKey(film, username);
      await s3.send(new CopyObjectCommand({
        Bucket: BUCKET, CopySource: encodeURI(`${BUCKET}/${key}`),
        Key: destKey, ACL: 'public-read', ContentType: 'video/mp4',
        MetadataDirective: 'REPLACE',
      }));
      videoUrl = publicS3Url(destKey);
    }
  } catch (err) {
    console.error('[copy] failed:', err?.name, err?.message);
  }

  const share = await registerShareContent({ user_id, video_url: videoUrl, film });
  return cors({ body: { status: 'ready', progress: 1, video_url: videoUrl, share } });
}

async function handleEligibility(event, filmKeyName, username) {
  const film = films[filmKeyName];
  if (!film) return cors({ statusCode: 400, body: { error: 'unknown_film' } });
  if (!username) return cors({ statusCode: 400, body: { error: 'username required' } });
  try {
    const { raw } = await film.prefetch(username, BACKEND);
    return cors({ body: film.eligibility(raw) });
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return cors({ statusCode: 404, body: { error: err.message } });
    }
    return cors({ statusCode: 502, body: { error: 'backend_unavailable', detail: String(err.message || err) } });
  }
}

export const handler = async (event) => {
  const path = event.requestContext?.http?.path || event.rawPath || '/';
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

  if (method === 'OPTIONS') return cors({ statusCode: 204 });
  if (method === 'GET' && path === '/health') return cors({ body: { ok: true } });
  if (method === 'POST' && path === '/render') return handleRender(event);
  if (method === 'GET' && path.startsWith('/progress/')) {
    const renderId = path.slice('/progress/'.length);
    return renderId
      ? handleProgress(event, renderId)
      : cors({ statusCode: 400, body: { error: 'renderId required' } });
  }
  if (method === 'GET' && path.startsWith('/eligibility/')) {
    const [filmName, username] = path.slice('/eligibility/'.length).split('/');
    return handleEligibility(event, filmName, username);
  }
  return cors({ statusCode: 404, body: { error: 'not found', path, method } });
};
