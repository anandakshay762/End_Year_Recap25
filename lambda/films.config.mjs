// Films registry — single source of truth for personalized video pipelines.
//
// Adding a new film:
//   1. Add a Composition in src/Root.tsx (matching compositionId).
//   2. Add an entry here. No orchestrator changes.

const TOP_N_TESTIMONIAL = 3;
const MIN_TESTIMONIAL_LEN = 10;

const httpError = (status, username, apiBase) => {
  if (status === 404) {
    const e = new Error(`User '${username}' not found on ${apiBase}`);
    e.code = 'USER_NOT_FOUND';
    return e;
  }
  return new Error(`HTTP ${status} from ${apiBase}`);
};

async function fetchUser(username, apiBase) {
  const r = await fetch(`${apiBase}/year-end-recap/${encodeURIComponent(username)}/`);
  if (!r.ok) throw httpError(r.status, username, apiBase);
  return r.json();
}

export const films = {
  'loop-sharing-template': {
    compositionId: 'loop-sharing-template',
    outDir: 'launch-films',
    framesPerLambda: 80,
    prefetch: async (username, apiBase) => {
      const data = await fetchUser(username, apiBase);
      const profile_pic = data?.profile_pic ?? data?.data?.profile_pic ?? '';
      return {
        inputProps: { username, apiBase, profile_pic },
        raw: { profile_pic },
      };
    },
    eligibility: () => ({ ok: true }),
    share: {
      campaign: 'loop_video_sharing',
      title: 'Topmate Loop launch film',
      description: 'Your one-of-one launch film for Loop',
    },
  },

  'testimonial-reel': {
    compositionId: 'testimonial-reel',
    outDir: 'testimonial-reels',
    framesPerLambda: 10, // 480 frames / 10 = 48 chunks → sub-10s wall-clock target
    prefetch: async (username, apiBase) => {
      // Year-end-recap returns visible_testimonials with follower_name + profile_pic.
      // Public-testimonials is the fallback (no follower_name; anonymous flag only).
      const recap = await fetchUser(username, apiBase);
      const profile_pic = recap?.profile_pic ?? recap?.data?.profile_pic ?? '';
      const creatorName = recap?.display_name ?? recap?.data?.display_name ?? username;

      const visible = recap?.visible_testimonials ?? [];
      const qualifying = [];
      for (const t of visible) {
        const text = (t.text ?? '').trim();
        if (text.length < MIN_TESTIMONIAL_LEN) continue;
        qualifying.push({
          id: t.id,
          name: t.follower_name || 'Anonymous',
          text,
          avatar: t.profile_pic || '',
        });
      }

      if (qualifying.length < TOP_N_TESTIMONIAL) {
        const pubRes = await fetch(
          `${apiBase}/public-testimonials/?username=${encodeURIComponent(username)}` +
          `&all=1&page_size=50`,
        );
        if (pubRes.ok) {
          const pubData = await pubRes.json();
          const results = pubData?.results ?? pubData ?? [];
          const seen = new Set(qualifying.map((q) => q.id));
          for (const t of results) {
            if (seen.has(t.id)) continue;
            const text = (t.text ?? '').trim();
            if (text.length < MIN_TESTIMONIAL_LEN) continue;
            qualifying.push({
              id: t.id,
              name: t.is_anonymous ? 'Anonymous' : '',
              text,
              avatar: t.profile_pic || '',
            });
          }
        }
      }

      qualifying.sort((a, b) => b.id - a.id);
      const top = qualifying.slice(0, TOP_N_TESTIMONIAL);
      while (top.length < TOP_N_TESTIMONIAL) {
        top.push({ id: null, name: '', text: '', avatar: '' });
      }

      return {
        inputProps: {
          profilePic: profile_pic,
          topmateLink: `https://topmate.io/${username}`,
          creatorName,
          name1: top[0].name, name2: top[1].name, name3: top[2].name,
          testimonial1: top[0].text, testimonial2: top[1].text, testimonial3: top[2].text,
          avatar1: top[0].avatar, avatar2: top[1].avatar, avatar3: top[2].avatar,
        },
        raw: { qualifyingCount: qualifying.length },
      };
    },
    eligibility: ({ qualifyingCount }) =>
      qualifyingCount >= TOP_N_TESTIMONIAL
        ? { ok: true }
        : { ok: false, reason: `only ${qualifyingCount}/${TOP_N_TESTIMONIAL} qualifying testimonials` },
    share: {
      campaign: 'testimonial_reel_sharing',
      title: 'Your testimonial reel',
      description: 'Your latest testimonials, cut into a reel.',
    },
  },
};
