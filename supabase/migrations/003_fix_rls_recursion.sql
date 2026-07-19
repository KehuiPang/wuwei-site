-- 修复 RLS 递归 + 余额表安全漏洞（2026-07-19）
-- 问题1：users 表 admin 策略 EXISTS(SELECT FROM users) 递归触发 RLS → 500
-- 问题2：coin_balances "System can update balances" USING(true) 允许任何人读写
-- 问题3：coin_transactions "System can create transactions" WITH CHECK(true) 允许任何人插入

-- 1) is_admin() 函数（SECURITY DEFINER 绕过 RLS 递归）
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2) users 表策略重建
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users for select USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" ON public.users for select USING (public.is_admin());
DROP POLICY IF EXISTS "Admins can update profiles" ON public.users;
CREATE POLICY "Admins can update profiles" ON public.users for update USING (public.is_admin());

-- 3) coin_balances — 删除漏洞策略，改为 admin only
DROP POLICY IF EXISTS "System can update balances" ON public.coin_balances;
DROP POLICY IF EXISTS "Admins can view all balances" ON public.coin_balances;
CREATE POLICY "Users can view own balance" ON public.coin_balances for select USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all balances" ON public.coin_balances for select USING (public.is_admin());
CREATE POLICY "Admins can update balances" ON public.coin_balances for all USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4) coin_transactions — 同样修复
DROP POLICY IF EXISTS "System can create transactions" ON public.coin_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.coin_transactions;
CREATE POLICY "Users can view own transactions" ON public.coin_transactions for select USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.coin_transactions for select USING (public.is_admin());
CREATE POLICY "Admins can create transactions" ON public.coin_transactions for insert WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update transactions" ON public.coin_transactions for update USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5) operation_configs 策略重建（用 is_admin）
DROP POLICY IF EXISTS "Only admins can modify configs" ON public.operation_configs;
CREATE POLICY "Anyone can view configs" ON public.operation_configs for select USING (true);
CREATE POLICY "Only admins can modify configs" ON public.operation_configs for all USING (public.is_admin()) WITH CHECK (public.is_admin());
