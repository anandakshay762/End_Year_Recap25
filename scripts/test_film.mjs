// One-shot local renderer for any film in lambda/films.config.mjs.
// Usage: PROFILE_STATS_API_KEY=… node scripts/test_film.mjs <filmName> <username>
// Env knobs:
//   FAST=1        — scale 0.5, jpegQ 60, lower audioBitrate, max concurrency (default)
//   FAST=0        — scale 0.667, jpegQ 70 (the prior config)
//   CONCURRENCY=N — override concurrency (default = ncpu)

import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { films } from '../lambda/films.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const filmName = process.argv[2];
const username = process.argv[3];
const apiBase  = process.env.API_BASE || 'https://api.galactus.run';

if (!filmName || !username) {
  console.error('usage: node scripts/test_film.mjs <filmName> <username>');
  console.error('films:', Object.keys(films).join(', '));
  process.exit(1);
}
const film = films[filmName];
if (!film) { console.error(`unknown film: ${filmName}`); process.exit(1); }

console.log(`[test] ${filmName} <- ${username}  api=${apiBase}`);
console.log(`[test] PROFILE_STATS_API_KEY=${process.env.PROFILE_STATS_API_KEY ? 'set' : 'NOT SET'}`);

const t0 = Date.now();
const { inputProps, raw } = await film.prefetch(username, apiBase);
const tFetch = Date.now() - t0;
const elig = film.eligibility(raw);
if (!elig.ok) { console.error(`[test] not eligible: ${elig.reason}`); process.exit(2); }

console.log(`[test] prefetch ok (${tFetch}ms) — inputProps:`);
console.log(JSON.stringify(inputProps, null, 2));

console.log('[test] bundling…');
const tBundle0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts') });
console.log(`[test] bundled (${Date.now() - tBundle0}ms)`);

const composition = await selectComposition({ serveUrl, id: film.compositionId, inputProps });

const outDir = path.join(ROOT, 'out');
const outPath = path.join(outDir, `${filmName}-${username}.mp4`);
console.log(`[test] rendering ${composition.durationInFrames} frames -> ${outPath}`);

const fast = process.env.FAST !== '0';
const concurrency = process.env.CONCURRENCY
  ? Number(process.env.CONCURRENCY)
  : os.cpus().length; // use every logical core
const scale = process.env.SCALE
  ? Number(process.env.SCALE)
  : (fast ? 0.5 : 0.667);
const jpegQuality = fast ? 60 : 70;
const audioBitrate = fast ? '96k' : '128k';
console.log(`[test] mode=${fast ? 'fast' : 'quality'}  concurrency=${concurrency}  scale=${scale}  jpegQ=${jpegQuality}`);

const tRender0 = Date.now();
let lastPct = -1;
await renderMedia({
  composition, serveUrl, codec: 'h264',
  outputLocation: outPath,
  inputProps,
  concurrency,
  x264Preset: 'ultrafast',
  crf: 26,
  jpegQuality,
  scale,
  chromiumOptions: { headless: true, gl: 'angle' },
  audioCodec: process.env.NO_AUDIO ? null : 'aac',
  audioBitrate,
  enforceAudioTrack: !process.env.NO_AUDIO,
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 100);
    if (pct !== lastPct) {
      lastPct = pct;
      process.stdout.write(`\r[test] ${pct}%   `);
    }
  },
});
const tRender = Date.now() - tRender0;
const tTotal = Date.now() - t0;
console.log(`\n[test] done — render=${tRender}ms total=${tTotal}ms`);
console.log(`[test] file: ${outPath}`);
