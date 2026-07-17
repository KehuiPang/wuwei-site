import { supabaseAdmin } from "./supabase";

// 看板聚合（需求③⑤，方案 §6）。只在服务端(admin，service key)调用。
// MVP：v_daily_stats 视图给 pv/uv/downloads 日趋势；其余维度在有界拉取后 JS 聚合。
// 演进（方案 §3.4）：数据量上百万后改物化视图 + 定时 refresh；UA 过滤 bot 防污染。

export type DailyStat = { day: string; pv: number; uv: number; downloads: number };
export type Bar = { key: string; count: number };

export type Dashboard = {
  totals: { pv: number; uv: number; downloads: number; logins: number };
  daily: DailyStat[]; // 近 N 天 pv/uv/下载
  loginsByDay: Bar[]; // 近 N 天客户端登录
  topReferers: Bar[];
  topCountries: Bar[];
  topLanding: Bar[];
  clientVersions: Bar[];
  windowDays: number;
};

const BOT_UA = /bot|crawler|spider|slurp|bingpreview|yandex|ahrefs|semrush|lighthouse|headlesschrome/i;

function refererHost(r: string | null): string {
  if (!r) return "(直接访问)";
  try {
    return new URL(r).hostname.replace(/^www\./, "");
  } catch {
    return "(其他)";
  }
}

function topN(map: Map<string, number>, n: number): Bar[] {
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

export async function getDashboard(windowDays = 30): Promise<Dashboard> {
  const sb = supabaseAdmin();
  const since = new Date(Date.now() - windowDays * 86400_000).toISOString();

  const [dailyRes, evRes, loginRes] = await Promise.all([
    sb.from("v_daily_stats").select("day,pv,uv,downloads").limit(windowDays),
    sb
      .from("analytics_events")
      .select("event_type,anon_id,country,referer,path,ua,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    sb
      .from("client_events")
      .select("anon_id,version,platform,created_at")
      .eq("event", "login")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
  ]);

  const daily: DailyStat[] = (dailyRes.data ?? []).map((d) => ({
    day: dayKey(String(d.day)),
    pv: Number(d.pv) || 0,
    uv: Number(d.uv) || 0,
    downloads: Number(d.downloads) || 0,
  }));

  // —— analytics_events 有界聚合（过滤 bot 防污染）——
  const ev = (evRes.data ?? []).filter((e) => !BOT_UA.test(e.ua || ""));
  const pvUsers = new Set<string>();
  let pv = 0,
    downloads = 0;
  const refs = new Map<string, number>();
  const countries = new Map<string, number>();
  const landing = new Map<string, number>();
  for (const e of ev) {
    if (e.event_type === "pageview") {
      pv++;
      if (e.anon_id) pvUsers.add(e.anon_id);
      refs.set(refererHost(e.referer), (refs.get(refererHost(e.referer)) || 0) + 1);
      const path = e.path || "/";
      landing.set(path, (landing.get(path) || 0) + 1);
    }
    if (e.event_type === "download") downloads++;
    const c = e.country || "(未知)";
    if (e.event_type === "pageview") countries.set(c, (countries.get(c) || 0) + 1);
  }

  // —— client_events 登录聚合 ——
  const logins = loginRes.data ?? [];
  const loginDay = new Map<string, number>();
  const versions = new Map<string, number>();
  for (const l of logins) {
    const d = dayKey(String(l.created_at));
    loginDay.set(d, (loginDay.get(d) || 0) + 1);
    const v = l.version || "(未知)";
    versions.set(v, (versions.get(v) || 0) + 1);
  }

  return {
    totals: { pv, uv: pvUsers.size, downloads, logins: logins.length },
    daily,
    loginsByDay: [...loginDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    topReferers: topN(refs, 8),
    topCountries: topN(countries, 8),
    topLanding: topN(landing, 8),
    clientVersions: topN(versions, 8),
    windowDays,
  };
}
