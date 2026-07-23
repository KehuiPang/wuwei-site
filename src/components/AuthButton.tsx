"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function AuthButton({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.refresh();
  }

  if (loading) {
    return (
      <span className="text-sm text-[#7A828A]">
        {locale === "zh" ? "…" : "…"}
      </span>
    );
  }

  // —— 未登录：显示「登录」 ——
  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm text-[#A8B0B8] hover:text-paper transition border border-[#2C343E] rounded-lg px-3 py-1.5 hover:border-[#35414d]"
      >
        {locale === "zh" ? "登录" : "Sign in"}
      </Link>
    );
  }

  // —— 已登录：头像 + hover 下拉菜单 ——
  const email = user.email ?? "";
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    email.split("@")[0] ||
    "User";
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initial = (displayName[0] || email[0] || "U").toUpperCase();
  const credits = "—"; // 积分占位，积分系统建成后接真实数据

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        onMouseEnter={() => setMenuOpen(true)}
        className="flex items-center gap-2 rounded-full transition hover:ring-2 hover:ring-[#35414d] focus:outline-none"
        aria-label={locale === "zh" ? "用户菜单" : "User menu"}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border border-[#2C343E]"
          />
        ) : (
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-paper bg-[#274A63] border border-[#2C343E]">
            {initial}
          </span>
        )}
      </button>

      {menuOpen && (
        <div
          onMouseLeave={() => setMenuOpen(false)}
          className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-[#2C343E] bg-[#1A1F26] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] py-2 z-50"
        >
          {/* 用户名 + 邮箱 */}
          <div className="px-4 py-2 border-b border-[#2C343E]">
            <div className="text-sm font-medium text-paper truncate" title={displayName}>
              {displayName}
            </div>
            <div className="text-xs text-[#7A828A] truncate" title={email}>
              {email}
            </div>
          </div>

          {/* 积分占位 */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-[#2C343E]">
            <span className="text-sm text-[#A8B0B8]">
              {locale === "zh" ? "无为币" : "Credits"}
            </span>
            <span className="text-sm text-[#7A828A]">{credits}</span>
          </div>

          {/* 账号设置（占位） */}
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push("/login");
            }}
            className="w-full text-left px-4 py-2 text-sm text-[#A8B0B8] hover:text-paper hover:bg-[#232830] transition"
          >
            {locale === "zh" ? "账号设置" : "Account"}
          </button>

          {/* 退出登录 */}
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-[#A8B0B8] hover:text-spark hover:bg-[#232830] transition border-t border-[#2C343E]"
          >
            {locale === "zh" ? "退出登录" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
