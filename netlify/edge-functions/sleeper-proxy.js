// netlify/edge-functions/sleeper-proxy.js
// Usage: /api/sleeper/<v1 path>[?force=1]
export default async (request, context) => {
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "1";
  const passthrough = url.pathname.replace(/^\/api\/sleeper\/?/, "");
  if (!passthrough) return new Response("Missing path", { status: 400 });

  const target = `https://api.sleeper.app/v1/${passthrough}${url.search}`;

  // Live windows (UTC)
  const now = new Date();
  const d = now.getUTCDay(), h = now.getUTCHours();
  const liveWindow = (d===4&&h>=23)||(d===5&&h<5)||(d===0&&h>=16)||(d===1&&h<6)||(d===1&&h>=23)||(d===2&&h<5);

  const liveish = /stats|rosters|leagues/.test(passthrough);
  const sMaxAge = liveish ? (liveWindow ? 60 : 300) : 86400; // 60s during games, 5m otherwise; stable 24h
  const swr = liveish ? 3600 : 604800; // 1h SWR for liveish, 7d for stable

  const cache = caches.default;
  const key = new Request(target, { method: "GET" });

  if (!force) {
    const hit = await cache.match(key);
    if (hit) return hit;
  }

  const upstream = await fetch(target, { headers: { "Accept": "application/json" } });
  const res = new Response(upstream.body, upstream);
  res.headers.set("Content-Type", "application/json; charset=utf-8");
  res.headers.set("Cache-Control", `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);
  await cache.put(key, res.clone());
  return res;
};
