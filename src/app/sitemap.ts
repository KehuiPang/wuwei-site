import type { MetadataRoute } from "next";
import { INDEXABLE_VS_SLUGS } from "@/lib/vs";

// 全前台页 + 多语言 alternates（/ 与 /en 互标 hreflang）。/admin、/api 不入（robots 屏蔽）。
// /vs 对标落地页只收录未被 noindex 门禁的（wuwei-vs-claude-code 待 CEO 终检，排除）。
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wuweiai.io";
  const vs: MetadataRoute.Sitemap = INDEXABLE_VS_SLUGS.map((slug) => ({
    url: `${base}/vs/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
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
    ...vs,
  ];
}
