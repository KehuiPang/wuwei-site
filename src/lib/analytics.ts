import { supabaseAdmin } from "./supabase";

// 看板聚合（需求③⑤，方案 §6）。只在服务端(admin，service key)调用。
// MVP：v_daily_stats 视图给 pv/uv/downloads 日趋势；其余维度在有界拉取后 JS 聚合。
// 演进（方案 §3.4）：数据量上百万后改物化视图 + 定时 refresh；UA 过滤 bot 防污染。

export type DailyStat = { day: string; pv: number; uv: number; downloads: number };
export type Bar = { key: string; count: number };

export type Dashboard = {
  totals: { pv: number; uv: number; downloads: number; logins: number; activations: number; usageEvents: number };
  daily: DailyStat[]; // 近 N 天 pv/uv/下载
  loginsByDay: Bar[]; // 近 N 天客户端登录
  activationsByDay: Bar[]; // 近 N 天客户端激活
  usageByDay: Bar[]; // 近 N 天客户端使用事件
  downloadToActivateRate: number; // 下载→激活转化率 (0-100)
  dau: number; // 今日活跃客户端（去重 anon_id）
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
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const [dailyRes, evRes, loginRes, activateRes, usageRes, dauRes] = await Promise.all([
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
    // 客户端激活事件（analytics_events 表）
    sb
      .from("analytics_events")
      .select("anon_id,created_at")
      .eq("event_type", "client_activate")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    // 客户端使用事件（analytics_events 表）
    sb
      .from("analytics_events")
      .select("anon_id,created_at")
      .eq("event_type", "client_usage")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    // 今日 DAU：client_events 表今日有任意事件的匿名 ID 去重
    sb
      .from("client_events")
      .select("anon_id")
      .gte("created_at", todayISO)
      .limit(5000),
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

  // —— 客户端激活聚合 ——
  const activations = activateRes.data ?? [];
  const activationDay = new Map<string, number>();
  for (const a of activations) {
    const d = dayKey(String(a.created_at));
    activationDay.set(d, (activationDay.get(d) || 0) + 1);
  }

  // —— 客户端使用聚合 ——
  const usageEvents = usageRes.data ?? [];
  const usageDay = new Map<string, number>();
  for (const u of usageEvents) {
    const d = dayKey(String(u.created_at));
    usageDay.set(d, (usageDay.get(d) || 0) + 1);
  }

  // —— 下载→激活转化率 ——
  const downloadToActivateRate = downloads > 0 ? Math.round((activations.length / downloads) * 1000) / 10 : 0;

  // —— 今日 DAU ——
  const dauSet = new Set<string>();
  for (const r of dauRes.data ?? []) {
    if (r.anon_id) dauSet.add(r.anon_id);
  }

  return {
    totals: { pv, uv: pvUsers.size, downloads, logins: logins.length, activations: activations.length, usageEvents: usageEvents.length },
    daily,
    loginsByDay: [...loginDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    activationsByDay: [...activationDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    usageByDay: [...usageDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    downloadToActivateRate,
    dau: dauSet.size,
    topReferers: topN(refs, 8),
    topCountries: topN(countries, 8),
    topLanding: topN(landing, 8),
    clientVersions: topN(versions, 8),
    windowDays,
  };
}

// ============================================================
// 详情页数据查询
// ============================================================

export type PvDetail = {
  daily: DailyStat[];
  topReferers: Bar[];
  topLanding: Bar[];
  topCountries: Bar[];
};

export type UvDetail = {
  daily: { day: string; uv: number }[];
  topReferers: Bar[];
  topCountries: Bar[];
  topLanding: Bar[];
};

export type DownloadDetail = {
  byProduct: Bar[];
  byPlatform: Bar[];
  daily: Bar[];
};

export type LoginDetail = {
  daily: Bar[];
  byVersion: Bar[];
  byPlatform: Bar[];
  recentLogins: { anon_id: string; version: string; platform: string; created_at: string }[];
};

/** PV 详情：每日 PV + 来源/落地页/国家分布 */
export async function getPvDetail(windowDays = 30): Promise<PvDetail> {
  const sb = supabaseAdmin();
  const since = new Date(Date.now() - windowDays * 86400_000).toISOString();

  const { data } = await sb
    .from("analytics_events")
    .select("event_type,anon_id,country,referer,path,ua,created_at")
    .eq("event_type", "pageview")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);

  const ev = (data ?? []).filter((e) => !BOT_UA.test(e.ua || ""));
  const dayMap = new Map<string, { pv: number; uvs: Set<string> }>();
  const refs = new Map<string, number>();
  const landing = new Map<string, number>();
  const countries = new Map<string, number>();

  for (const e of ev) {
    const d = dayKey(String(e.created_at));
    if (!dayMap.has(d)) dayMap.set(d, { pv: 0, uvs: new Set() });
    const entry = dayMap.get(d)!;
    entry.pv++;
    if (e.anon_id) entry.uvs.add(e.anon_id);

    refs.set(refererHost(e.referer), (refs.get(refererHost(e.referer)) || 0) + 1);
    const p = e.path || "/";
    landing.set(p, (landing.get(p) || 0) + 1);
    const c = e.country || "(未知)";
    countries.set(c, (countries.get(c) || 0) + 1);
  }

  const daily: DailyStat[] = [...dayMap.entries()]
    .map(([day, v]) => ({ day, pv: v.pv, uv: v.uvs.size, downloads: 0 }))
    .sort((a, b) => (a.day < b.day ? 1 : -1));

  return { daily, topReferers: topN(refs, 10), topLanding: topN(landing, 10), topCountries: topN(countries, 10) };
}

/** UV 详情：每日 UV + 分维度 */
export async function getUvDetail(windowDays = 30): Promise<UvDetail> {
  const sb = supabaseAdmin();
  const since = new Date(Date.now() - windowDays * 86400_000).toISOString();

  const { data } = await sb
    .from("analytics_events")
    .select("event_type,anon_id,country,referer,path,ua,created_at")
    .eq("event_type", "pageview")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);

  const ev = (data ?? []).filter((e) => !BOT_UA.test(e.ua || ""));
  const dayMap = new Map<string, Set<string>>();
  const refs = new Map<string, Set<string>>();
  const countries = new Map<string, Set<string>>();
  const landing = new Map<string, Set<string>>();

  for (const e of ev) {
    if (!e.anon_id) continue;
    const d = dayKey(String(e.created_at));
    if (!dayMap.has(d)) dayMap.set(d, new Set());
    dayMap.get(d)!.add(e.anon_id);

    const rh = refererHost(e.referer);
    if (!refs.has(rh)) refs.set(rh, new Set());
    refs.get(rh)!.add(e.anon_id);

    const c = e.country || "(未知)";
    if (!countries.has(c)) countries.set(c, new Set());
    countries.get(c)!.add(e.anon_id);

    const p = e.path || "/";
    if (!landing.has(p)) landing.set(p, new Set());
    landing.get(p)!.add(e.anon_id);
  }

  const daily = [...dayMap.entries()]
    .map(([day, uvs]) => ({ day, uv: uvs.size }))
    .sort((a, b) => (a.day < b.day ? 1 : -1));

  const toCount = (m: Map<string, Set<string>>) =>
    [...m.entries()].map(([key, s]) => ({ key, count: s.size })).sort((a, b) => b.count - a.count).slice(0, 10);

  return { daily, topReferers: toCount(refs), topCountries: toCount(countries), topLanding: toCount(landing) };
}

/** 下载详情：按产品/平台/每日 */
export async function getDownloadDetail(windowDays = 30): Promise<DownloadDetail> {
  const sb = supabaseAdmin();
  const since = new Date(Date.now() - windowDays * 86400_000).toISOString();

  const { data } = await sb
    .from("analytics_events")
    .select("path,platform,meta,created_at")
    .eq("event_type", "download")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);

  const products = new Map<string, number>();
  const platforms = new Map<string, number>();
  const days = new Map<string, number>();

  for (const e of data ?? []) {
    const product = ((e.meta as Record<string, unknown>)?.product as string) || "(未知)";
    products.set(product, (products.get(product) || 0) + 1);
    const p = e.platform || "(未知)";
    platforms.set(p, (platforms.get(p) || 0) + 1);
    const d = dayKey(String(e.created_at));
    days.set(d, (days.get(d) || 0) + 1);
  }

  return {
    byProduct: topN(products, 10),
    byPlatform: topN(platforms, 10),
    daily: [...days.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => (a.key < b.key ? 1 : -1)),
  };
}

/** 客户端登录详情 */
export async function getLoginDetail(windowDays = 30): Promise<LoginDetail> {
  const sb = supabaseAdmin();
  const since = new Date(Date.now() - windowDays * 86400_000).toISOString();

  const { data } = await sb
    .from("client_events")
    .select("anon_id,event,version,platform,created_at")
    .eq("event", "login")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);

  const days = new Map<string, number>();
  const versions = new Map<string, number>();
  const platforms = new Map<string, number>();

  for (const e of data ?? []) {
    const d = dayKey(String(e.created_at));
    days.set(d, (days.get(d) || 0) + 1);
    const v = e.version || "(未知)";
    versions.set(v, (versions.get(v) || 0) + 1);
    const p = e.platform || "(未知)";
    platforms.set(p, (platforms.get(p) || 0) + 1);
  }

  return {
    daily: [...days.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => (a.key < b.key ? 1 : -1)),
    byVersion: topN(versions, 10),
    byPlatform: topN(platforms, 10),
    recentLogins: (data ?? []).slice(0, 50).map((e) => ({
      anon_id: e.anon_id || "(匿名)",
      version: e.version || "?",
      platform: e.platform || "?",
      created_at: String(e.created_at),
    })),
  };
}

// ============================================================
// 单日明细下钻查询
// ============================================================

export type DayPvDetail = {
  day: string;
  pv: number;
  uv: number;
  topReferers: Bar[];
  topLanding: Bar[];
  topCountries: Bar[];
};

export type DayDownloadDetail = {
  day: string;
  total: number;
  byProduct: Bar[];
  byPlatform: Bar[];
};

export type DayLoginDetail = {
  day: string;
  total: number;
  byVersion: Bar[];
  byPlatform: Bar[];
  records: { anon_id: string; version: string; platform: string; created_at: string }[];
};

/** 单日 PV 明细 */
export async function getDayPvDetail(day: string): Promise<DayPvDetail> {
  const sb = supabaseAdmin();
  const dayStart = `${day}T00:00:00Z`;
  const dayEnd = `${day}T23:59:59Z`;

  const { data } = await sb
    .from("analytics_events")
    .select("anon_id,country,referer,path,ua")
    .eq("event_type", "pageview")
    .gte("created_at", dayStart)
    .lte("created_at", dayEnd)
    .limit(5000);

  const ev = (data ?? []).filter((e) => !BOT_UA.test(e.ua || ""));
  const uvs = new Set<string>();
  const refs = new Map<string, number>();
  const landing = new Map<string, number>();
  const countries = new Map<string, number>();

  for (const e of ev) {
    if (e.anon_id) uvs.add(e.anon_id);
    refs.set(refererHost(e.referer), (refs.get(refererHost(e.referer)) || 0) + 1);
    const p = e.path || "/";
    landing.set(p, (landing.get(p) || 0) + 1);
    const c = e.country || "(未知)";
    countries.set(c, (countries.get(c) || 0) + 1);
  }

  return {
    day,
    pv: ev.length,
    uv: uvs.size,
    topReferers: topN(refs, 10),
    topLanding: topN(landing, 10),
    topCountries: topN(countries, 10),
  };
}

/** 单日下载明细 */
export async function getDayDownloadDetail(day: string): Promise<DayDownloadDetail> {
  const sb = supabaseAdmin();
  const dayStart = `${day}T00:00:00Z`;
  const dayEnd = `${day}T23:59:59Z`;

  const { data } = await sb
    .from("analytics_events")
    .select("platform,meta")
    .eq("event_type", "download")
    .gte("created_at", dayStart)
    .lte("created_at", dayEnd)
    .limit(5000);

  const products = new Map<string, number>();
  const platforms = new Map<string, number>();

  for (const e of data ?? []) {
    const product = ((e.meta as Record<string, unknown>)?.product as string) || "(未知)";
    products.set(product, (products.get(product) || 0) + 1);
    const p = e.platform || "(未知)";
    platforms.set(p, (platforms.get(p) || 0) + 1);
  }

  return {
    day,
    total: (data ?? []).length,
    byProduct: topN(products, 10),
    byPlatform: topN(platforms, 10),
  };
}

/** 单日登录明细 */
export async function getDayLoginDetail(day: string): Promise<DayLoginDetail> {
  const sb = supabaseAdmin();
  const dayStart = `${day}T00:00:00Z`;
  const dayEnd = `${day}T23:59:59Z`;

  const { data } = await sb
    .from("client_events")
    .select("anon_id,version,platform,created_at")
    .eq("event", "login")
    .gte("created_at", dayStart)
    .lte("created_at", dayEnd)
    .order("created_at", { ascending: false })
    .limit(500);

  const versions = new Map<string, number>();
  const platforms = new Map<string, number>();

  for (const e of data ?? []) {
    const v = e.version || "(未知)";
    versions.set(v, (versions.get(v) || 0) + 1);
    const p = e.platform || "(未知)";
    platforms.set(p, (platforms.get(p) || 0) + 1);
  }

  return {
    day,
    total: (data ?? []).length,
    byVersion: topN(versions, 10),
    byPlatform: topN(platforms, 10),
    records: (data ?? []).map((e) => ({
      anon_id: e.anon_id || "(匿名)",
      version: e.version || "?",
      platform: e.platform || "?",
      created_at: String(e.created_at),
    })),
  };
}
