import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

// SSR Supabase 客户端（读登录会话 cookie）。用 public anon key（RLS 兜底）。
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component 内不能写 cookie，忽略（token 刷新由后续 route/action 处理）
          }
        },
      },
    }
  );
}

export type AdminUser = { email: string; role: string };

// 后台守卫：返回当前管理员或 null。fail-closed —— 未登录 / 不在白名单 / 任何异常(含表不存在) 一律 null。
// 白名单校验用 service key 查 admin_users（服务端，绕 RLS）；按邮箱匹配。
export async function getAdmin(): Promise<AdminUser | null> {
  try {
    const sb = await supabaseServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user?.email) return null;

    const { data, error } = await supabaseAdmin()
      .from("admin_users")
      .select("email,role")
      .eq("email", user.email)
      .maybeSingle();

    if (error || !data) return null;
    return { email: data.email, role: data.role };
  } catch {
    return null;
  }
}
