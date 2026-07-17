import type { MetadataRoute } from "next";
import { INDEXABLE_VS_SLUGS, INDEXABLE_VS_SLUGS_EN, VS_PAGES } from "@/lib/vs";

// 全前台页 + 多语言 alternates（/ 与 /en 互标 hreflang）。/admin、/api 不入（robots 屏蔽）。
// /vs 对标落地页只收录未被 noindex 门禁的（wuwei-vs-claude-code 待 CEO 终检，排除）。
// 有英文对标页（hasEn）的中文页互标 hreflang → /en/vs/[slug]。
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wuweiai.io";

  // 中文对标页（有 EN 兄弟页的互标 hreflang）
  const vsZh: MetadataRoute.Sitemap = INDEXABLE_VS_SLUGS.map((slug) => {
    const zhUrl = `${base}/vs/${slug}`;
    const hasEn = VS_PAGES[slug]?.hasEn;
    return {
      url: zhUrl,
      changeFrequency: "monthly",
      priority: 0.7,
      ...(hasEn
        ? { alternates: { languages: { "zh-CN": zhUrl, en: `${base}/en/vs/${slug}` } } }
        : {}),
    };
  });

  // 英文对标页
  const vsEn: MetadataRoute.Sitemap = INDEXABLE_VS_SLUGS_EN.map((slug) => ({
    url: `${base}/en/vs/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: { languages: { "zh-CN": `${base}/vs/${slug}`, en: `${base}/en/vs/${slug}` } },
  }));

  return [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { "zh-CN": base, en: `${base}/en` } },
    },
    {
      url: `${base}/en`,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: { "zh-CN": base, en: `${base}/en` } },
    },
    { url: `${base}/wuwei`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/nian`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/shot`, changeFrequency: "weekly", priority: 0.8 },
    ...vsZh,
    ...vsEn,
  ];
}
