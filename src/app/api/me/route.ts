import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// 无为客户端「查我的账号 + 无为币余额」只读接口。
// 客户端带 Authorization: Bearer <supabase access_token>。
// 身份用 anon client + 用户 token 校验（RLS 生效，只能读自己）；
// 余额用 service key 读并惰性开户（触发器没跑也能兜底：首查即建行 + 发注册礼包 100）。

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** 确保用户有余额行；缺则建行 + 发注册礼包（幂等：仅真正新建时发礼包） */
async function ensureBalance(userId: string): Promise<number> {
  const sb = supabaseAdmin();
  const { data: existing } = await sb
    .from("user_coin_balance")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing) return existing.balance as number;

  // 建行（并发下靠 onConflict 兜底）
  const { data: inserted, error } = await sb
    .from("user_coin_balance")
    .upsert(
      { user_id: userId, balance: 100, total_earned: 100 },
      { onConflict: "user_id", ignoreDuplicates: true }
    )
    .select("balance");

  // 只有本次确实插入了新行才发礼包流水（避免并发/重复发放）
  if (inserted && inserted.length > 0) {
    await sb.from("coin_transactions").insert({
      user_id: userId,
      type: "gift",
      amount: 100,
      balance_after: 100,
      source: "register",
      description: "新用户注册礼包",
    });
    return 100;
  }
  if (error) {
    // 建行失败（极少）——再读一次，读到就用，读不到给 0 兜底
    const { data: again } = await sb
      .from("user_coin_balance")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();
    return (again?.balance as number) ?? 0;
  }
  // upsert 命中已存在行（ignoreDuplicates 不返回）→ 再读
  const { data: after } = await sb
    .from("user_coin_balance")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();
  return (after?.balance as number) ?? 0;
}

export async function GET(req: Request) {
  const token = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  if (!token) {
    return NextResponse.json({ error: "no_token" }, { status: 401 });
  }

  // 用匿名 key + 用户 token 校验身份（RLS 生效）
  const asUser = createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error,
  } = await asUser.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  let balance = 0;
  try {
    balance = await ensureBalance(user.id);
  } catch {
    balance = 0; // 余额读取异常不阻断登录，先给 0，前端可稍后刷新
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email ?? null,
      name:
        (user.user_metadata?.name as string) ??
        (user.user_metadata?.full_name as string) ??
        null,
      avatar: (user.user_metadata?.avatar_url as string) ?? null,
    },
    coin: { balance },
  });
}
