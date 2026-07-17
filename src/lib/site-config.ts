import { supabasePublic } from "./supabase";
import { supabaseAdmin } from "./supabase";

export type Theme = "dark" | "light";

// 读站点主题（site_config key='theme'）。匿名可读（RLS 允许）。缺省 = dark（董事长原设计深色）。
// 前台各页 ISR(revalidate 60s)，改后台后 60s 内整站生效。
export async function getSiteTheme(): Promise<Theme> {
  try {
    const sb = supabasePublic();
    const { data } = await sb
      .from("site_config")
      .select("value")
      .eq("key", "theme")
      .maybeSingle();
    const v = (data?.value as unknown) ?? null;
    const t = typeof v === "string" ? v : (v && typeof v === "object" && "theme" in (v as object) ? (v as { theme?: string }).theme : null);
    return t === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

// 写站点主题（后台用，service key，服务端专用，绝不下发浏览器）。value 存纯字符串 jsonb。
export async function setSiteTheme(theme: Theme): Promise<void> {
  const sb = supabaseAdmin();
  await sb
    .from("site_config")
    .upsert({ key: "theme", value: theme, updated_at: new Date().toISOString() }, { onConflict: "key" });
}
