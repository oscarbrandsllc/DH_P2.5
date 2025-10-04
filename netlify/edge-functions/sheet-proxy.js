// netlify/edge-functions/sheet-proxy.js
// Usage: /api/sheet?sheet=<TabName>&id=<SheetID>[&force=1]
export default async (request, context) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || Deno.env.get("PLAYER_STATS_SHEET_ID") || Deno.env.get("GOOGLE_SHEET_ID");
  const sheet = url.searchParams.get("sheet");
  const force = url.searchParams.get("force") === "1";
  if (!id || !sheet) return new Response("Missing id or sheet", { status: 400 });

  // Live windows (UTC): Thu 23→Fri 05, Sun 16→Mon 06, Mon 23→Tue 05
  const now = new Date();
  const d = now.getUTCDay(), h = now.getUTCHours();
  const live = (d===4&&h>=23)||(d===5&&h<5)||(d===0&&h>=16)||(d===1&&h<6)||(d===1&&h>=23)||(d===2&&h<5);

  const sMaxAge = live ? 900 : 3600; // 15m during games, otherwise 1h
  const swr = 86400; // 24h

  const target = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;

  const cache = caches.default;
  const key = new Request(target, { method: "GET" });

  if (!force) {
    const hit = await cache.match(key);
    if (hit) return hit;
  }

  const upstream = await fetch(target, { headers: { "Accept": "text/csv" } });
  const res = new Response(upstream.body, upstream);
  res.headers.set("Content-Type", "text/csv; charset=utf-8");
  res.headers.set("Cache-Control", `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);
  await cache.put(key, res.clone());
  return res;
};
