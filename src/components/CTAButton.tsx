"use client";
// 主 CTA（朱色，唯一关键动作）。点击先打一条 cta_click 埋点再跳转，不阻塞导航。
import { useCallback } from "react";

export function CTAButton({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label?: string; // 埋点标识（哪个页面的 CTA）
}) {
  const onClick = useCallback(() => {
    try {
      const body = JSON.stringify({ event_type: "cta_click", path: label ?? href });
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon?.("/api/track", blob);
    } catch {
      /* 埋点失败不影响跳转 */
    }
  }, [href, label]);

  return (
    <a
      href={href}
      onClick={onClick}
      className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-spark text-paper
        font-medium shadow-sm hover:bg-spark-hover hover:-translate-y-0.5 transition"
    >
      {children}
    </a>
  );
}
