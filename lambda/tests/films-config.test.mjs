import { test } from 'node:test';
import assert from 'node:assert/strict';
import { films } from '../films.config.mjs';

test('exports loop-sharing-template and testimonial-reel', () => {
  assert.ok(films['loop-sharing-template']);
  assert.ok(films['testimonial-reel']);
});

test('loop-sharing-template entry shape', () => {
  const f = films['loop-sharing-template'];
  assert.equal(f.compositionId, 'loop-sharing-template');
  assert.equal(f.outDir, 'launch-films');
  assert.equal(f.framesPerLambda, 80);
  assert.equal(f.eligibility({}).ok, true);
  assert.equal(f.share.campaign, 'loop_video_sharing');
});

test('testimonial-reel entry shape (framesPerLambda=10 for sub-10s render)', () => {
  const f = films['testimonial-reel'];
  assert.equal(f.compositionId, 'testimonial-reel');
  assert.equal(f.outDir, 'testimonial-reels');
  assert.equal(f.framesPerLambda, 10);
  assert.equal(f.share.campaign, 'testimonial_reel_sharing');
});

test('testimonial-reel: prefetch picks newest, len>=10, top 3, includes avatar', async () => {
  const f = films['testimonial-reel'];

  global.fetch = async (url) => {
    if (url.includes('/year-end-recap/')) {
      return {
        ok: true,
        json: async () => ({
          display_name: 'Test Creator',
          profile_pic: 'pp-url',
          visible_testimonials: [
            { id: 5, follower_name: 'A', text: 'this is long enough A', profile_pic: 'a.jpg' },
            { id: 4, follower_name: 'B', text: 'short',                   profile_pic: null    },
            { id: 3, follower_name: 'C', text: 'this is long enough C',   profile_pic: null    },
            { id: 2, follower_name: 'D', text: 'this is long enough D',   profile_pic: null    },
          ],
        }),
      };
    }
    if (url.includes('/public-testimonials/')) {
      return { ok: true, json: async () => ({ results: [] }) };
    }
    throw new Error('unexpected url ' + url);
  };

  const { inputProps, raw } = await f.prefetch('tester', 'https://api.example.com');
  assert.equal(raw.qualifyingCount, 3);
  assert.deepEqual(
    [inputProps.name1, inputProps.name2, inputProps.name3],
    ['A', 'C', 'D'],
  );
  assert.equal(inputProps.creatorName, 'Test Creator');
  assert.equal(inputProps.profilePic, 'pp-url');
  assert.equal(inputProps.topmateLink, 'https://topmate.io/tester');
  assert.equal(inputProps.avatar1, 'a.jpg');
  assert.equal(inputProps.avatar2, '');
  assert.equal(inputProps.avatar3, '');
});

test('testimonial-reel: backfills from public-testimonials when visible has fewer than 3', async () => {
  const f = films['testimonial-reel'];
  global.fetch = async (url) => {
    if (url.includes('/year-end-recap/')) {
      return { ok: true, json: async () => ({
        display_name: 'X',
        profile_pic: '',
        visible_testimonials: [
          { id: 10, follower_name: 'P', text: 'this is long enough', profile_pic: null },
        ],
      })};
    }
    if (url.includes('/public-testimonials/')) {
      return { ok: true, json: async () => ({ results: [
        { id: 10, text: 'this is long enough', is_anonymous: false, profile_pic: null },
        { id: 9,  text: 'another long enough', is_anonymous: true,  profile_pic: null },
        { id: 8,  text: 'yet another long enough', is_anonymous: false, profile_pic: 'q.jpg' },
      ] })};
    }
    throw new Error('unexpected url');
  };
  const { inputProps, raw } = await f.prefetch('x', 'https://api.example.com');
  assert.equal(raw.qualifyingCount, 3);
  // id-DESC sort: 10 (visible "P"), 9 (anonymous), 8 (no name)
  assert.equal(inputProps.name1, 'P');
  assert.equal(inputProps.name2, 'Anonymous');
  assert.equal(inputProps.name3, '');
  assert.equal(inputProps.avatar3, 'q.jpg');
});

test('testimonial-reel eligibility false when fewer than 3', () => {
  const f = films['testimonial-reel'];
  assert.equal(f.eligibility({ qualifyingCount: 2 }).ok, false);
  assert.equal(f.eligibility({ qualifyingCount: 3 }).ok, true);
});
