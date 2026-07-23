"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

// 桌面客户端登录中转页。
// 客户端把浏览器开到 /auth/desktop?port=PORT&state=STATE。
// 已登录 → 把 supabase session 经 URL fragment(#) 回传到 http://127.0.0.1:PORT/cb（不进 query/日志）。
// 未登录 → 先跳 /login?next=本页，登完自动回来。
export default function DesktopRelayPage() {
  const [msg, setMsg] = useState("正在登录无为客户端…");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const port = p.get("port");
    const state = p.get("state") ?? "";
    // 端口白名单校验：只接受本机回环端口，防被诱导把 token 送到任意地址
    if (!port || !/^\d{1,5}$/.test(port)) {
      setMsg("参数缺失或非法，请从无为客户端重新发起登录。");
      return;
    }

    (async () => {
      const sb = supabaseBrowser();
      const {
        data: { session },
      } = await sb.auth.getSession();

      if (!session) {
        // 未登录：跳登录页，登完回到本页（带原 port/state）
        const self = window.location.pathname + window.location.search;
        window.location.href = `/login?next=${encodeURIComponent(self)}`;
        return;
      }

      // token 走 fragment，不进 query、不进服务器日志
      const frag = new URLSearchParams({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: String(session.expires_at ?? ""),
        state,
      }).toString();
      window.location.href = `http://127.0.0.1:${port}/cb#${frag}`;
      setOk(true);
      setMsg("登录成功，请回到无为客户端。本页可关闭。");
    })();
  }, []);

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 text-paper">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-hidden>
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="#F4F6F8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="102 8"
              transform="rotate(-90 24 24)"
            />
            <circle cx="24" cy="10.5" r="3" fill="#C05F3C" />
          </svg>
          <span className="text-xl font-semibold tracking-wider">无为</span>
        </div>
        <div className="bg-[#1A1F26] border border-[#2C343E] rounded-2xl p-8 shadow-2xl">
          <div className="text-3xl">{ok ? "✅" : "⏳"}</div>
          <p className="mt-3 text-sm text-[#A8B0B8] leading-relaxed">{msg}</p>
        </div>
      </div>
    </div>
  );
}
