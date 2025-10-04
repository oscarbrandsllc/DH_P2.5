// netlify/edge-functions/sleeper-proxy.js
// Usage: /api/sleeper/<v1 path>[?force=1], e.g. /api/sleeper/players/nfl
export default async (request, context) => {
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";

  const passthrough = url.pathname.replace(/^\/api\/sleeper\/?/, "");
  if (!passthrough) return new Response("Missing path", { status: 400 });
  const target = `https://api.sleeper.app/v1/${passthrough}${url.search}`;

  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const inLiveWindow =
    (day === 4 && hour >= 23) || (day === 5 && hour < 5) ||
    (day === 0 && hour >= 16) || (day === 1 && hour < 6) ||
    (day === 1 && hour >= 23) || (day === 2 && hour < 5);

  const liveish = /stats|rosters|leagues/.test(passthrough);
  let sMaxAge, swr;
  if (liveish) {
    sMaxAge = inLiveWindow ? 60 : 300; // 60s during live windows, else 5m
    swr = 3600;                        // 1h SWR
  } else {
    sMaxAge = 86400; // 24h
    swr = 604800;    // 7d
  }

  const cache = caches.default;
  const cacheKey = new Request(target, { method: "GET" });

  if (!force) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  const upstream = await fetch(target, { headers: { "Accept": "application/json" } });
  const res = new Response(upstream.body, upstream);
  res.headers.set("Content-Type", "application/json; charset=utf-8");
  res.headers.set("Cache-Control", `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);

  await cache.put(cacheKey, res.clone());
  return res;
};
