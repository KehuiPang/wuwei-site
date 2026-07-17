// 三产品详情页共享骨架（服务端渲染）。内容来自 lib/products.ts（非机翻，源自品牌中心）。
// 结构：品牌壳(SiteHeader) + hero(可选 opening 引子 + 圆相 + h1 + sub + 主CTA + 次级链接)
//       + 5 卖点卡 + 收尾 + SiteFooter。VI token 全走 spark/water/bamboo，一点朱只给主 CTA。
import { SiteHeader } from "./SiteHeader";
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
  downloadHref: string; // 主 CTA 去处（默认回首页下载区）
}) {
  const { hero, cta, secondary, features, closing } = content;
  return (
    <>
      <SiteHeader locale={locale} />
      <Track path={trackPath} />

      <main className="flex-1">
        {/* ————— Hero ————— */}
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center rise">
          {/* 引子（无为念/无为截 有故事式开场；无为本尊无） */}
          {hero.opening && hero.opening.length > 0 && (
            <div className="mb-10 space-y-2 text-inkmute leading-relaxed">
              {hero.opening.map((line, i) => (
                <p key={i} className={i === hero.opening!.length - 1 ? "text-ink font-medium" : ""}>
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-center mb-9"><CircleMark size={52} /></div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.12]">
            {hero.h1}
          </h1>
          <p className="mt-7 text-lg text-inkmute leading-relaxed max-w-2xl mx-auto">
            {hero.sub}
          </p>

          {/* 主 CTA —— 唯一朱赭实心按钮 */}
          <div className="mt-11 flex flex-col items-center gap-4">
            <CTAButton href={downloadHref} label={`${trackPath}#cta`}>{cta}</CTAButton>
            {secondary && (
              <TextLink href={secondary.href}>{secondary.label}</TextLink>
            )}
          </div>
        </section>

        {/* ————— 5 卖点 ————— */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-mist">
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} title={f.t} desc={f.d} />
            ))}
          </div>
        </section>

        {/* ————— 收尾 ————— */}
        <section className="max-w-2xl mx-auto px-6 py-20 border-t border-mist text-center">
          <p className="text-lg text-inkmute leading-relaxed">{closing}</p>
          <div className="mt-9 flex justify-center">
            <CTAButton href={downloadHref} label={`${trackPath}#closing-cta`}>{cta}</CTAButton>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
