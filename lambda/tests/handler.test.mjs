import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.LAMBDA_FUNCTION = 'test-function';
process.env.LAMBDA_REGION = 'us-east-1';
process.env.LAMBDA_SERVE_URL = 'https://test/site/index.html';
process.env.LAMBDA_BUCKET = 'test-bucket';
process.env.BACKEND_URL = 'https://api.example.com';
process.env.REMOTION_TOKEN = 'tok';

const renderArgs = [];
mock.module('@remotion/lambda/client', {
  namedExports: {
    renderMediaOnLambda: async (opts) => {
      renderArgs.push(opts);
      return { renderId: 'r-' + opts.composition };
    },
    getRenderProgress: async () => ({ done: false, overallProgress: 0.1 }),
  },
});

const { handler } = await import('../index.mjs');

const cors = (event) => handler(event).then((r) => ({
  ...r,
  body: r.body ? JSON.parse(r.body) : null,
}));

const renderEvent = (body) => ({
  requestContext: { http: { path: '/render', method: 'POST' } },
  body: JSON.stringify(body),
});

const eligEvent = (path) => ({
  requestContext: { http: { path, method: 'GET' } },
});

const baseFetch = async (url, opts) => {
  if (opts?.method === 'HEAD') return { ok: false, status: 404 };
  if (url.includes('/year-end-recap/')) {
    return { ok: true, json: async () => ({
      display_name: 'X',
      profile_pic: '',
      visible_testimonials: Array.from({ length: 4 }, (_, i) => ({
        id: 10 - i,
        follower_name: 'F' + i,
        text: 'long enough text here',
        profile_pic: null,
      })),
    })};
  }
  if (url.includes('/public-testimonials/')) {
    return { ok: true, json: async () => ({ results: [] }) };
  }
  return { ok: false, status: 404 };
};

global.fetch = baseFetch;

test('POST /render with film=loop-sharing-template kicks off render with launch-films/<u>.mp4', async () => {
  renderArgs.length = 0;
  const r = await cors(renderEvent({ username: 'tester', film: 'loop-sharing-template' }));
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.status, 'rendering');
  assert.match(r.body.jobId, /^r-loop-sharing-template$/);
  assert.equal(renderArgs[0].outName, 'launch-films/tester.mp4');
  assert.equal(renderArgs[0].framesPerLambda, 80);
});

test('POST /render with film=testimonial-reel uses testimonial-reels/<u>.mp4 and framesPerLambda=10', async () => {
  renderArgs.length = 0;
  const r = await cors(renderEvent({ username: 'tester', film: 'testimonial-reel' }));
  assert.equal(r.statusCode, 200);
  assert.equal(renderArgs[0].outName, 'testimonial-reels/tester.mp4');
  assert.equal(renderArgs[0].framesPerLambda, 10);
});

test('POST /render with unknown film returns 400', async () => {
  const r = await cors(renderEvent({ username: 'tester', film: 'mystery' }));
  assert.equal(r.statusCode, 400);
  assert.equal(r.body.error, 'unknown_film');
});

test('POST /render without film defaults to loop-sharing-template (back-compat)', async () => {
  renderArgs.length = 0;
  const r = await cors(renderEvent({ username: 'tester' }));
  assert.equal(r.statusCode, 200);
  assert.equal(renderArgs[0].outName, 'launch-films/tester.mp4');
});

test('GET /eligibility/testimonial-reel/:user returns ok=true when 3+ qualify', async () => {
  const r = await cors(eligEvent('/eligibility/testimonial-reel/tester'));
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.ok, true);
});

test('POST /render with film=testimonial-reel returns 422 when fewer than 3 qualify', async () => {
  const orig = global.fetch;
  global.fetch = async (url, opts) => {
    if (opts?.method === 'HEAD') return { ok: false, status: 404 };
    if (url.includes('/year-end-recap/')) {
      return { ok: true, json: async () => ({
        display_name: 'X', profile_pic: '',
        visible_testimonials: [
          { id: 1, follower_name: 'A', text: 'long enough text here', profile_pic: null },
        ],
      })};
    }
    if (url.includes('/public-testimonials/')) {
      return { ok: true, json: async () => ({ results: [] }) };
    }
    return { ok: false, status: 404 };
  };
  const r = await cors(renderEvent({ username: 'tester', film: 'testimonial-reel' }));
  assert.equal(r.statusCode, 422);
  assert.equal(r.body.error, 'not_eligible');
  global.fetch = orig;
});
