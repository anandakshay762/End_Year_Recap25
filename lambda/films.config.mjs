// Films registry — single source of truth for personalized video pipelines.
//
// Adding a new film:
//   1. Add a Composition in src/Root.tsx (matching compositionId).
//   2. Add an entry here. No orchestrator changes.

const TOP_N_TESTIMONIAL = 3;
const MIN_TESTIMONIAL_LEN = 10;

// Profile Stats API (PDV-4584) — gives profile_views, top_service, top_sources, top_cities.
// Token must be set as PROFILE_STATS_API_KEY in the Lambda env (and locally for `server.mjs`).
const PROFILE_STATS_BASE = 'https://data.analytics.topmate.io';

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

const STATS_EMPTY = {
  profile_views: 0, top_service: null, top_sources: [], top_cities: [],
  window: { start_date: null, end_date: null, tz: 'Asia/Calcutta' },
};

// Profile Stats — `data` payload for the requested window. Default window is the
// last 30 days. Pass startDate+endDate (YYYY-MM-DD, both inclusive) for a custom one.
// Returns the empty-state shape on failure so renders don't 502 on analytics blips.
async function fetchProfileStats(username, opts = {}) {
  const key = process.env.PROFILE_STATS_API_KEY || '';
  if (!key) return STATS_EMPTY;
  const params = new URLSearchParams({ username });
  if (opts.startDate && opts.endDate) {
    params.set('start_date', opts.startDate);
    params.set('end_date', opts.endDate);
  }
  try {
    const r = await fetch(
      `${PROFILE_STATS_BASE}/public/profile-stats?${params.toString()}`,
      { headers: { 'x-internal-key': key } },
    );
    if (!r.ok) {
      if (r.status === 404) {
        const e = new Error(`User '${username}' not found in profile-stats`);
        e.code = 'USER_NOT_FOUND';
        throw e;
      }
      return STATS_EMPTY;
    }
    const body = await r.json();
    return body?.data ?? STATS_EMPTY;
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') throw err;
    return STATS_EMPTY;
  }
}

// Given a YYYY-MM-DD start_date, return the previous-30-days window
// (back-to-back, non-overlapping) as { startDate, endDate }.
function priorWindowFor(startDate) {
  if (!startDate) return null;
  const cur = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(cur.getTime())) return null;
  const priorEnd = new Date(cur);
  priorEnd.setUTCDate(priorEnd.getUTCDate() - 1);
  const priorStart = new Date(priorEnd);
  priorStart.setUTCDate(priorStart.getUTCDate() - 29); // 30-day inclusive window
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startDate: fmt(priorStart), endDate: fmt(priorEnd) };
}

const monthName = (yyyymmdd) => {
  if (!yyyymmdd) return '';
  const d = new Date(`${yyyymmdd}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
};

const formatDelta = (current, prior, priorStartDate) => {
  const label = monthName(priorStartDate) || 'last month';
  if (!Number.isFinite(prior) || prior <= 0) {
    return current > 0 ? `New traffic vs ${label}` : `+0% vs ${label}`;
  }
  const pct = Math.round(((current - prior) / prior) * 100);
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct}% vs ${label}`;
};

// Defaults for fields the BE/analytics doesn't yet provide. Keeps the
// composition renderable with sensible numbers until upstream data lands.
const FALLBACK = {
  designation: 'Topmate Creator',
  month_sessions: 0,
  rating: 0,
  review_count: 0,
  top_pct: '1%',
};

const padTuple = (arr, fallback) => {
  const out = arr.slice(0, 3).map((x, i) => x ?? fallback[i]);
  while (out.length < 3) out.push(fallback[out.length]);
  return out;
};

// service_id (string) → service title, derived from year-end-recap's services[].
// profile-stats only returns a numeric service_id; we resolve the human name here.
function buildServiceLookup(recap) {
  const map = new Map();
  const services = recap?.services ?? recap?.data?.services ?? [];
  for (const s of services) {
    if (s?.id != null && s?.title) map.set(String(s.id), s.title);
  }
  // most_popular_service_title is a fallback if we know it but can't map by id.
  return map;
}

// GoogleSearchV2 takes the CompositionProps shape (top_services/top_sources/top_cities tuples + month_label).
function buildCompositionV2Props({ username, recap, stats, priorStats }) {
  const display_name = recap?.display_name ?? recap?.data?.display_name ?? username;
  const profile_pic = recap?.profile_pic ?? recap?.data?.profile_pic ?? '';
  // year-end-recap exposes `expertise_string` (e.g. "Data") as the creator's domain;
  // it doubles as designation when nothing more specific is available.
  const designation = recap?.expertise_string ?? recap?.data?.expertise_string
    ?? recap?.designation ?? recap?.data?.designation ?? FALLBACK.designation;
  const rating = recap?.avg_ratings ?? recap?.data?.avg_ratings ?? FALLBACK.rating;
  const review_count = recap?.testimonial_count ?? recap?.data?.testimonial_count ?? FALLBACK.review_count;
  const mostPopularServiceTitle = recap?.most_popular_service_title ?? recap?.data?.most_popular_service_title;

  // Total monthly bookings: profile-stats doesn't expose a top-level total, but every
  // booking has exactly one source attribution, so sum(top_sources.bookings) is a
  // tight lower bound. (Top-3 truncation; if the user has >3 sources, real total is
  // higher — but for ajay_shenoy etc. the top 3 captures the bulk.)
  const monthSessionsFromSources = (stats?.top_sources ?? [])
    .reduce((sum, s) => sum + Number(s?.bookings ?? 0), 0);

  const sources = padTuple(
    (stats?.top_sources ?? []).map((s) => ({
      name: s.source || 'Direct',
      badge: `${s.bookings} bookings`,
    })),
    [
      { name: 'Topmate Discovery', badge: 'Most bookings came from here' },
      { name: 'LinkedIn',          badge: 'Strong external traffic' },
      { name: 'Direct',            badge: 'Repeat and shared users' },
    ],
  );

  const cities = padTuple(
    (stats?.top_cities ?? []).map((c) => ({
      name: c.city || 'Unknown',
      badge: `${c.bookings} bookings`,
    })),
    [
      { name: 'Bangalore', badge: 'Highest number of bookings' },
      { name: 'Mumbai',    badge: 'Strong demand this month' },
      { name: 'Delhi',     badge: 'Consistent bookings' },
    ],
  );

  const serviceLookup = buildServiceLookup(recap);
  const ts = stats?.top_service;
  const topServiceName = ts
    ? (serviceLookup.get(String(ts.service_id)) || mostPopularServiceTitle || `Service #${ts.service_id}`)
    : (mostPopularServiceTitle || '1:1 Session');
  const services = padTuple(
    [{ name: topServiceName, badge: 'Most booked this month' }],
    [
      { name: '1:1 Career Strategy Session', badge: 'Most booked this month' },
      { name: 'Resume Review Session',       badge: 'Popular this month' },
      { name: 'Mock Interview Prep',         badge: 'Frequently booked' },
    ],
  );

  const profile_views = Number(stats?.profile_views ?? 0);
  const profile_views_str = profile_views >= 1000
    ? `${(profile_views / 1000).toFixed(1)}K`
    : String(profile_views);

  const priorViews = Number(priorStats?.profile_views ?? 0);
  const views_vs_last_month = formatDelta(
    profile_views, priorViews, priorStats?.window?.start_date,
  );

  // Status-bar clock — formatted in IST so the video reads "now" for the
  // creator no matter where the Lambda renders. Locale 'en-IN' gives "7:04 pm";
  // we strip the space + uppercase the AM/PM to match Google's chrome ("7:04 PM").
  const time_label = new Date()
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Calcutta' })
    .replace(/\s*([ap])m$/i, (_m, p) => ` ${p.toUpperCase()}M`);

  // Bulletproof fallback: ui-avatars.com is a reliable CDN that returns an SVG
  // initials avatar for any name. Beats hard-coding a URL that can 404 (and the
  // render fails fatally if the profile pic image won't load).
  const profile_pic_url = profile_pic
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(display_name)}&background=E0E0E0&color=5F6368&size=240`;

  return {
    user_name: display_name,
    designation,
    profile_pic_url,
    topmate_link: `topmate.io/${username}`,
    month_label: "April '26",
    time_label,
    month_sessions: monthSessionsFromSources,
    booking_context: 'This April',
    rating,
    review_count,
    profile_views: profile_views_str,
    views_vs_last_month,
    top_pct: FALLBACK.top_pct,
    top_services: services,
    top_sources: sources,
    top_cities: cities,
  };
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
              // public-testimonials doesn't expose follower_name, so we don't
              // know the name regardless of is_anonymous. Default to
              // 'Anonymous' — better than the composition's "User N" fallback.
              name: 'Anonymous',
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

  // ── April Month Recap (PDV-4570 follow-up; analytics from PDV-4584) ──

  'april-google-search-v2': {
    compositionId: 'april-google-search-v2',
    outDir: 'april-google-search-v2',
    framesPerLambda: 40, // 1200 / 40 = 30 chunks
    // Eligibility only needs `month_sessions`, which is derived from
    // top_sources of the current 30-day window. Skip the year-end-recap call
    // and the prior-window stats call (both used only for full render props).
    eligibilityPrefetch: async (username) => {
      const stats = await fetchProfileStats(username);
      const month_sessions = (stats?.top_sources ?? [])
        .reduce((sum, s) => sum + Number(s?.bookings ?? 0), 0);
      return { month_sessions };
    },
    prefetch: async (username, apiBase) => {
      // 1) Fetch year-end-recap + current 30-day profile-stats in parallel.
      const [recap, stats] = await Promise.all([
        fetchUser(username, apiBase),
        fetchProfileStats(username),
      ]);
      // 2) Use the current window's start_date to pull the prior back-to-back
      //    30-day window (e.g. March) for the views-delta comparison.
      const prior = priorWindowFor(stats?.window?.start_date);
      const priorStats = prior
        ? await fetchProfileStats(username, prior)
        : STATS_EMPTY;
      const inputProps = buildCompositionV2Props({ username, recap, stats, priorStats });
      return {
        inputProps,
        raw: { month_sessions: inputProps.month_sessions },
      };
    },
    eligibility: ({ month_sessions } = {}) =>
      Number(month_sessions) >= 1
        ? { ok: true }
        : { ok: false, reason: 'no bookings in the recap window' },
    share: {
      campaign: 'april_google_search_v2',
      title: 'Your April Recap',
      description: 'Your April month-end recap — top services, sources, and cities.',
    },
  },
};
