"use client";
import { useEffect } from "react";

// 轻量 PV 埋点：持久匿名 ID(算 UV) + beacon 打 /api/track
function anonId(): string {
  try {
    let id = localStorage.getItem("wuwei_aid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("wuwei_aid", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function Track({ path }: { path: string }) {
  useEffect(() => {
    const body = JSON.stringify({
      event_type: "pageview",
      path,
      anon_id: anonId(),
      referer: document.referrer || null,
      lang: document.documentElement.lang || null,
    });
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (!navigator.sendBeacon("/api/track", blob)) {
        fetch("/api/track", { method: "POST", body, keepalive: true });
      }
    } catch {
      /* 埋点失败不影响体验 */
    }
  }, [path]);
  return null;
}
