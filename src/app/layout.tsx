import type { Metadata } from "next";
import "./globals.css";
import { getSiteTheme } from "@/lib/site-config";

const SITE = "https://wuweiai.io";

// 整站 ISR：后台切主题(site_config.theme)后，60s 内所有页面自动换肤。
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "无为 Wuwei · 一念既出，万事自成",
    template: "%s · 无为 Wuwei",
  },
  description:
    "把 Claude Code、Codex 那种极客专属的强，做成普通人零门槛、免费、丝滑就能用的 AI 客户端。极致简单 · 零门槛 · 免费 · 用着丝滑 · 干得漂亮。",
  keywords: ["无为", "Wuwei", "AI客户端", "AI提效", "Claude Code", "Codex", "AI代理", "智能体"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "无为 Wuwei",
    title: "无为 Wuwei · 一念既出，万事自成",
    description: "普通人零门槛、免费、丝滑就能用的 AI 客户端。",
  },
  twitter: {
    card: "summary_large_image",
    title: "无为 Wuwei · 一念既出，万事自成",
    description: "普通人零门槛、免费、丝滑就能用的 AI 客户端。",
  },
  alternates: {
    canonical: SITE,
    languages: {
      "zh-CN": SITE,
      en: `${SITE}/en`,
      "x-default": `${SITE}/en`,
    },
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = await getSiteTheme(); // 'dark'(默认) | 'light'，读 site_config.theme
  return (
    <html lang="zh-CN" data-theme={theme} className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
