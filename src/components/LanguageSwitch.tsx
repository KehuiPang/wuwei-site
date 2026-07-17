"use client";
// 中/EN 手动切换：写 cookie 记住选择（middleware 后续以 cookie 为准，尊重用户），再跳到对方语言页。
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LANG_COOKIE, type Locale } from "@/lib/site";

export function LanguageSwitch({ to, label }: { to: Locale; label: string }) {
  const router = useRouter();
  const onClick = useCallback(() => {
    // 1 年有效；SameSite=Lax 足够（无跨站需求）
    document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
    router.push(to === "en" ? "/en" : "/");
  }, [to, router]);

  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-sm rounded-lg border border-mist text-inkmute hover:text-water hover:border-water-light transition"
      aria-label="Switch language"
    >
      {label}
    </button>
  );
}
