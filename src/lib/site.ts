// 站点级常量：语言、导航、页脚、产品注册表。全站单一真源，页面/组件只引这里。
export const SITE_URL = "https://wuweiai.io";

// 支持的全部语言（14 种）。zh/en 有完整内容，其余语言本期先跳英文兜底。
export type Locale =
  | "zh" | "en" | "ja" | "ko" | "de" | "fr" | "it" | "es" | "pt"
  | "hi" | "ar" | "bn" | "id" | "zh-TW";

// 有实际内容路由的语言
export const ACTIVE_LOCALES: Locale[] = ["zh", "en"];

// 全部语言列表（切换器下拉用）
export type LangEntry = {
  code: Locale;
  nativeName: string; // 原生名
  hreflang: string;   // SEO hreflang
};

export const LANGUAGES: LangEntry[] = [
  { code: "en",    nativeName: "English",          hreflang: "en" },
  { code: "zh",    nativeName: "简体中文",          hreflang: "zh-CN" },
  { code: "zh-TW", nativeName: "繁體中文",          hreflang: "zh-TW" },
  { code: "ja",    nativeName: "日本語",            hreflang: "ja" },
  { code: "ko",    nativeName: "한국어",            hreflang: "ko" },
  { code: "de",    nativeName: "Deutsch",          hreflang: "de" },
  { code: "fr",    nativeName: "Français",         hreflang: "fr" },
  { code: "it",    nativeName: "Italiano",         hreflang: "it" },
  { code: "es",    nativeName: "Español",          hreflang: "es" },
  { code: "pt",    nativeName: "Português",        hreflang: "pt" },
  { code: "hi",    nativeName: "हिन्दी",             hreflang: "hi" },
  { code: "ar",    nativeName: "العربية",           hreflang: "ar" },
  { code: "bn",    nativeName: "বাংলা",             hreflang: "bn" },
  { code: "id",    nativeName: "Bahasa Indonesia", hreflang: "id" },
];

// 产品注册表：首页聚合卡 + 顶部导航 + 产品详情页共用。
// name/tagline 目前只有 zh/en 内容，用 Partial 兼容扩展后的 Locale。
export type Product = {
  key: "wuwei" | "nian" | "shot";
  href: string; // 中文产品页路由
  name: Partial<Record<Locale, string>> & { zh: string; en: string };
  tagline: Partial<Record<Locale, string>> & { zh: string; en: string };
};

export const PRODUCTS: Product[] = [
  {
    key: "wuwei",
    href: "/wuwei",
    name: { zh: "无为", en: "Wuwei" },
    tagline: {
      zh: "一念既出，万事自成 —— 替你把事做成的 AI Agent",
      en: "One intention. Everything done. — an AI agent that gets it done",
    },
  },
  {
    key: "nian",
    href: "/nian",
    name: { zh: "无为念", en: "Wuwei Voice" },
    tagline: {
      zh: "让表达，追上思考 —— AI 时代的语音输入",
      en: "Let your words keep up with your mind — voice input for the AI era",
    },
  },
  {
    key: "shot",
    href: "/shot",
    name: { zh: "无为截", en: "Wuwei Shot" },
    tagline: {
      zh: "截图，会思考了 —— 框住屏幕，AI 直接读懂",
      en: "Screenshots that think — frame it, and AI reads it",
    },
  },
];

// 导航 / 页脚文案（zh/en 有完整内容，其余语言本期 fallback 到 en）
type UIText = {
  nav: { products: string; pricing: string; compare: string; download: string };
  footerTagline: string;
  footerRights: string;
  footerNav: { home: string; wuwei: string; nian: string; shot: string };
};

export const UI_TEXT: Record<"zh" | "en", UIText> = {
  zh: {
    nav: { products: "产品", pricing: "定价", compare: "对比", download: "免费下载" },
    footerTagline: "一念既出，万事自成",
    footerRights: "© 2026 无为 Wuwei · wuweiai.io",
    footerNav: { home: "首页", wuwei: "无为", nian: "无为念", shot: "无为截" },
  },
  en: {
    nav: { products: "Products", pricing: "Pricing", compare: "Compare", download: "Download Free" },
    footerTagline: "One intention. Everything done.",
    footerRights: "© 2026 Wuwei · wuweiai.io",
    footerNav: { home: "Home", wuwei: "Wuwei", nian: "Wuwei Voice", shot: "Wuwei Shot" },
  },
};

// 取 UI 文案：非 zh 一律 fallback 到 en
export function uiText(locale: Locale): UIText {
  return locale === "zh" ? UI_TEXT.zh : UI_TEXT.en;
}

// 语言切换 cookie 名（middleware 与切换组件共用）
export const LANG_COOKIE = "wuwei_lang";
