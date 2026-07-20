// 三产品详情页共享骨架（服务端渲染）。内容来自 lib/products.ts（非机翻，源自品牌中心）。
// 结构：品牌壳(SiteHeader) + hero(可选 opening 引子 + 圆相 + h1 + sub + 主CTA + 次级链接)
//       + 5 卖点卡 + 收尾 + SiteFooter。VI token 全走 spark/water/bamboo，一点朱只给主 CTA。
// 2026-07-20 统一为深色主题（wu-land），与官网首页一致
import "../app/landing.css";
import { SiteFooter } from "./SiteFooter";
import { CircleMark, FeatureCard, TextLink } from "./ui";
import { CTAButton } from "./CTAButton";
import { Track } from "./Track";
import type { ProductContent } from "@/lib/products";
import type { Locale } from "@/lib/site";

export function ProductPage({
  content,
  locale,
  trackPath,
  downloadHref,
}: {
  content: ProductContent;
  locale: Locale;
  trackPath: string;
  downloadHref: string; // 主 CTA 去处（真实下载链接）
}) {
  const { hero, cta, secondary, features, closing } = content;

  // JSON-LD: SoftwareApplication 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: locale === "zh" ? (trackPath.includes("nian") ? "无为念" : trackPath.includes("shot") ? "无为截" : "无为") : (trackPath.includes("voice") ? "Wuwei Voice" : trackPath.includes("shot") ? "Wuwei Shot" : "Wuwei"),
    applicationCategory: trackPath.includes("nian") || trackPath.includes("voice") ? "UtilitiesApplication" : "ProductivityApplication",
    operatingSystem: "Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: content.meta.description,
    url: `https://wuweiai.io${trackPath}`,
    softwareVersion: "1.0.0",
    inLanguage: locale === "zh" ? "zh-CN" : "en",
  };

  return (
    <div className="wu-land">
      <Track path={trackPath} />

      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ——— 导航 ——— */}
      <nav className="nav"><div className="wrap">
        <a className="brand" href={locale === "en" ? "/en" : "/"}>
          <CircleMark size={32} />
          <span><span className="zh">{locale === "en" ? "Wuwei" : "无为"}</span> <span className="en">WUWEI</span></span>
        </a>
        <div className="nav-right">
          <div className="nav-links">
            <a href={locale === "en" ? "/en/voice" : "/voice"}>{locale === "en" ? "Voice" : "无为念"}</a>
            <a href={locale === "en" ? "/en/shot" : "/shot"}>{locale === "en" ? "Shot" : "无为截"}</a>
          </div>
          <a className="nav-cta" href={downloadHref}>{cta}</a>
        </div>
      </div></nav>

      <main>
        {/* ————— Hero ————— */}
        <section className="hero"><div className="wrap">
          {/* 引子（无为念/无为截 有故事式开场；无为本尊无） */}
          {hero.opening && hero.opening.length > 0 && (
            <div className="mb-10 space-y-2 text-mist leading-relaxed">
              {hero.opening.map((line, i) => (
                <p key={i} className={i === hero.opening!.length - 1 ? "text-l-paper font-medium" : ""}>
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-center mb-9"><CircleMark size={52} /></div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.12]">
            {hero.h1}
          </h1>
          <p className="mt-7 text-lg text-mist leading-relaxed max-w-2xl mx-auto">
            {hero.sub}
          </p>

          {/* 主 CTA —— 唯一朱赭实心按钮 */}
          <div className="mt-11 flex flex-col items-center gap-4">
            <CTAButton href={downloadHref} label={`${trackPath}#cta`} product={trackPath.includes("voice") || trackPath.includes("nian") ? "nian" : trackPath.includes("shot") ? "shot" : "wuwei"}>{cta}</CTAButton>
            {secondary && (
              <TextLink href={secondary.href}>{secondary.label}</TextLink>
            )}
          </div>
        </div></section>

        {/* ————— 5 卖点 ————— */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-line">
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} title={f.t} desc={f.d} />
            ))}
          </div>
        </section>

        {/* ————— 收尾 ————— */}
        <section className="max-w-2xl mx-auto px-6 py-20 border-t border-line text-center">
          <p className="text-lg text-mist leading-relaxed">{closing}</p>
          <div className="mt-9 flex justify-center">
            <CTAButton href={downloadHref} label={`${trackPath}#closing-cta`} product={trackPath.includes("voice") || trackPath.includes("nian") ? "nian" : trackPath.includes("shot") ? "shot" : "wuwei"}>{cta}</CTAButton>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
