// 展示型基础组件（服务端可渲染）：圆相 logo / 区块 / 徽章 / 卖点卡。
// 颜色一律走 VI token（spark=一点朱 ≤10%、water=靛青、bamboo=竹青），不散写色值。
import Link from "next/link";

export function CircleMark({ size = 40 }: { size?: number }) {
  // 圆相 + 缺口一点朱 —— 品牌主标意象（"一念之门·圆相"）
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="18" stroke="#16191E" strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray="102 8" transform="rotate(-90 24 24)" />
      <circle cx="24" cy="10.5" r="3" fill="#C05F3C" />
    </svg>
  );
}

// 卖点卡：标题 + 说明。留白、克制。
export function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-mist">
      <h3 className="font-semibold text-water">{title}</h3>
      <p className="mt-2 text-sm text-inkmute leading-relaxed">{desc}</p>
    </div>
  );
}

// 朱色徽章（招牌词行）。一点朱只做点缀。
export function SparkBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full text-sm font-medium text-spark bg-spark/10 border border-spark/20">
      {children}
    </span>
  );
}

// 次级文字链接（靛青）
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-water hover:text-water-light underline underline-offset-4 transition">
      {children}
    </Link>
  );
}
