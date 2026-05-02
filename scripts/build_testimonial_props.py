"""
Fetch real testimonial data from api.galactus.run for a given expert username,
filter per the testimonial-reel spec, and emit a JSON file matching
testimonialReelSchema for local Remotion render.

Usage:
    python3 scripts/build_testimonial_props.py <username> [out.json]

Strategy:
    1. Fetch year-end-recap/<u>/ → display_name + profile_pic + visible_testimonials (named).
    2. If fewer than TOP_N visible testimonials qualify (len(text) >= 10), fallback to
       public-testimonials/?username=<u>&all=1 (no follower_name → 'Anonymous').
    3. Pick top TOP_N, emit testimonialReelSchema-shaped JSON.
"""
import json
import sys
from urllib.request import urlopen

API = "https://api.galactus.run"
MIN_LEN = 10
TOP_N = 3


def fetch_json(url: str) -> dict | list:
    with urlopen(url) as r:
        return json.load(r)


def build(username: str) -> dict:
    recap = fetch_json(f"{API}/year-end-recap/{username}/")
    creator_name = recap.get("display_name") or username
    profile_pic = recap.get("profile_pic") or ""

    visible = recap.get("visible_testimonials") or []
    qualifying = [
        {
            "name": t.get("follower_name") or "Anonymous",
            "text": (t.get("text") or "").strip(),
            "id": t.get("id"),
            "avatar": t.get("profile_pic") or "",
        }
        for t in visible
        if len((t.get("text") or "").strip()) >= MIN_LEN
    ]

    if len(qualifying) < TOP_N:
        public = fetch_json(
            f"{API}/public-testimonials/?username={username}&all=1&page_size=50"
        )
        results = public.get("results") if isinstance(public, dict) else public
        seen_ids = {t["id"] for t in qualifying}
        for t in (results or []):
            if t["id"] in seen_ids:
                continue
            text = (t.get("text") or "").strip()
            if len(text) < MIN_LEN:
                continue
            qualifying.append({
                "name": "Anonymous" if t.get("is_anonymous") else "",
                "text": text,
                "id": t["id"],
                "avatar": t.get("profile_pic") or "",
            })

    qualifying.sort(key=lambda t: -t["id"])
    top = qualifying[:TOP_N]

    while len(top) < TOP_N:
        top.append({"name": "", "text": "", "id": None, "avatar": ""})

    return {
        "profilePic": profile_pic,
        "topmateLink": f"https://topmate.io/{username}",
        "creatorName": creator_name,
        "name1": top[0]["name"],
        "name2": top[1]["name"],
        "name3": top[2]["name"],
        "testimonial1": top[0]["text"],
        "testimonial2": top[1]["text"],
        "testimonial3": top[2]["text"],
        "avatar1": top[0]["avatar"],
        "avatar2": top[1]["avatar"],
        "avatar3": top[2]["avatar"],
        "_debug_qualifying_count": len(qualifying),
        "_debug_picked_ids": [t["id"] for t in top],
        "_debug_avatars_present": sum(1 for t in top if t.get("avatar")),
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: build_testimonial_props.py <username> [out.json]", file=sys.stderr)
        sys.exit(2)
    username = sys.argv[1]
    out_path = sys.argv[2] if len(sys.argv) > 2 else f"out/props-{username}.json"
    props = build(username)
    print(json.dumps(props, indent=2))
    import os
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    # Strip debug keys when writing the file consumed by Remotion (schema is strict).
    file_props = {k: v for k, v in props.items() if not k.startswith("_")}
    with open(out_path, "w") as f:
        json.dump(file_props, f, indent=2)
    print(f"\n→ wrote {out_path}", file=sys.stderr)
