import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// 客户端上报端点（需求③，方案 §6）：无为客户端登录/启动/安装时上报。
// 隐私红线：只收匿名 anon_id + 版本 + 平台，绝不收个人数据（无 email/name/IP 明文）。
// 写 client_events；同时补一条 analytics_events(client_login) 便于看板统一口径。

const EVENTS = new Set(["login", "heartbeat", "install"]);

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}));
    const event = String(b.event || "login");
    if (!EVENTS.has(event)) {
      return NextResponse.json({ ok: false, error: "bad event" }, { status: 400 });
    }
    const anon_id = b.anon_id ? String(b.anon_id).slice(0, 64) : null;
    const version = b.version ? String(b.version).slice(0, 40) : null;
    const platform = b.platform ? String(b.platform).slice(0, 20) : null;

    const sb = supabaseAdmin();
    await sb.from("client_events").insert({ anon_id, event, version, platform, meta: {} });

    // 登录事件并入 analytics_events，看板「客户端登录」口径统一
    if (event === "login") {
      await sb
        .from("analytics_events")
        .insert({ event_type: "client_login", platform, anon_id, meta: { version } })
        .then(() => {}, () => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
