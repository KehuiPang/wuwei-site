"use client";
// 深色落地页的中/EN 切换：写 cookie 记住选择，再跳到对方语言首页。
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LANG_COOKIE, type Locale } from "@/lib/site";

export function LandLangSwitch({ to, label }: { to: Locale; label: string }) {
  const router = useRouter();
  const onClick = useCallback(() => {
    document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
    router.push(to === "en" ? "/en" : "/");
  }, [to, router]);
  return (
    <button className="lang-switch" onClick={onClick} aria-label="Switch language">
      {label}
    </button>
  );
}
