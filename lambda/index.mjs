// Stateless orchestrator for the Loop launch film popup.
// Deployed in account 072528252688 (us-east-1) as a Lambda Function URL.
//
// Routes:
//   POST /render { username, user_id }  → kick off Remotion Lambda render
//   GET  /progress/:renderId?user_id=N  → poll progress; on done, register UserShareContent
//   GET  /health                        → liveness
//
// State is externalized: jobId == Remotion's renderId (Lambda tracks its own
// render state); per-user cache is an S3 HEAD on a deterministic key.

import {
  renderMediaOnLambda,
  getRenderProgress,
} from '@remotion/lambda/client';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';

const FUNCTION = process.env.LAMBDA_FUNCTION;
const REGION = process.env.LAMBDA_REGION || 'us-east-1';
const SERVE_URL = process.env.LAMBDA_SERVE_URL;
const BUCKET = process.env.LAMBDA_BUCKET || 'remotionlambda-useast1-unuossiqe1';
const BACKEND = (process.env.BACKEND_URL || 'https://api.galactus.run').replace(/\/$/, '');
const TOKEN = process.env.REMOTION_TOKEN || '';
const FRAMES_PER_LAMBDA = Number(process.env.LAMBDA_FRAMES_PER_LAMBDA || 80);
const COMPOSITION = 'loop-sharing-template';
const CAMPAIGN = 'loop_video_sharing';
const SHARE_TITLE = 'Topmate Loop launch film';
const SHARE_DESCRIPTION = 'Your one-of-one launch film for Loop';

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
const filmKey = (username) => `launch-films/${username}.mp4`;

async function s3Exists(key) {
  try {
    const r = await fetch(publicS3Url(key), { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

async function fetchUserData(username) {
  const r = await fetch(`${BACKEND}/year-end-recap/${encodeURIComponent(username)}/`);
  if (r.status === 404) {
    const err = new Error(`User '${username}' not found on ${BACKEND}`);
    err.code = 'USER_NOT_FOUND';
    throw err;
  }
  if (!r.ok) throw new Error(`HTTP ${r.status} from ${BACKEND}`);
  const data = await r.json();
  return { profile_pic: data?.profile_pic ?? data?.data?.profile_pic ?? '' };
}

async function registerShareContent({ user_id, video_url }) {
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
      campaign: CAMPAIGN,
      title: SHARE_TITLE,
      description: SHARE_DESCRIPTION,
    }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    return { error: `register HTTP ${r.status}: ${JSON.stringify(body).slice(0, 200)}` };
  }
  return { ok: true };
}

async function handleRender(event) {
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  const username = (body.username || '').trim();
  const user_id = body.user_id;
  if (!username) return cors({ statusCode: 400, body: { error: 'username required' } });

  const key = filmKey(username);

  if (await s3Exists(key)) {
    const url = publicS3Url(key);
    const share = await registerShareContent({ user_id, video_url: url });
    return cors({ body: { status: 'ready', video_url: url, cached: true, share } });
  }

  let profile_pic = '';
  try {
    ({ profile_pic } = await fetchUserData(username));
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return cors({ statusCode: 404, body: { error: err.message } });
    }
    return cors({ statusCode: 500, body: { error: String(err.message || err) } });
  }

  try {
    const { renderId } = await renderMediaOnLambda({
      functionName: FUNCTION,
      region: REGION,
      serveUrl: SERVE_URL,
      composition: COMPOSITION,
      codec: 'h264',
      inputProps: { username, apiBase: BACKEND, profile_pic },
      privacy: 'public',
      outName: key,
      framesPerLambda: FRAMES_PER_LAMBDA,
      scale: 0.5,
      x264Preset: 'ultrafast',
      crf: 26,
      jpegQuality: 70,
      audioCodec: 'aac',
      audioBitrate: '128k',
    });
    return cors({ body: { status: 'rendering', jobId: renderId } });
  } catch (err) {
    return cors({ statusCode: 500, body: { error: String(err.message || err) } });
  }
}

async function handleProgress(event, renderId) {
  const user_id = event.queryStringParameters?.user_id;
  let p;
  try {
    p = await getRenderProgress({
      renderId,
      bucketName: BUCKET,
      functionName: FUNCTION,
      region: REGION,
    });
  } catch (err) {
    return cors({ statusCode: 500, body: { status: 'error', error: String(err.message || err) } });
  }

  if (p.fatalErrorEncountered) {
    const errMsg = (p.errors || []).map((e) => e?.message || String(e)).join('; ');
    return cors({ statusCode: 500, body: { status: 'error', error: errMsg || 'Lambda render failed' } });
  }

  if (!p.done) {
    return cors({ body: { status: 'rendering', progress: p.overallProgress } });
  }

  let videoUrl = p.outputFile;
  try {
    const out = new URL(p.outputFile);
    const segments = out.pathname.split('/').filter(Boolean);
    let key;
    if (segments[0] === BUCKET) {
      key = segments.slice(1).join('/');
    } else {
      key = segments.join('/');
    }
    const usernameMatch = key.match(/launch-films\/([^/]+)\.mp4$/);
    if (usernameMatch) {
      const username = usernameMatch[1];
      const destKey = filmKey(username);
      await s3.send(new CopyObjectCommand({
        Bucket: BUCKET,
        CopySource: encodeURI(`${BUCKET}/${key}`),
        Key: destKey,
        ACL: 'public-read',
        ContentType: 'video/mp4',
        MetadataDirective: 'REPLACE',
      }));
      videoUrl = publicS3Url(destKey);
    }
  } catch (err) {
    console.error('[copy] failed:', err?.name, err?.message);
  }

  const share = await registerShareContent({ user_id, video_url: videoUrl });
  return cors({
    body: { status: 'ready', progress: 1, video_url: videoUrl, share },
  });
}

export const handler = async (event) => {
  const path = event.requestContext?.http?.path || event.rawPath || '/';
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

  if (method === 'OPTIONS') return cors({ statusCode: 204 });
  if (method === 'GET' && path === '/health') return cors({ body: { ok: true } });
  if (method === 'POST' && path === '/render') return handleRender(event);
  if (method === 'GET' && path.startsWith('/progress/')) {
    const renderId = path.slice('/progress/'.length);
    if (!renderId) return cors({ statusCode: 400, body: { error: 'renderId required' } });
    return handleProgress(event, renderId);
  }
  return cors({ statusCode: 404, body: { error: 'not found', path, method } });
};
