-- 无为官网 · P0 增量：后台白名单 + RLS 红线 + 看板视图加固 + Storage 桶
-- 目标库：Supabase 项目 wuwei (ref mayjabfxjzegovfmmony), PG 17.6
-- 依赖：先跑 schema.sql（建好 releases/pricing_plans/site_config/analytics_events/client_events + v_daily_stats）
-- 跑法：Session pooler(5432) 连接后执行；幂等，可重复跑。
-- 方案依据：ARCHITECTURE_PROPOSAL.md §3.1 / §3.2 / §3.5

-- ============ 1) 后台管理员白名单 ============
-- 只有这里的邮箱(auth.users)能进 /admin 并读写业务表（P2 后台生效）。
create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  role       text not null default 'admin' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

-- ============ 2) 开 RLS（默认拒绝，策略显式放行） ============
alter table releases         enable row level security;
alter table pricing_plans    enable row level security;
alter table site_config      enable row level security;
alter table analytics_events enable row level security;
alter table client_events    enable row level security;
alter table admin_users      enable row level security;

-- 辅助函数：判断当前登录用户是否白名单管理员。
-- security definer + 固定 search_path → 绕过 admin_users 自身 RLS，避免策略递归。
create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admin_users where id = auth.uid()) $$;

-- ============ 3) 前台匿名：只读"已发布/在售"行（红线：未发布包/草稿价不外泄） ============
drop policy if exists anon_read_published_releases on releases;
create policy anon_read_published_releases on releases
  for select to anon using (is_published = true);

drop policy if exists anon_read_active_pricing on pricing_plans;
create policy anon_read_active_pricing on pricing_plans
  for select to anon using (is_active = true);

drop policy if exists anon_read_site_config on site_config;
create policy anon_read_site_config on site_config
  for select to anon using (true);   -- 站点文案/开关本就对外，可全读

-- analytics_events / client_events：匿名【零策略】= 不可读、不可写。
--   写入一律经服务端 route handler 用 SUPABASE_SECRET_KEY(service_role 绕过 RLS)，
--   浏览器永远拿不到 service key，也伪造/读取不了他人埋点。
-- admin_users：匿名零策略 = 完全不可见。

-- ============ 4) 后台管理员（登录且在白名单）：可读写全部业务表 ============
-- P2 后台用 authenticated client 时按此放行；service key 始终绕过 RLS，不受影响。
drop policy if exists admin_all_releases on releases;
create policy admin_all_releases on releases
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_all_pricing on pricing_plans;
create policy admin_all_pricing on pricing_plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_all_site_config on site_config;
create policy admin_all_site_config on site_config
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_read_analytics on analytics_events;
create policy admin_read_analytics on analytics_events
  for select to authenticated using (public.is_admin());

drop policy if exists admin_read_client_events on client_events;
create policy admin_read_client_events on client_events
  for select to authenticated using (public.is_admin());

drop policy if exists admin_read_admin_users on admin_users;
create policy admin_read_admin_users on admin_users
  for select to authenticated using (public.is_admin());

-- ============ 5) 看板视图加固：随查询者 RLS 结算 ============
-- 默认视图以属主权限跑 → 会绕过底表 RLS。设 security_invoker 后，
-- 匿名查视图时因对 analytics_events 无策略 → 读到空；后台管理员正常聚合。
alter view v_daily_stats set (security_invoker = on);

-- ============ 6) Storage 桶：releases（MVP public，方案 §3.5） ============
-- public 桶：读公开；上传经 service key。二期若要精确防绕过再改 private + signed URL。
insert into storage.buckets (id, name, public)
values ('releases', 'releases', true)
on conflict (id) do update set public = excluded.public;
