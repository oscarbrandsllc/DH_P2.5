export default async (request) => {
  try {
    const u = new URL(request.url);
    const path = u.pathname.replace(/^\/api\/sleeper\/?/, "");
    if (!path) return new Response("Missing path", { status: 400 });
    const target = `https://api.sleeper.app/v1/${path}${u.search}`;

    const now = new Date(), d = now.getUTCDay(), h = now.getUTCHours();
    const live = (d===4&&h>=23)||(d===5&&h<5)||(d===0&&h>=16)||(d===1&&h<6)||(d===1&&h>=23)||(d===2&&h<5);
    const liveish = /stats|rosters|leagues/i.test(path);
    const sMax = liveish ? (live ? 60 : 300) : 86400;
    const swr  = liveish ? 3600 : 604800;

    const upstream = await fetch(target, { headers: { "Accept": "application/json, */*" } });
    const res = new Response(upstream.body, upstream);
    res.headers.set("Cache-Control", `public, s-maxage=${sMax}, stale-while-revalidate=${swr}`);
    res.headers.set("X-Proxy", "sleeper-proxy");
    res.headers.set("X-Target", target);
    return res;
  } catch (err) {
    return new Response(`Proxy error: ${err?.message || err}`, { status: 502 });
  }
};