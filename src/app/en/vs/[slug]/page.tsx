import type { Metadata } from "next";
import { VS_PAGES_EN } from "@/lib/vs";
import { VsLanding, notFound } from "@/components/VsLanding";

export const revalidate = 3600; // 对标文案属常青内容，1h ISR 足够

export function generateStaticParams() {
  return Object.keys(VS_PAGES_EN).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = VS_PAGES_EN[slug];
  if (!p) return {};
  const url = `https://wuweiai.io/en/vs/${slug}`;
  return {
    title: p.meta.title,
    description: p.meta.description,
    alternates: {
      canonical: url,
      // 与同名中文页互标 hreflang
      languages: { "zh-CN": `https://wuweiai.io/vs/${slug}`, en: url, "x-default": url },
    },
    // 门禁页（wuwei-vs-claude-code）待 CEO 终检前不被索引
    robots: p.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: p.meta.title, description: p.meta.description, url },
  };
}

export default async function EnVsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = VS_PAGES_EN[slug];
  if (!p) notFound();
  return <VsLanding page={p} pathBase="/en/vs" />;
}
