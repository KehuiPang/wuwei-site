"use client";
// 🌐 地球图标 + 下拉多语言菜单（深色落地页版）。
// 参考 Raphael AI 样式：竖排语言列表、原生名、当前语言高亮、可滚动。
// 写 cookie 记住选择；zh→/，en→/en，其余语言本期先跳 /en 兜底。
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LANG_COOKIE, LANGUAGES, ACTIVE_LOCALES, type Locale } from "@/lib/site";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function LandLangSwitch({ current }: { current: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const go = useCallback(
    (to: Locale) => {
      setOpen(false);
      if (to === current) return;
      document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
      if (to === "zh") {
        router.push("/");
      } else {
        router.push("/en");
      }
    },
    [current, router],
  );

  const currentLang = LANGUAGES.find((l) => l.code === current);

  return (
    <div ref={ref} className="land-lang-wrap">
      <button
        onClick={() => setOpen(!open)}
        className="land-lang-btn"
        aria-label="选择语言 / Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <GlobeIcon className="land-lang-globe" />
        <span className="land-lang-current">{currentLang?.nativeName ?? "EN"}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`land-lang-chevron ${open ? "open" : ""}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="land-lang-menu" role="listbox" aria-label="语言列表">
          {LANGUAGES.map((lang) => {
            const active = lang.code === current;
            const available = ACTIVE_LOCALES.includes(lang.code);
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={active}
                onClick={() => go(lang.code)}
                className={`land-lang-item ${active ? "on" : ""} ${!available ? "dim" : ""}`}
              >
                <span>{lang.nativeName}</span>
                {active && <CheckIcon className="land-lang-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
