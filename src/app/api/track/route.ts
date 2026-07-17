import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// 隐私：IP 只存哈希（品牌"诚实不套路"）
function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "wuwei";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 32);
}

const ALLOWED = new Set(["pageview", "download", "signup", "cta_click"]);

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
      anon_id: b.anon_id ?? null,
      ua: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      meta: b.meta ?? {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
