import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// 保留哈希列兼容旧数据；明文 ip_address 列用于后台 IP 明细 + 打标签
function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "wuwei";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 32);
}

const ALLOWED = new Set([
  "pageview",
  "download",
  "signup",
  "cta_click",
  "client_activate",   // 客户端激活
  "client_login",      // 客户端登录
  "client_usage",      // 客户端使用
]);

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}));
    const event_type = String(b.event_type || "");
    if (!ALLOWED.has(event_type)) {
      return NextResponse.json({ ok: false, error: "bad event" }, { status: 400 });
    }
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null;

    await supabaseAdmin().from("analytics_events").insert({
      event_type,
      path: b.path ?? null,
      referer: b.referer ?? null,
      country,
      lang: b.lang ?? null,
      platform: b.platform ?? null,
      ip_hash: hashIp(ip),
      ip_address: ip,
      anon_id: b.anon_id ?? null,
      ua: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      // 前端没传 product 时默认 site（本尊站点自己的 pageview/download）
      meta: { ...(b.meta ?? {}), product: b.meta?.product ?? "site" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
