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
const PRODUCTS = new Set(["wuwei", "nian", "shot"]);

// 下载跳转：查最新已发布包 → 记一条 download 埋点 → 302 到文件
// 优先从本地 /downloads 目录找文件，没有再查数据库
export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform") || "";
  const product = req.nextUrl.searchParams.get("product") || "wuwei";

  if (!PLATFORMS.has(platform)) {
    return NextResponse.json({ error: "bad platform" }, { status: 400 });
  }
  if (!PRODUCTS.has(product)) {
    return NextResponse.json({ error: "bad product" }, { status: 400 });
  }

  // 先尝试本地文件（public/downloads/）
  const localFile = `/downloads/${product}-${platform}-latest.exe`;
  const localPath = `${process.cwd()}/public${localFile}`;
  const fs = await import("fs");
  let fileUrl: string | null = null;
  let version = "latest";

  if (fs.existsSync(localPath)) {
    // 本地有文件，直接用
    fileUrl = localFile;
  } else {
    // 查数据库
    const { data } = await supabasePublic()
      .from("releases")
      .select("version,file_url")
      .eq("platform", platform)
      .eq("product", product)
      .eq("is_published", true)
      .eq("channel", "stable")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data?.file_url) {
      return NextResponse.json({ error: "no release yet" }, { status: 404 });
    }
    fileUrl = data.file_url;
    version = data.version;
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
      path: `/api/download?product=${product}&platform=${platform}`,
      platform,
      product,
      country,
      ip_hash: hashIp(ip),
      ua: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      meta: { version, product },
    })
    .then(() => {}, () => {});

  // 如果是本地文件，直接返回文件；如果是外部 URL，302 跳转
  if (fileUrl && fileUrl.startsWith("/downloads/")) {
    const fileBuffer = fs.readFileSync(`${process.cwd()}/public${fileUrl}`);
    const fileName = fileUrl.split("/").pop() || "download.exe";
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-msdownload",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  }

  return NextResponse.redirect(fileUrl || "https://wuweiai.io", 302);
}
