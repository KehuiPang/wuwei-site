// 站点顶部导航（服务端渲染）。中英各一套文案；产品下拉用简单横排链接。
import Link from "next/link";
import { PRODUCTS, UI_TEXT, type Locale } from "@/lib/site";
import { CircleMark } from "./ui";
import { LanguageSwitch } from "./LanguageSwitch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = UI_TEXT[locale];
  const homeHref = locale === "en" ? "/en" : "/";
  // 英文站产品页暂用锚点/中文页兜底：英文详情页二期补，先指向中文详情或首页锚点
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-paper/80 border-b border-mist">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2 font-semibold text-ink">
          <CircleMark size={28} />
          <span>{locale === "en" ? "Wuwei" : "无为"}</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <div className="hidden sm:flex items-center gap-4 text-inkmute">
            {PRODUCTS.map((p) => (
              <Link key={p.key} href={p.href} className="hover:text-water transition">
                {p.name[locale]}
              </Link>
            ))}
            <Link href={`${homeHref}#pricing`} className="hover:text-water transition">
              {t.nav.pricing}
            </Link>
          </div>
          <LanguageSwitch to={t.langSwitchTo} label={t.langSwitch} />
          <a
            href="/api/download?platform=windows"
            className="hidden sm:inline-flex px-4 py-1.5 rounded-lg bg-spark text-paper font-medium hover:bg-spark-hover transition"
          >
            {t.nav.download}
          </a>
        </div>
      </nav>
    </header>
  );
}
