// 站点级常量：语言、导航、页脚、产品注册表。全站单一真源，页面/组件只引这里。
export const SITE_URL = "https://wuweiai.io";

export type Locale = "zh" | "en";

// 产品注册表：首页聚合卡 + 顶部导航 + 产品详情页共用。
export type Product = {
  key: "wuwei" | "nian" | "shot";
  href: string; // 中文产品页路由
  name: Record<Locale, string>;
  tagline: Record<Locale, string>; // 一句话卖点（首页卡/导航副标）
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

// 导航 / 页脚文案（中英）
export const UI_TEXT = {
  zh: {
    nav: { products: "产品", pricing: "定价", compare: "对比", download: "免费下载" },
    langSwitch: "EN",
    langSwitchTo: "en" as Locale,
    footerTagline: "一念既出，万事自成",
    footerRights: "© 2026 无为 Wuwei · wuweiai.io",
    footerNav: { home: "首页", wuwei: "无为", nian: "无为念", shot: "无为截" },
  },
  en: {
    nav: { products: "Products", pricing: "Pricing", compare: "Compare", download: "Download Free" },
    langSwitch: "中",
    langSwitchTo: "zh" as Locale,
    footerTagline: "One intention. Everything done.",
    footerRights: "© 2026 Wuwei · wuweiai.io",
    footerNav: { home: "Home", wuwei: "Wuwei", nian: "Wuwei Voice", shot: "Wuwei Shot" },
  },
} as const;

// 语言切换 cookie 名（middleware 与切换组件共用）
export const LANG_COOKIE = "wuwei_lang";
