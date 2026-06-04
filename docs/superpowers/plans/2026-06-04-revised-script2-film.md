# revised-script2 New Prod Film — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `revised-script2` Loop launch film as a new film alongside the existing three, wired end-to-end: Remotion composition → films registry → AWS prod (site bundle + orchestrator + IAM) → gabba-next dashboard popup.

**Architecture:** Copy the source composition's self-contained closure into `src/loop2/` (mirrors `src/april/`), bundle Geist via self-hosted woff2 + `@remotion/fonts`, register it in `Root.tsx`, add a `films.config.mjs` entry (new `revised-script2/` S3 prefix), grant S3 IAM in `deploy.sh`, redeploy the Remotion site bundle + orchestrator (account 072528252688, us-east-1), then extend `PersonalizedFilmsPopup` in gabba-next with a 4th section on the existing dashboard trigger.

**Tech Stack:** Remotion 4.0.340 (CLI/lambda/renderer/fonts), Node ESM, AWS Lambda + S3 (acct 072528252688), Next.js (gabba-next), `@remotion/fonts`.

**Spec:** `docs/superpowers/specs/2026-06-04-revised-script2-film-design.md`

**Repos touched:**
- `End_Year_Recap25` (this repo) — composition + registry + IAM + deploy (Tasks 1–10)
- `gabba-next` (`/Users/dharsankumar/Documents/GitHub/gabba-next`) — popup (Tasks 11–12)

**Prereqs for prod tasks (8–10):** valid SSO for account 072528252688 (`aws sts get-caller-identity --profile topmate-prod`), and env `REMOTION_TOKEN`, `PROFILE_STATS_API_KEY` exported.

---

## File Structure

**`End_Year_Recap25`**
- Create: `src/loop2/` — copied closure (self-contained subtree, internal relative imports preserved):
  - `RevisedScript2.tsx`, `GrainOverlay.tsx`
  - `revised2/` (RevFrame02, 02b, 03, 03b, 04, 05, 06, LoomBubble, grid, motion, WarmGradientBg)
  - `revised/` (ClipWipeText, PageTurnWash, rev-tokens — **only these 3**)
  - `lib/` (tokens, transitions, grain)
  - `scenes/VideoIntro2.tsx`
- Create: `src/loop2/load-fonts.ts` — Geist + Geist Mono loader
- Create: `public/fonts/geist-{400,500,600,700}.woff2`, `public/fonts/geist-mono-400.woff2`
- Create: `public/loop2/topmate-logo.png` (namespaced; target root already has a different `topmate-logo.png`)
- Create: `public/{bg music final.mp3, loop-dark.png, loop-mark-light.png}`, `public/rev-vo/*.mp3`, `public/creators/c1..c20.jpg`
- Modify: `src/loop2/revised2/RevFrame04.tsx` (one `staticFile` path)
- Modify: `src/Root.tsx` (register composition)
- Modify: `package.json` (add `@remotion/fonts`)
- Modify: `lambda/films.config.mjs` (new `revised-script2` entry)
- Modify: `lambda/deploy.sh` (new IAM statement)

**`gabba-next`**
- Modify: `components/Common/PersonalizedFilmsPopup/PersonalizedFilmsPopup.tsx` (4th film section)

---

## Phase A — Renderer composition

### Task 1: Copy the code closure into `src/loop2/`

**Files:**
- Create: `src/loop2/**` (subtree below)
- Modify: `src/loop2/revised2/RevFrame04.tsx:173`

- [ ] **Step 1: Ensure the source repo is cloned**

Run:
```bash
test -d /tmp/loop-sharing-template || git clone --depth 1 https://github.com/anandakshay762/loop-sharing-template.git /tmp/loop-sharing-template
ls /tmp/loop-sharing-template/src/RevisedScript2.tsx
```
Expected: prints the path (file exists).

- [ ] **Step 2: Copy the closure files, preserving internal layout**

Run:
```bash
cd /Users/dharsankumar/Documents/GitHub/End_Year_Recap25
SRC=/tmp/loop-sharing-template/src
mkdir -p src/loop2/revised2 src/loop2/revised src/loop2/lib src/loop2/scenes
cp "$SRC/RevisedScript2.tsx" src/loop2/RevisedScript2.tsx
cp "$SRC/GrainOverlay.tsx"   src/loop2/GrainOverlay.tsx
cp "$SRC"/revised2/{RevFrame02,RevFrame02b,RevFrame03,RevFrame03b,RevFrame04,RevFrame05,RevFrame06,LoomBubble,grid,motion,WarmGradientBg}.tsx src/loop2/revised2/
cp "$SRC"/revised/{ClipWipeText,PageTurnWash}.tsx src/loop2/revised/
cp "$SRC"/revised/rev-tokens.ts src/loop2/revised/
cp "$SRC"/lib/{tokens,transitions,grain}.ts src/loop2/lib/
cp "$SRC/scenes/VideoIntro2.tsx" src/loop2/scenes/VideoIntro2.tsx
find src/loop2 -type f | sort
```
Expected: lists ~22 files, no errors. (If a `revised2/*.tsx` filename differs, `ls /tmp/loop-sharing-template/src/revised2` and adjust.)

- [ ] **Step 3: Namespace the colliding logo asset reference**

Edit `src/loop2/revised2/RevFrame04.tsx` — change the single line:
```tsx
            src={staticFile("topmate-logo.png")}
```
to:
```tsx
            src={staticFile("loop2/topmate-logo.png")}
```
(Verify it is the only occurrence: `grep -rn 'topmate-logo.png' src/loop2`.)

- [ ] **Step 4: Commit**

```bash
git add src/loop2
git commit -m "feat(loop2): vendor revised-script2 composition closure [PDV-4570]"
```

---

### Task 2: Copy the static assets into `public/`

**Files:**
- Create: `public/loop2/topmate-logo.png`, `public/{bg music final.mp3,loop-dark.png,loop-mark-light.png}`, `public/rev-vo/*.mp3`, `public/creators/c1..c20.jpg`

- [ ] **Step 1: Copy assets (logo namespaced, rest at root paths the code expects)**

Run:
```bash
cd /Users/dharsankumar/Documents/GitHub/End_Year_Recap25
SRC=/tmp/loop-sharing-template/public
mkdir -p public/loop2 public/rev-vo public/creators
cp "$SRC/topmate-logo.png" public/loop2/topmate-logo.png
cp "$SRC/bg music final.mp3" "public/bg music final.mp3"
cp "$SRC/loop-dark.png" public/loop-dark.png
cp "$SRC/loop-mark-light.png" public/loop-mark-light.png
cp "$SRC"/rev-vo/{intro-short,f02a,f02b,f03,f03b,f04,f05,f06}.mp3 public/rev-vo/
cp "$SRC"/creators/c*.jpg public/creators/
ls "public/bg music final.mp3" public/loop2/topmate-logo.png public/rev-vo/ public/creators/ | head
echo "creators count: $(ls public/creators/c*.jpg | wc -l)"
```
Expected: files present; creators count = 20.

- [ ] **Step 2: Sanity-check no other root asset was overwritten**

Run: `git status --porcelain public | grep -vE "^\?\?" | grep -i topmate-logo`
Expected: **no output** (the root `topmate-logo.png` is untouched; only `public/loop2/...` is new).

- [ ] **Step 3: Commit**

```bash
git add "public/bg music final.mp3" public/loop2 public/loop-dark.png public/loop-mark-light.png public/rev-vo public/creators
git commit -m "feat(loop2): add revised-script2 audio + image assets [PDV-4570]"
```

---

### Task 3: Bundle the Geist fonts

Geist is **not** in `@remotion/google-fonts@4.0.340`, so self-host woff2 + load via `@remotion/fonts`.

**Files:**
- Modify: `package.json`
- Create: `public/fonts/geist-{400,500,600,700}.woff2`, `public/fonts/geist-mono-400.woff2`
- Create: `src/loop2/load-fonts.ts`
- Modify: `src/loop2/RevisedScript2.tsx` (import the loader)

- [ ] **Step 1: Add the `@remotion/fonts` dependency**

Run:
```bash
cd /Users/dharsankumar/Documents/GitHub/End_Year_Recap25
npm install @remotion/fonts@4.0.340 --save-exact
node -e "require('@remotion/fonts');console.log('ok')"
```
Expected: prints `ok`.

- [ ] **Step 2: Download Geist + Geist Mono woff2 (latin)**

Run:
```bash
mkdir -p public/fonts
B=https://cdn.jsdelivr.net/npm
curl -fsSL "$B/@fontsource/geist-sans@latest/files/geist-sans-latin-400-normal.woff2" -o public/fonts/geist-400.woff2
curl -fsSL "$B/@fontsource/geist-sans@latest/files/geist-sans-latin-500-normal.woff2" -o public/fonts/geist-500.woff2
curl -fsSL "$B/@fontsource/geist-sans@latest/files/geist-sans-latin-600-normal.woff2" -o public/fonts/geist-600.woff2
curl -fsSL "$B/@fontsource/geist-sans@latest/files/geist-sans-latin-700-normal.woff2" -o public/fonts/geist-700.woff2
curl -fsSL "$B/@fontsource/geist-mono@latest/files/geist-mono-latin-400-normal.woff2" -o public/fonts/geist-mono-400.woff2
ls -l public/fonts/
```
Expected: 5 non-empty woff2 files (each > 5KB).

- [ ] **Step 3: Create the loader `src/loop2/load-fonts.ts`**

```ts
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Geist is not in @remotion/google-fonts@4.0.340, so self-host the woff2
// (public/fonts) and register with @remotion/fonts. Each loadFont wraps a
// delayRender() so frames don't capture before the font is ready.
const geist = "Geist";
const geistMono = "Geist Mono";

loadFont({ family: geist, url: staticFile("fonts/geist-400.woff2"), weight: "400" });
loadFont({ family: geist, url: staticFile("fonts/geist-500.woff2"), weight: "500" });
loadFont({ family: geist, url: staticFile("fonts/geist-600.woff2"), weight: "600" });
loadFont({ family: geist, url: staticFile("fonts/geist-700.woff2"), weight: "700" });
loadFont({ family: geistMono, url: staticFile("fonts/geist-mono-400.woff2"), weight: "400" });
```

- [ ] **Step 4: Import the loader from the composition**

In `src/loop2/RevisedScript2.tsx`, add as the first local import (after the remotion/react imports, before the `revised2/...` imports):
```ts
import "./load-fonts";
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json public/fonts src/loop2/load-fonts.ts src/loop2/RevisedScript2.tsx
git commit -m "feat(loop2): self-host + load Geist fonts for revised-script2 [PDV-4570]"
```

---

### Task 4: Register the composition in `Root.tsx`

**Files:**
- Modify: `src/Root.tsx`

- [ ] **Step 1: Add the import**

In `src/Root.tsx`, after the april import (line ~10), add:
```tsx
import { RevisedScript2, REVISED2_TOTAL, revised2Schema } from './loop2/RevisedScript2';
```

- [ ] **Step 2: Register the `<Composition>`**

Inside the `<>...</>` (after the `april-google-search-v2` Composition), add:
```tsx
      <Composition
        id="revised-script2"
        component={RevisedScript2 as ComponentType<any>}
        durationInFrames={REVISED2_TOTAL}
        fps={60}
        width={1920}
        height={1080}
        schema={revised2Schema}
        defaultProps={{
          name: 'Pawan',
          profile_pic: 'https://i.pravatar.cc/400?img=12',
          topmate_handle: 'topmate.io/pawan',
        }}
      />
```
(`ComponentType` is already imported in `Root.tsx`.)

- [ ] **Step 3: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: **no errors**. If errors reference missing `src/loop2/...` files, a closure file was missed — copy it from `/tmp/loop-sharing-template/src` and re-run.

- [ ] **Step 4: Commit**

```bash
git add src/Root.tsx
git commit -m "feat(root): register revised-script2 composition (1920x1080@60) [PDV-4570]"
```

---

### Task 5: Local render verification

- [ ] **Step 1: Render the composition locally (no backend needed — uses defaultProps via Studio, or test_film for prefetch)**

Quick visual check in Studio:
Run: `npx remotion studio` → open `revised-script2` → scrub the timeline.
Expected: intro slideshow → frames 02–06 render; **text uses Geist** (not a system serif/sans fallback); voiceover + music present; Loom bubble visible.

- [ ] **Step 2: Headless render of a few seconds to confirm bundling + assets resolve**

Run:
```bash
npx remotion render src/index.ts revised-script2 out/revised-script2-smoke.mp4 --frames=0-180
ls -lh out/revised-script2-smoke.mp4
```
Expected: an ~3s mp4 is produced with no `staticFile` 404s in the log.

- [ ] **Step 3: No commit** (artifacts in `out/` are gitignored).

---

## Phase B — Films registry + IAM

### Task 6: Add the `revised-script2` films-registry entry

**Files:**
- Modify: `lambda/films.config.mjs`

- [ ] **Step 1: Add the entry** (inside the `export const films = { ... }` object, after `april-google-search-v2`):

```js
  'revised-script2': {
    compositionId: 'revised-script2',
    outDir: 'revised-script2',
    framesPerLambda: 70, // ~3,609 frames / 70 ≈ 52 chunks
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

- [ ] **Step 2: Verify the module parses and exposes the film**

Run:
```bash
node -e "import('./lambda/films.config.mjs').then(m=>{const f=m.films['revised-script2'];if(!f)throw new Error('missing');console.log('ok',f.compositionId,f.outDir,f.framesPerLambda);})"
```
Expected: `ok revised-script2 revised-script2 70`.

- [ ] **Step 3: End-to-end local render via the registry prefetch (real test user)**

Run (replace `<username>` with a real Topmate creator handle):
```bash
PROFILE_STATS_API_KEY="$PROFILE_STATS_API_KEY" node scripts/test_film.mjs revised-script2 <username>
ls -lh out/revised-script2-<username>.mp4
```
Expected: prints prefetch `inputProps` with `name`, `profile_pic`, `topmate_handle: topmate.io/<username>`; renders a full mp4.

- [ ] **Step 4: Commit**

```bash
git add lambda/films.config.mjs
git commit -m "feat(films): register revised-script2 film (revised-script2/ prefix) [PDV-4570]"
```

---

### Task 7: Grant S3 IAM for the new prefix in `deploy.sh`

**Files:**
- Modify: `lambda/deploy.sh` (the `aws iam put-role-policy ... orchestrator-perms` statement block)

- [ ] **Step 1: Add the IAM statement**

In `lambda/deploy.sh`, in the `--policy-document` JSON `Statement` array, after the `WriteCacheKeyAprilGoogleSearchV2` statement, add:
```bash
      {\"Sid\":\"WriteCacheKeyRevisedScript2\",\"Effect\":\"Allow\",\"Action\":[\"s3:PutObject\",\"s3:PutObjectAcl\",\"s3:GetObject\"],\"Resource\":\"arn:aws:s3:::$RENDER_BUCKET/revised-script2/*\"},
```
(Place it before the `ReadRenderOutputs` statement; keep the trailing comma valid.)

- [ ] **Step 2: Validate the script still parses**

Run: `bash -n lambda/deploy.sh`
Expected: no output (syntax OK).

- [ ] **Step 3: Commit**

```bash
git add lambda/deploy.sh
git commit -m "chore(deploy): grant orchestrator s3:Put on revised-script2/* [PDV-4570]"
```

---

## Phase C — Prod deploy (account 072528252688, us-east-1)

> Requires: `aws sso login --profile topmate-prod` valid; `REMOTION_TOKEN` and `PROFILE_STATS_API_KEY` exported. All renders read the **site bundle**, so the site MUST be redeployed (Task 8) before the orchestrator (Task 9), or `/render?film=revised-script2` returns a composition-not-found error.

### Task 8: Redeploy the Remotion site bundle

**Files:** none (deploys `src/index.ts` bundle to S3)

- [ ] **Step 1: Confirm identity + Remotion version parity**

Run:
```bash
aws sts get-caller-identity --profile topmate-prod --query Account --output text
npx remotion versions
```
Expected: `072528252688`; Remotion 4.0.340 across packages (must match the deployed render fn `remotion-render-4-0-340-...`).

- [ ] **Step 2: Deploy the site bundle (same site name the orchestrator serves)**

Run:
```bash
AWS_PROFILE=topmate-prod npx remotion lambda sites create src/index.ts \
  --site-name=topmate-loop-launch-renderer \
  --region=us-east-1
```
Expected: completes and prints a serveUrl ending in `sites/topmate-loop-launch-renderer/index.html`
(same as the orchestrator's `LAMBDA_SERVE_URL`). This **overwrites in place** — existing films keep working since they're all in this one bundle.

- [ ] **Step 3: Verify the new composition is in the deployed bundle**

Run:
```bash
AWS_PROFILE=topmate-prod npx remotion lambda compositions \
  https://remotionlambda-useast1-unuossiqe1.s3.us-east-1.amazonaws.com/sites/topmate-loop-launch-renderer/index.html \
  --region=us-east-1 | grep revised-script2
```
Expected: `revised-script2` appears in the list.

---

### Task 9: Redeploy the orchestrator

**Files:** none (runs `lambda/deploy.sh`)

- [ ] **Step 1: Deploy**

Run:
```bash
cd lambda
eval "$(aws configure export-credentials --profile topmate-prod --format env)"
REMOTION_TOKEN="$REMOTION_TOKEN" PROFILE_STATS_API_KEY="$PROFILE_STATS_API_KEY" ./deploy.sh
cd ..
```
Expected: `[deploy] account=072528252688 ...`, zips include `films.config.mjs`, function updated, prints the Function URL. The re-applied inline IAM now includes `WriteCacheKeyRevisedScript2`.

- [ ] **Step 2: Verify the IAM grant landed**

Run:
```bash
aws iam get-role-policy --role-name loop-launch-orchestrator-role \
  --policy-name orchestrator-perms --profile topmate-prod \
  --query 'PolicyDocument.Statement[?Sid==`WriteCacheKeyRevisedScript2`]'
```
Expected: one statement allowing `s3:PutObject/PutObjectAcl/GetObject` on `.../revised-script2/*`.

---

### Task 10: Prod render verification

- [ ] **Step 1: Trigger a render via the same path the frontend uses**

Run (replace `<username>`/`<user_id>` with a real test creator):
```bash
curl -sS -X POST https://topmate.io/api/loop-launch/render \
  -H 'content-type: application/json' \
  -d '{"username":"<username>","user_id":<user_id>,"film":"revised-script2"}'
```
Expected: `{"status":"rendering","jobId":"...","film":"revised-script2"}` (or `{"status":"ready",...}` if already cached).

- [ ] **Step 2: Poll to completion**

Run (use the returned jobId):
```bash
curl -sS "https://topmate.io/api/loop-launch/progress/<jobId>?film=revised-script2&user_id=<user_id>"
```
Expected: progresses to `{"status":"ready","video_url":".../revised-script2/<username>.mp4", ...}`.

- [ ] **Step 3: Confirm the cache object + public URL**

Run:
```bash
aws s3 ls s3://remotionlambda-useast1-unuossiqe1/revised-script2/ --profile topmate-prod | grep <username>
curl -sS -o /dev/null -w "%{http_code}\n" -I "https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-unuossiqe1/revised-script2/<username>.mp4"
```
Expected: object listed; HTTP `200`.

---

## Phase D — Frontend popup (gabba-next)

### Task 11: Add a 4th film section to `PersonalizedFilmsPopup`

Mirror the existing **loop-sharing-template** section (it is the closest analog — an always-eligible launch film with no eligibility gate). Reuse the generic `startRender(film, setter, pollRef)` helper.

**Files:**
- Modify: `/Users/dharsankumar/Documents/GitHub/gabba-next/components/Common/PersonalizedFilmsPopup/PersonalizedFilmsPopup.tsx`

- [ ] **Step 1: Add the share-context constant** (after `LOOP_SHARE_CONTEXT_ID`, line ~17):
```tsx
// Reuse the Loop launch share template (revised-script2 is a Loop launch film).
// Swap to a dedicated SharingPostTemplate id if/when backend provisions one.
const REVISED_SHARE_CONTEXT_ID = "6_suggested_1312";
```

- [ ] **Step 2: Extend the `FilmKey` union** (line ~30):
```tsx
type FilmKey = "april-google-search-v2" | "testimonial-reel" | "loop-sharing-template" | "revised-script2";
```

- [ ] **Step 3: Add state + refs** (next to `loopState`/`loopPollRef`/`loopVideoRef`):
```tsx
  const [revisedState, setRevisedState] = useState<RenderState>({ kind: "idle" });
  const revisedPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revisedVideoRef = useRef<HTMLVideoElement | null>(null);
```

- [ ] **Step 4: Add the force-open query params** (in the `forceOpen` expression, ~line 38):
```tsx
    searchParams?.get("revised_script2") === "1" ||
    searchParams?.get("loop2") === "1" ||
```

- [ ] **Step 5: Add the play handler** (next to the `playLoop`/`startRender("loop-sharing-template", ...)` handler, ~line 226):
```tsx
  const playRevised = () =>
    startRender("revised-script2", setRevisedState, revisedPollRef);
```

- [ ] **Step 6: Add the ready→autoplay effect** (mirror the `loopState` effect at ~line 243):
```tsx
  useEffect(() => {
    if (revisedState.kind === "ready" && revisedVideoRef.current) {
      revisedVideoRef.current.play().catch(() => {});
    }
  }, [revisedState]);
```

- [ ] **Step 7: Add cleanup** — wherever `stopPoll(loopPollRef)` is called (the unmount/close cleanups at ~line 127, 145, 263), add alongside:
```tsx
    stopPoll(revisedPollRef);
```

- [ ] **Step 8: Add the `<section>`** — duplicate the loop `<section>` block (currently ~lines 443–502), and in the copy replace:
  - `loopState` → `revisedState`, `loopVideoRef` → `revisedVideoRef`, `playLoop` → `playRevised`
  - the download filename `loop-launch-${username || "film"}.mp4` → `revised-loop-${username || "film"}.mp4`
  - the share call `shareTo(LOOP_SHARE_CONTEXT_ID, "loop_launch_film")` → `shareTo(REVISED_SHARE_CONTEXT_ID, "revised_script2")`
  - the heading/copy text (e.g. "Your launch film is ready." / "your version") → e.g. "Your revised launch film is ready." Keep all other markup/classNames identical.

- [ ] **Step 9: Type-check + lint**

Run:
```bash
cd /Users/dharsankumar/Documents/GitHub/gabba-next
npx tsc --noEmit
```
Expected: no new errors in `PersonalizedFilmsPopup.tsx`.

- [ ] **Step 10: Commit**

```bash
git add components/Common/PersonalizedFilmsPopup/PersonalizedFilmsPopup.tsx
git commit -m "feat(popup): add revised-script2 Loop film section [PDV-4570]"
```

---

### Task 12: Frontend end-to-end verification

- [ ] **Step 1: Run the app and force the popup open**

Run: `npm run dev` (in gabba-next), then open `http://localhost:3000/<dashboard-home-route>?revised_script2=1` logged in as a test creator.
Expected: the popup shows the revised-script2 section; clicking play triggers `/api/loop-launch/render` with `film: "revised-script2"`, progress polls, video appears, download + share work.

- [ ] **Step 2: Confirm the network calls**

In devtools Network: `POST /api/loop-launch/render` → `{film:"revised-script2"}` returns 200; `GET /api/loop-launch/progress/<id>?film=revised-script2...` reaches `ready`.

- [ ] **Step 3: No extra commit** (covered by Task 11).

---

## Self-Review

**Spec coverage:** new film alongside ✓ (T6) · src/loop2 subtree ✓ (T1) · Geist bundling ✓ (T3, adapted to self-host since google-fonts 4.0.340 lacks Geist) · topmate-logo namespacing ✓ (T1/T2) · Root registration fps=60 ✓ (T4) · films.config entry + revised-script2/ prefix + topmate.io/username handle + share copy ✓ (T6) · deploy.sh IAM ✓ (T7) · site redeploy ✓ (T8) · orchestrator redeploy ✓ (T9) · prod verify ✓ (T10) · gabba-next popup on existing trigger ✓ (T11–12) · proxy unchanged ✓ (no task, by design).

**Placeholder scan:** `<username>`/`<user_id>`/`<jobId>` are runtime values the operator supplies, not unfilled plan content. `REVISED_SHARE_CONTEXT_ID` is a concrete working default (reuse loop's) with a documented swap condition — not a TODO.

**Type/name consistency:** `revised-script2` (composition id, film key, outDir) consistent across Root, films.config, popup. `REVISED2_TOTAL`/`revised2Schema`/`RevisedScript2` match the source exports. `startRender(film, setter, pollRef)` signature matches existing usage. Font family names "Geist"/"Geist Mono" match `lib/tokens.ts`.

**Deviation from spec:** spec said "load Geist via @remotion/google-fonts (already a dep)"; that version has no Geist, so the plan self-hosts woff2 via `@remotion/fonts` — same outcome (Geist renders), concrete path.
