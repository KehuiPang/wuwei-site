-- P2 · 后台管理员白名单（方案 §3.1/§3.2）
-- 只有此表内的邮箱能进 /admin。RLS 开启且不设 anon 策略 = 仅服务端 service key 可读写。
-- 应用：经 Session pooler 跑本文件；然后为管理员在 Supabase Auth 建账号，并把其邮箱 insert 进本表。

create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  role       text not null default 'admin' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

-- 允许「先按邮箱登记、登录后再回填 id」的运维姿势：放开 id 可空的登记表？
-- 不——保持 id 主键约束以对齐 auth.users；运维时用下方 upsert-by-email 语句登记。
alter table admin_users enable row level security;
-- 不建任何 policy：anon/authenticated 一律拒绝，只有 service_role(服务端) 能读写。

-- —— 登记管理员（示例，CEO 按真实邮箱执行）——
-- 先在 Supabase Auth 建好账号拿到 uuid，再：
--   insert into admin_users (id, email, role) values ('<auth-uuid>', '<email>', 'admin')
--   on conflict (email) do update set role = excluded.role;
