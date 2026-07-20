import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// CI 推包写库端点（需求①闭环，方案 §5）。
// 鉴权：header x-ci-secret 必须等于 CI_RELEASE_SECRET（Vercel 环境变量）。
//   —— 未配置密钥则 fail-closed 返回 503（端点未武装），避免裸奔。
//   —— 密钥与 Supabase 密钥分离（最小权限）。
// 行为：写入 releases 行，is_published=false（发版与上架解耦，人工在后台勾选后前台才可见）。
// ⚠️ 真实安装包依赖无为客户端仓 CI 出三平台包（另一条线）；本轮只把官网侧端点就绪。

const PLATFORMS = new Set(["windows", "macos", "linux"]);
const CHANNELS = new Set(["stable", "beta"]);

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest) {
  const secret = process.env.CI_RELEASE_SECRET;
  if (!secret) {
    // 端点已备好但尚未配置密钥 → 未武装，拒绝任何调用
    return NextResponse.json({ ok: false, error: "endpoint not armed" }, { status: 503 });
  }
  const provided = req.headers.get("x-ci-secret") || "";
  if (!safeEq(provided, secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });

  const version = String(b.version || "").trim();
  const platform = String(b.platform || "").trim();
  const file_url = String(b.file_url || "").trim();
  const channel = String(b.channel || "stable").trim();

  if (!version || !PLATFORMS.has(platform) || !file_url) {
    return NextResponse.json(
      { ok: false, error: "missing/invalid version|platform|file_url" },
      { status: 400 }
    );
  }
  if (!CHANNELS.has(channel)) {
    return NextResponse.json({ ok: false, error: "bad channel" }, { status: 400 });
  }

  const row = {
    version,
    platform,
    arch: String(b.arch || "x64"),
    channel,
    file_url,
    file_name: b.file_name ?? null,
    file_size: typeof b.file_size === "number" ? b.file_size : null,
    sha256: b.sha256 ?? null,
    notes: b.notes ?? null,
    is_published: false, // 默认待审，人工在后台上架
  };

  const { data, error } = await supabaseAdmin()
    .from("releases")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: "db insert failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data?.id, is_published: false });
}
