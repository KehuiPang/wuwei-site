import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VS_PAGES, type VsBlock } from "@/lib/vs";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CircleMark } from "@/components/ui";
import { CTAButton } from "@/components/CTAButton";
import { Track } from "@/components/Track";

export const revalidate = 3600; // 对标文案属常青内容，1h ISR 足够

export function generateStaticParams() {
  return Object.keys(VS_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = VS_PAGES[slug];
  if (!p) return {};
  const url = `https://wuweiai.io/vs/${slug}`;
  return {
    title: p.meta.title,
    description: p.meta.description,
    alternates: { canonical: url },
    // 门禁页（wuwei-vs-claude-code）待 CEO 终检前不被索引
    robots: p.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: p.meta.title, description: p.meta.description, url },
  };
}

// 产品的 JSON-LD 名称（利于 SoftwareApplication 富摘要）
function productName(product: "wuwei" | "nian", locale: "zh" | "en") {
  if (product === "nian") return locale === "en" ? "Wuwei Voice" : "无为念";
  return locale === "en" ? "Wuwei" : "无为";
}

function Block({ b }: { b: VsBlock }) {
  if (b.kind === "prose") {
    return <p className="text-lg text-inkmute leading-relaxed">{b.text}</p>;
  }
  if (b.kind === "points") {
    return (
      <div>
        {b.h && <h2 className="text-xl font-semibold text-ink mb-6">{b.h}</h2>}
        <div className="grid sm:grid-cols-2 gap-5">
          {b.items.map((it, i) => (
            <div key={i} className="p-6 rounded-2xl bg-surface border border-mist">
              <h3 className="font-semibold text-water">{it.t}</h3>
              <p className="mt-2 text-sm text-inkmute leading-relaxed">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (b.kind === "facts") {
    return (
      <div>
        {b.h && <h2 className="text-xl font-semibold text-ink mb-5">{b.h}</h2>}
        <ul className="space-y-4">
          {b.items.map((it, i) => (
            <li key={i} className="p-5 rounded-xl bg-surface border border-mist">
              <p className="text-sm text-ink leading-relaxed">{it.text}</p>
              <a
                href={it.source}
                target="_blank"
                rel="noopener nofollow"
                className="mt-2 inline-block text-xs text-water underline underline-offset-4 break-all"
              >
                来源：{it.source}
              </a>
            </li>
          ))}
        </ul>
        {b.note && <p className="mt-5 text-sm text-inkmute italic">{b.note}</p>}
      </div>
    );
  }
  // table
  return (
    <div>
      {b.h && <h2 className="text-xl font-semibold text-ink mb-6">{b.h}</h2>}
      <div className="overflow-x-auto rounded-2xl border border-mist">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-soft">
              {b.headers.map((h, i) => (
                <th key={i} className={"px-4 py-3 text-left font-semibold " + (i === 1 ? "text-spark" : "text-ink")}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r, ri) => (
              <tr key={ri} className="border-t border-mist">
                {r.map((cell, ci) => (
                  <td key={ci} className={"px-4 py-3 align-top " + (ci === 0 ? "font-medium text-ink" : ci === 1 ? "text-water" : "text-inkmute")}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.note && <p className="mt-4 text-sm text-inkmute">{b.note}</p>}
    </div>
  );
}

export default async function VsLanding({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = VS_PAGES[slug];
  if (!p) notFound();

  // JSON-LD：SoftwareApplication（免费产品）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: productName(p.product, p.locale),
    applicationCategory: p.product === "nian" ? "UtilitiesApplication" : "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `https://wuweiai.io/vs/${slug}`,
    publisher: { "@type": "Organization", name: "Wuwei", url: "https://wuweiai.io" },
  };

  return (
    <>
      <SiteHeader locale={p.locale} />
      <Track path={`/vs/${slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center rise">
          <div className="flex justify-center mb-8"><CircleMark size={48} /></div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.15]">{p.h1}</h1>
          <p className="mt-6 text-base text-inkmute leading-relaxed max-w-2xl mx-auto">{p.subhead}</p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <CTAButton href={p.cta.href} label={`/vs/${slug}#hero-cta`}>{p.cta.text}</CTAButton>
            {p.secondary && p.secondary.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center">
                {p.secondary.map((s, i) => (
                  <Link key={i} href={s.href} className="text-sm text-water hover:text-water-light underline underline-offset-4">
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Blocks */}
        <div className="max-w-3xl mx-auto px-6 pb-8 space-y-14">
          {p.blocks.map((b, i) => (
            <section key={i} className="border-t border-mist pt-12">
              <Block b={b} />
            </section>
          ))}
        </div>

        {/* 收尾 CTA */}
        <section className="max-w-2xl mx-auto px-6 py-16 border-t border-mist text-center">
          <div className="flex justify-center mb-6"><CircleMark size={32} /></div>
          <CTAButton href={p.cta.href} label={`/vs/${slug}#closing-cta`}>{p.cta.text}</CTAButton>
        </section>
      </main>

      <SiteFooter locale={p.locale} />
    </>
  );
}
