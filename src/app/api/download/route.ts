import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabasePublic, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "wuwei";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 32);
}

const PLATFORMS = new Set(["windows", "macos", "linux"]);

// 下载跳转：查最新已发布包 → 记一条 download 埋点 → 302 到文件
export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform") || "";
  if (!PLATFORMS.has(platform)) {
    return NextResponse.json({ error: "bad platform" }, { status: 400 });
  }

  const { data } = await supabasePublic()
    .from("releases")
    .select("version,file_url")
    .eq("platform", platform)
    .eq("is_published", true)
    .eq("channel", "stable")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.file_url) {
    return NextResponse.json({ error: "no release yet" }, { status: 404 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;

  // 埋点（失败不挡下载）
  await supabaseAdmin()
    .from("analytics_events")
    .insert({
      event_type: "download",
      path: "/api/download",
      platform,
      country,
      ip_hash: hashIp(ip),
      ua: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      meta: { version: data.version },
    })
    .then(() => {}, () => {});

  return NextResponse.redirect(data.file_url, 302);
}
