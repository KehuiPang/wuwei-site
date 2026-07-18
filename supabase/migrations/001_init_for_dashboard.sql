=== SQL 迁移脚本（请在 Supabase Dashboard SQL Editor 执行）===
-- 无为官网 v2 数据库初始化脚本
-- 执行顺序：1. 扩展 > 2. 表 > 3. RLS > 4. 初始数据

-- ============================================
-- 1. 扩展
-- ============================================
extension if not exists "uuid-ossp";

-- ============================================
-- 2. 表结构
-- ============================================

-- 用户表（扩展 Supabase auth.users）
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- 无为币余额表
create table if not exists public.coin_balances (
  user_id uuid references public.users on delete cascade primary key,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz default now()
);

-- 无为币交易记录表
create table if not exists public.coin_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  type text not null check (type in ('earn', 'spend', 'refund')),
  amount integer not null,
  description text not null default '',
  created_at timestamptz default now()
);

-- 运营配置表
create table if not exists public.operation_configs (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  value jsonb not null default '{}',
  description text not null default '',
  updated_at timestamptz default now(),
  updated_by uuid references public.users
);

-- ============================================
-- 3. 行级安全策略（RLS）
-- ============================================

-- 用户表 RLS
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.users for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can update profiles"
  on public.users for update
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- 无为币余额表 RLS
alter table public.coin_balances enable row level security;

create policy "Users can view own balance"
  on public.coin_balances for select
  using (auth.uid() = user_id);

create policy "Admins can view all balances"
  on public.coin_balances for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "System can update balances"
  on public.coin_balances for all
  using (true)
  with check (true);

-- 交易记录表 RLS
alter table public.coin_transactions enable row level security;

create policy "Users can view own transactions"
  on public.coin_transactions for select
  using (auth.uid() = user_id);

create policy "Admins can view all transactions"
  on public.coin_transactions for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "System can create transactions"
  on public.coin_transactions for insert
  with check (true);

-- 运营配置表 RLS
alter table public.operation_configs enable row level security;

create policy "Anyone can view configs"
  on public.operation_configs for select
  using (true);

create policy "Only admins can modify configs"
  on public.operation_configs for all
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ))
  with check (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- ============================================
-- 4. 初始数据
-- ============================================

insert into public.operation_configs (key, value, description)
values
  ('pricing', '{"monthly": 19, "yearly": 190, "currency": "USD"}'::jsonb, '定价配置'),
  ('model_costs', '{"gpt4": 10, "gpt3": 1, "claude": 8}'::jsonb, '模型消耗配置（无为币/千次）'),
  ('features', '{"voice_enabled": true, "beta_features": false}'::jsonb, '功能开关')
on conflict (key) do nothing;

-- ============================================
-- 5. 触发器：自动创建用户记录
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'user');
  insert into public.coin_balances (user_id, balance)
  values (new.id, 0);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

