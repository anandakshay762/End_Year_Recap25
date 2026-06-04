# Design — Add `revised-script2` as a new prod film

**Date:** 2026-06-04
**Author:** dharsan99 (with Claude Code)
**Status:** Approved (design); pending implementation plan
**Source:** `github.com/anandakshay762/loop-sharing-template` (private) — component `RevisedScript2` (composition id `revised-script2`)

## Goal

Add the `revised-script2` Loop launch film as a **new film alongside** the existing three
(`loop-sharing-template`, `testimonial-reel`, `april-google-search-v2`), wired **end-to-end**:
renderer composition → films registry → AWS prod (site bundle + orchestrator + IAM) → gabba-next popup.

It is **not** a replacement for the current Loop launch film (`loop-sharing-template` → `launch-films/`),
which stays untouched.

## What the composition is

| Property | Value |
|---|---|
| Composition id | `revised-script2` |
| Component | `RevisedScript2` (`src/RevisedScript2.tsx`) |
| Dimensions | 1920 × 1080 (landscape) |
| FPS | **60** (existing films are 30) |
| Duration | `REVISED2_TOTAL` = **3,609 frames ≈ 60.15s** (intro 291 + frames 3,318) — the largest film so far |
| Schema (`revised2Schema`) | `{ name: string, profile_pic: string(URL), topmate_handle: string }` |
| Personalization actually used | `name` (intro), `profile_pic` (all frames + Loom bubble). `topmate_handle` is in schema for completeness. |
| Source Remotion | 4.0.270 (target repo: 4.0.340 — same 4.0 line, low-risk) |
| Fonts | references "Geist"/"Geist Mono" via CSS; source has **no** font-loading → we bundle Geist (decision below) |

### Code closure (self-contained — verified no imports escape into the rest of the source repo)

- `RevisedScript2.tsx`, `GrainOverlay.tsx`
- `revised2/`: `RevFrame02`, `RevFrame02b`, `RevFrame03`, `RevFrame03b`, `RevFrame04`, `RevFrame05`, `RevFrame06`, `LoomBubble`, `grid`, `motion`, `WarmGradientBg`
- `revised/` — **only** the 3 files `revised2/` imports: `ClipWipeText`, `PageTurnWash`, `rev-tokens` (the rest of `revised/` belongs to the old `revised-script` and is **not** copied)
- `lib/`: `tokens`, `transitions`, `grain`
- `scenes/VideoIntro2.tsx` (imports only `lib/tokens` + `lib/transitions`)

### Asset closure (~3.5MB used subset — NOT the 22MB `bg.mp4` / 14MB slideshow, which `revised-script2` does not use)

`bg music final.mp3`, `rev-vo/{intro-short,f02a,f02b,f03,f03b,f04,f05,f06}.mp3`,
`loop-dark.png`, `loop-mark-light.png`, `topmate-logo.png`, `creators/c1…c20.jpg`.

## Decisions (confirmed)

1. **Role:** new film alongside; own S3 prefix `revised-script2/`, own share campaign.
2. **Scope:** full prod + gabba-next popup.
3. **Share copy (defaults):** campaign `revised_script2_sharing`, title "Your Loop launch film",
   description "Your personalized Loop launch film."
4. **`topmate_handle` format:** `topmate.io/${username}`.
5. **Bundle Geist fonts:** yes.
6. **Popup trigger:** same surface/trigger as the existing Loop launch popup.

## Approach: self-contained subtree under `src/loop2/`

Copy the closure into `src/loop2/` preserving its internal relative layout, so all internal relative
imports (`./revised2/...`, `../lib/...`, `../revised/...`, `./scenes/VideoIntro2`, `./GrainOverlay`)
stay valid unchanged. Only `Root.tsx`'s import path is new. Mirrors how `src/april/` namespaces its film.
`tsc --noEmit` is the gate that proves the closure is complete.

*Rejected:* merging `revised2/ revised/ lib/ scenes/` into `src/` root (namespace pollution / future
collisions); full rewrite to april's layout (high effort, zero functional gain).

## Changes by repo

### 1. Renderer — `End_Year_Recap25`

- **`src/loop2/`** (new) — code closure above.
- **`src/loop2/load-fonts.ts`** (new) — load `Geist` + `Geist Mono` via `@remotion/google-fonts`
  (already a dep at 4.0.340); imported by `RevisedScript2` so `tokens.ts` font families resolve.
- **`public/`** — copy used assets at root with original paths **except** the colliding
  `topmate-logo.png`: target already has a different 4.4KB `topmate-logo.png` (source is 398KB),
  so copy source to **`public/loop2/topmate-logo.png`** and patch the single
  `staticFile("topmate-logo.png")` → `staticFile("loop2/topmate-logo.png")` in `loop2/revised2/RevFrame04.tsx`.
  All other assets (`bg music final.mp3`, `rev-vo/*`, `loop-dark.png`, `loop-mark-light.png`,
  `creators/*`) have no collision.
- **`src/Root.tsx`** — register:
  ```tsx
  import { RevisedScript2, REVISED2_TOTAL, revised2Schema } from './loop2/RevisedScript2';
  // ...
  <Composition
    id="revised-script2"
    component={RevisedScript2}
    schema={revised2Schema}
    durationInFrames={REVISED2_TOTAL}
    fps={60}
    width={1920}
    height={1080}
    defaultProps={{ name: 'Pawan', profile_pic: 'https://i.pravatar.cc/400?img=12', topmate_handle: 'topmate.io/pawan' }}
  />
  ```
- **`lambda/films.config.mjs`** — new entry (mirrors `loop-sharing-template`):
  ```js
  'revised-script2': {
    compositionId: 'revised-script2',
    outDir: 'revised-script2',
    framesPerLambda: 70, // 3,609 / 70 ≈ 52 chunks
    prefetch: async (username, apiBase) => {
      const data = await fetchUser(username, apiBase);
      const profile_pic = data?.profile_pic ?? data?.data?.profile_pic ?? '';
      const name = data?.display_name ?? data?.data?.display_name ?? username;
      return {
        inputProps: {
          name,
          profile_pic: profile_pic
            || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E0E0E0&color=5F6368&size=240`,
          topmate_handle: `topmate.io/${username}`,
        },
        raw: {},
      };
    },
    eligibility: () => ({ ok: true }),
    share: {
      campaign: 'revised_script2_sharing',
      title: 'Your Loop launch film',
      description: 'Your personalized Loop launch film.',
    },
  },
  ```

### 2. AWS prod — account 072528252688, us-east-1

- **`lambda/deploy.sh`** — add IAM statement `WriteCacheKeyRevisedScript2`:
  `s3:PutObject`, `s3:PutObjectAcl`, `s3:GetObject` on
  `arn:aws:s3:::$RENDER_BUCKET/revised-script2/*` (mirror the existing per-film statements).
- **Redeploy the Remotion site bundle** `topmate-loop-launch-renderer` to
  `s3://remotionlambda-useast1-unuossiqe1/sites/topmate-loop-launch-renderer/` so the orchestrator's
  `SERVE_URL` includes the new composition + assets. (Exact deploy command located during impl —
  `npx remotion lambda sites create --site-name=topmate-loop-launch-renderer <entry>`; requires
  072528252688 creds + Remotion env.)
- **Redeploy the orchestrator** via `lambda/deploy.sh` (re-zips `index.mjs` + `films.config.mjs`;
  re-applies IAM). Requires 072528252688 admin creds + `REMOTION_TOKEN` + `PROFILE_STATS_API_KEY`.
- Render Lambda unchanged (`remotion-render-4-0-340-mem4096mb-disk10240mb-120sec`); per-composition
  fps=60 is handled by Remotion. **Cost note:** ~3,609 frames is the biggest film; ~52 chunks/render
  at `scale: 0.5` (→ 960×540@60fps).

### 3. Frontend — `gabba-next`

- Prefer **parameterizing the existing generic popup** (`PersonalizedFilmsPopup`, which already takes a
  `film` prop) with `film='revised-script2'`; fall back to a new component mirroring `LoopLaunchPopup`
  if the existing one isn't reusable.
- Calls same-origin `/api/loop-launch/{eligibility,render,progress}` with `film: 'revised-script2'`.
  **The proxy route (`app/api/loop-launch/[...path]/route.ts`) needs no change** — it is path-generic.
- Mounted at the **same surface/trigger** as the current Loop launch popup.
- Eligibility is always-ok, so the popup's eligibility gate always passes.

## Data flow (unchanged pipeline, new film key)

```
gabba-next popup (film='revised-script2')
  → /api/loop-launch/render  → SigV4 lambda:InvokeFunction → loop-launch-orchestrator
  → films['revised-script2'].prefetch(username)  → { name, profile_pic, topmate_handle }
  → renderMediaOnLambda(serveUrl=sites/topmate-loop-launch-renderer, composition='revised-script2')
  → S3 renders/<id>/revised-script2/<username>.mp4
  → copy → revised-script2/<username>.mp4 (public-read cache)
  → POST {BACKEND}/create-topmate-recap-share-content/ (campaign revised_script2_sharing)
```

## Verification

1. `npx tsc --noEmit` (proves closure complete).
2. Local Studio render of `revised-script2` (visual + fonts + audio sync).
3. Lambda test render on a test user via `scripts/test_film.mjs` / `/render` — **after** site+orchestrator
   redeploy — confirming the cache write to `revised-script2/<username>.mp4` and share registration.
4. Frontend: trigger the popup on a test profile; confirm render + share end-to-end.

## Risks & mitigations

- **Remotion 4.0.270 → 4.0.340 API drift** — low; caught by `tsc` + test render.
- **Geist font fallback** — mitigated by `load-fonts.ts`.
- **Render cost / wall-clock** (60fps × 60s) — tunable via `framesPerLambda`.
- **`public/topmate-logo.png` collision** — resolved by namespacing to `public/loop2/`.
- **`revised/` transitive imports** — only 3 leaf files copied; `tsc` confirms no missing deps.

## Out of scope

- Replacing or deprecating `loop-sharing-template`.
- Changes to the render Lambda, the proxy route, or the backend share endpoint.
- Male/female VO variants (the source's LoopHero variants); `revised-script2` uses a fixed VO set.
