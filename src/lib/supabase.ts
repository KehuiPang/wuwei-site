import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 前台只读（匿名 key）
export const supabasePublic = () =>
  createClient(url, anon, { auth: { persistSession: false } });

// 服务端写入（service key，只在 route handler / server 用，绝不下发浏览器）
export const supabaseAdmin = () =>
  createClient(url, service, { auth: { persistSession: false } });
