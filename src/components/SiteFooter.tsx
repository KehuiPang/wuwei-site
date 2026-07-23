// 站点页脚（服务端渲染）。中英各一套。
import Link from "next/link";
import { PRODUCTS, uiText, type Locale } from "@/lib/site";
import { CircleMark } from "./ui";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = uiText(locale);
  const homeHref = locale === "en" ? "/en" : "/";
  // 英文站产品页路由映射
  const productHref = (key: string) => {
    if (locale === "en") {
      if (key === "nian") return "/en/voice";
      if (key === "shot") return "/en/shot";
      return "/en";
    }
    return PRODUCTS.find((p) => p.key === key)?.href ?? "/";
  };
  return (
    <footer className="border-t border-mist py-12 mt-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-8">
        <div>
          <Link href={homeHref} className="flex items-center gap-2 font-semibold text-ink">
            <CircleMark size={26} />
            <span>{locale === "en" ? "Wuwei" : "无为"}</span>
          </Link>
          <p className="mt-3 text-sm text-inkmute">{t.footerTagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-inkmute">
          {PRODUCTS.map((p) => (
            <Link key={p.key} href={productHref(p.key)} className="hover:text-water transition">
              {p.name[locale as "zh" | "en"] ?? p.name.en}
            </Link>
          ))}
        </nav>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 text-xs text-mute">{t.footerRights}</div>
    </footer>
  );
}
