// netlify/edge-functions/sheet-proxy.js
// Usage: /api/sheet?sheet=<TabName>&id=<SheetID>[&force=1]
export default async (request, context) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || Deno.env.get("PLAYER_STATS_SHEET_ID") || Deno.env.get("GOOGLE_SHEET_ID");
  const sheet = url.searchParams.get("sheet");
  const force = url.searchParams.get("force") === "1";

  if (!id || !sheet) {
    return new Response("Missing id or sheet", { status: 400 });
  }

  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const inLiveWindow =
    (day === 4 && hour >= 23) || (day === 5 && hour < 5) ||
    (day === 0 && hour >= 16) || (day === 1 && hour < 6) ||
    (day === 1 && hour >= 23) || (day === 2 && hour < 5);

  const sMaxAge = inLiveWindow ? 900 : 3600; // 15m live, 1h otherwise
  const swr = 86400; // 24h

  const target = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
  const cache = caches.default;
  const cacheKey = new Request(target, { method: "GET" });

  if (!force) {
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
  }

  const upstream = await fetch(target, { headers: { "Accept": "text/csv" } });
  const res = new Response(upstream.body, upstream);
  res.headers.set("Content-Type", "text/csv; charset=utf-8");
  res.headers.set("Cache-Control", `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);

  await cache.put(cacheKey, res.clone());
  return res;
};
