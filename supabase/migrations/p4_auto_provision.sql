-- P4 · 新用户自动开户 + 注册礼包（无为币积分体系 · 客户端接入 P1）
-- 目标：任何人通过 Supabase Auth（Google/邮箱）首次注册，自动建 user_coin_balance 行
--       并发放注册礼包 100 无为币（写一条 gift 流水）。
-- 依赖：p3_coin_system.sql（user_coin_balance / coin_transactions 已建）。
-- 跑法：Session pooler(5432) 连接后执行；或 Supabase SQL Editor 粘贴。幂等，可重跑。

-- ============ 1. 触发器函数：新用户开户 + 注册礼包 ============
-- security definer：以函数属主权限执行，绕过 RLS 写入两张表（触发器上下文本就是服务端）。
create or replace function public.on_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 建余额行（幂等：已存在则不动）
  insert into public.user_coin_balance (user_id, balance, total_earned)
    values (new.id, 100, 100)
  on conflict (user_id) do nothing;

  -- 仅当本次确实新建了余额行时才发礼包流水（避免重复发放）
  if found then
    insert into public.coin_transactions
      (user_id, type, amount, balance_after, source, description)
    values
      (new.id, 'gift', 100, 100, 'register', '新用户注册礼包');
  end if;

  return new;
end;
$$;

-- ============ 2. 挂到 auth.users 的 after insert ============
drop trigger if exists trg_auth_user_created on auth.users;
create trigger trg_auth_user_created
  after insert on auth.users
  for each row execute function public.on_auth_user_created();

-- ============ 3. 回填：给已存在但没有余额行的老用户补开户 + 礼包 ============
-- （早期测试账号也拿到一致的初始 100 币；已有余额行的不动）
with new_rows as (
  insert into public.user_coin_balance (user_id, balance, total_earned)
  select u.id, 100, 100
  from auth.users u
  left join public.user_coin_balance b on b.user_id = u.id
  where b.user_id is null
  returning user_id
)
insert into public.coin_transactions
  (user_id, type, amount, balance_after, source, description)
select user_id, 'gift', 100, 100, 'register', '新用户注册礼包（回填）'
from new_rows;
