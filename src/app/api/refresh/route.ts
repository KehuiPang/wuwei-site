import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// 无为客户端 token 静默续期：客户端 access_token 过期时，带 refresh_token 换新会话。
// 让客户端只跟官网通信、无需持有任何 Supabase key。
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}) as { refresh_token?: string });
  const refreshToken = body.refresh_token;
  if (!refreshToken) {
    return NextResponse.json({ error: "no_refresh_token" }, { status: 400 });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) {
    return NextResponse.json({ error: "refresh_failed" }, { status: 401 });
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at ?? null,
  });
}
