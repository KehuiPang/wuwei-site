"use client";
import { createBrowserClient } from "@supabase/ssr";

// 浏览器端 Supabase 客户端（仅登录/登出用）。anon key 属公开、进 bundle 合规。
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
