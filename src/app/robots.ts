import type { MetadataRoute } from "next";

// 放行前台，屏蔽后台 /admin 与 API /api（不进搜索引擎）。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: "https://wuweiai.io/sitemap.xml",
  };
}
