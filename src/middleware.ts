import { NextRequest, NextResponse } from "next/server";
import { LANG_COOKIE } from "@/lib/site";

// 中英地理分流（方案 §2.3）：
// - 只作用于根路径 "/"（中文站）；产品/对标/英文页各有独立稳定 URL，不动。
// - 手动切换写的 cookie 优先（尊重用户选择，也让 SEO URL 稳定）。
// - 爬虫 UA 一律放行不跳转：中/英是两套独立 URL 互打 hreflang，绝不按 IP 302 跟随爬虫，
//   否则 Google 只能爬到一套（§2.3 SEO 正确姿势）。
// - 真人首访无 cookie：CN → 留中文 /；非 CN → 跳 /en。
// - 14 语言 cookie：zh → /，en/ja/ko/de/... → /en（本期非 zh 一律跳英文兜底）。

const BOT_UA =
  /bot|crawler|spider|slurp|bingpreview|googlebot|baiduspider|yandex|duckduckbot|facebookexternalhit|embedly|quora|pinterest|slackbot|twitterbot|whatsapp|telegrambot|discordbot|applebot|ia_archiver|semrush|ahrefs|mj12bot|lighthouse|headlesschrome/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (BOT_UA.test(ua)) return NextResponse.next();

  // 手动选择优先
  const chosen = req.cookies.get(LANG_COOKIE)?.value;
  if (chosen === "zh") return NextResponse.next();
  if (chosen && chosen !== "zh") {
    // en/ja/ko/de/... 本期一律跳英文站
    return NextResponse.redirect(new URL("/en", req.url));
  }

  // 首访：按地理头分流。Vercel 提供 x-vercel-ip-country；CF 橙云代理提供 cf-ipcountry。
  const country = (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    ""
  ).toUpperCase();

  // 有明确国别且非中国大陆 → 英文站；CN / 未知 → 留中文（默认）。
  if (country && country !== "CN") {
    return NextResponse.redirect(new URL("/en", req.url));
  }
  return NextResponse.next();
}

// 只拦根路径，成本最低，也避免误伤静态资源/子页面。
export const config = {
  matcher: ["/"],
};
