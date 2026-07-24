// 无为币积分体系 · 服务端工具函数
// 封装配置读写、积分操作、日志记录，供 Server Action 调用

import { supabaseAdmin } from "./supabase";

// ============================================================
// 1. 运营配置读写
// ============================================================

export type ConfigCategory = "coin" | "pricing" | "model" | "promotion" | "general";

export interface OperationConfig {
  key: string;
  value: Record<string, unknown>;
  category: ConfigCategory;
  label: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

/** 读取所有运营配置 */
export async function getAllConfigs(): Promise<OperationConfig[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("operation_config")
    .select("*")
    .order("category", { ascending: true })
    .order("key", { ascending: true });

  if (error) throw new Error(`读取配置失败: ${error.message}`);
  return (data as OperationConfig[]) ?? [];
}

/** 按分类读取配置 */
export async function getConfigsByCategory(category: ConfigCategory): Promise<OperationConfig[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("operation_config")
    .select("*")
    .eq("category", category)
    .order("key", { ascending: true });

  if (error) throw new Error(`读取配置失败: ${error.message}`);
  return (data as OperationConfig[]) ?? [];
}

/** 读取单个配置 */
export async function getConfig(key: string): Promise<OperationConfig | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("operation_config")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(`读取配置失败: ${error.message}`);
  return (data as OperationConfig) ?? null;
}

/** 更新配置（自动记录操作日志） */
export async function updateConfig(
  key: string,
  value: Record<string, unknown>,
  adminEmail: string,
  ipHash?: string,
  userAgent?: string
): Promise<void> {
  const sb = supabaseAdmin();

  // 先读旧值
  const old = await getConfig(key);

  // 更新配置
  const { error } = await sb
    .from("operation_config")
    .update({
      value,
      updated_at: new Date().toISOString(),
      updated_by: adminEmail,
    })
    .eq("key", key);

  if (error) throw new Error(`更新配置失败: ${error.message}`);

  // 记录操作日志
  await logOperation({
    adminEmail,
    action: "update_config",
    targetTable: "operation_config",
    targetKey: key,
    oldValue: old?.value ?? null,
    newValue: value,
    ipHash,
    userAgent,
  });
}

// ============================================================
// 2. 积分操作
// ============================================================

export interface CoinTransaction {
  id: number;
  user_id: string;
  type: "earn" | "spend" | "adjust" | "expire" | "refund" | "gift";
  amount: number;
  balance_after: number;
  source: string;
  description: string | null;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface UserCoinBalance {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  last_signin: string | null;
  signin_streak: number;
  created_at: string;
  updated_at: string;
}

/** 查询用户积分余额 */
export async function getUserBalance(userId: string): Promise<UserCoinBalance | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("user_coin_balance")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(`查询余额失败: ${error.message}`);
  return (data as UserCoinBalance) ?? null;
}

/** 查询用户积分流水 */
export async function getUserTransactions(
  userId: string,
  limit = 50,
  offset = 0
): Promise<CoinTransaction[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("coin_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`查询流水失败: ${error.message}`);
  return (data as CoinTransaction[]) ?? [];
}

/** 手动调整用户积分（补偿、活动奖励） */
export async function adjustUserBalance(
  userId: string,
  amount: number, // 正=增加，负=减少
  reason: string,
  adminEmail: string,
  ipHash?: string,
  userAgent?: string
): Promise<number> {
  const sb = supabaseAdmin();

  // 先读当前余额
  const current = await getUserBalance(userId);
  const currentBalance = current?.balance ?? 0;
  const newBalance = currentBalance + amount;

  if (newBalance < 0) {
    throw new Error("积分余额不足，无法扣除");
  }

  // 更新余额表
  const { error: upsertError } = await sb
    .from("user_coin_balance")
    .upsert({
      user_id: userId,
      balance: newBalance,
      total_earned: current ? current.total_earned + Math.max(0, amount) : Math.max(0, amount),
      total_spent: current ? current.total_spent + Math.max(0, -amount) : Math.max(0, -amount),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (upsertError) throw new Error(`更新余额失败: ${upsertError.message}`);

  // 写流水
  const { error: txError } = await sb.from("coin_transactions").insert({
    user_id: userId,
    type: amount >= 0 ? "adjust" : "adjust",
    amount,
    balance_after: newBalance,
    source: "manual",
    description: reason,
    meta: { admin: adminEmail },
    created_at: new Date().toISOString(),
  });

  if (txError) throw new Error(`记录流水失败: ${txError.message}`);

  // 记录操作日志
  await logOperation({
    adminEmail,
    action: "adjust_balance",
    targetTable: "user_coin_balance",
    targetKey: userId,
    oldValue: current ? { balance: current.balance } : null,
    newValue: { balance: newBalance, reason },
    ipHash,
    userAgent,
  });

  return newBalance;
}

// ============================================================
// 3. 操作日志
// ============================================================

export interface OperationLog {
  id: number;
  admin_email: string;
  action: string;
  target_table: string | null;
  target_key: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

interface LogParams {
  adminEmail: string;
  action: string;
  targetTable?: string;
  targetKey?: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipHash?: string;
  userAgent?: string;
}

/** 记录操作日志 */
export async function logOperation(params: LogParams): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("operation_logs").insert({
    admin_email: params.adminEmail,
    action: params.action,
    target_table: params.targetTable ?? null,
    target_key: params.targetKey ?? null,
    old_value: params.oldValue ?? null,
    new_value: params.newValue ?? null,
    ip_hash: params.ipHash ?? null,
    user_agent: params.userAgent ?? null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    // 日志失败不打断主流程，但抛警告
    console.error("操作日志记录失败:", error.message);
  }
}

/** 查询操作日志 */
export async function getOperationLogs(
  limit = 100,
  offset = 0,
  adminEmail?: string
): Promise<OperationLog[]> {
  const sb = supabaseAdmin();
  let query = sb
    .from("operation_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (adminEmail) {
    query = query.eq("admin_email", adminEmail);
  }

  const { data, error } = await query;
  if (error) throw new Error(`查询日志失败: ${error.message}`);
  return (data as OperationLog[]) ?? [];
}

// ============================================================
// 4. 数据看板
// ============================================================

export interface DailyCoinStats {
  day: string;
  earn_count: number;
  earn_total: number;
  spend_count: number;
  spend_total: number;
  adjust_count: number;
  adjust_total: number;
}

export interface CoinBySource {
  source: string;
  tx_count: number;
  total_amount: number;
  avg_amount: number;
}

/** 每日积分统计 */
export async function getDailyCoinStats(days = 30): Promise<DailyCoinStats[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("v_coin_daily_stats")
    .select("*")
    .gte("day", new Date(Date.now() - days * 86400000).toISOString())
    .order("day", { ascending: false });

  if (error) throw new Error(`查询统计失败: ${error.message}`);
  return (data as DailyCoinStats[]) ?? [];
}

/** 按来源统计消耗 */
export async function getCoinBySource(): Promise<CoinBySource[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("v_coin_by_source")
    .select("*")
    .order("total_amount", { ascending: false });

  if (error) throw new Error(`查询统计失败: ${error.message}`);
  return (data as CoinBySource[]) ?? [];
}

/** 用户积分排行 */
export async function getUserCoinRank(limit = 100): Promise<UserCoinBalance[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("v_user_coin_rank")
    .select("*")
    .limit(limit);

  if (error) throw new Error(`查询排行失败: ${error.message}`);
  return (data as UserCoinBalance[]) ?? [];
}

// ============================================================
// 5. 定价配置（扩展 pricing_plans）
// ============================================================

import type { Plan, Region } from "./data";

/** 更新定价 */
export async function updatePricing(
  region: Region,
  planKey: string,
  updates: Partial<Plan>,
  adminEmail: string,
  ipHash?: string,
  userAgent?: string
): Promise<void> {
  const sb = supabaseAdmin();

  // 读旧值
  const { data: old } = await sb
    .from("pricing_plans")
    .select("*")
    .eq("region", region)
    .eq("plan_key", planKey)
    .maybeSingle();

  // 更新
  const { error } = await sb
    .from("pricing_plans")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("region", region)
    .eq("plan_key", planKey);

  if (error) throw new Error(`更新定价失败: ${error.message}`);

  // 记录日志
  await logOperation({
    adminEmail,
    action: "update_pricing",
    targetTable: "pricing_plans",
    targetKey: `${region}.${planKey}`,
    oldValue: old ?? null,
    newValue: updates as Record<string, unknown>,
    ipHash,
    userAgent,
  });
}

/** 读取所有定价 */
export async function getAllPricing(): Promise<Plan[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("pricing_plans")
    .select("*")
    .order("region", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`读取定价失败: ${error.message}`);
  return (data as Plan[]) ?? [];
}

// ============================================================
// 6. 设备级免费试用
// ============================================================

export interface DeviceFreeTrial {
  device_id: string;
  total_quota: number;
  remaining: number;
  created_at: string;
  updated_at: string;
}

/** 查询设备免费试用配额 */
export async function getDeviceTrial(deviceId: string): Promise<DeviceFreeTrial | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("device_free_trial")
    .select("*")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) throw new Error(`查询设备试用失败: ${error.message}`);
  return (data as DeviceFreeTrial) ?? null;
}

/** 创建或重置设备免费试用 */
export async function createDeviceTrial(deviceId: string, quota?: number): Promise<DeviceFreeTrial> {
  const sb = supabaseAdmin();

  // 读默认配额
  const { data: cfg } = await sb
    .from("operation_config")
    .select("value")
    .eq("key", "free_trial.quota")
    .maybeSingle();

  const defaultQuota = quota ?? (cfg?.value as { default_quota?: number })?.default_quota ?? 10;

  const { data, error } = await sb
    .from("device_free_trial")
    .upsert({
      device_id: deviceId,
      total_quota: defaultQuota,
      remaining: defaultQuota,
      updated_at: new Date().toISOString(),
    }, { onConflict: "device_id" })
    .select()
    .single();

  if (error) throw new Error(`创建设备试用失败: ${error.message}`);
  return data as DeviceFreeTrial;
}

/** 扣减设备免费试用次数（返回扣减后剩余） */
export async function consumeDeviceTrial(deviceId: string): Promise<{ success: boolean; remaining: number; total: number }> {
  const sb = supabaseAdmin();

  const trial = await getDeviceTrial(deviceId);
  if (!trial) {
    // 自动创建
    const created = await createDeviceTrial(deviceId);
    return { success: true, remaining: created.remaining - 1, total: created.total_quota };
  }

  if (trial.remaining <= 0) {
    return { success: false, remaining: 0, total: trial.total_quota };
  }

  const { data: updated, error } = await sb
    .from("device_free_trial")
    .update({
      remaining: trial.remaining - 1,
      updated_at: new Date().toISOString(),
    })
    .eq("device_id", deviceId)
    .eq("remaining", trial.remaining) // 乐观锁
    .select()
    .single();

  if (error || !updated) {
    // 乐观锁冲突，返回最新值
    const latest = await getDeviceTrial(deviceId);
    return { success: false, remaining: latest?.remaining ?? 0, total: latest?.total_quota ?? trial.total_quota };
  }

  return { success: true, remaining: updated.remaining, total: updated.total_quota };
}

// ============================================================
// 7. 按 token 扣积分
// ============================================================

export interface TokenPriceConfig {
  name: string;
  input_per_1k: number;
  output_per_1k: number;
  cost_per_msg?: number;
}

/** 读取模型 token 单价配置 */
export async function getModelTokenPrice(modelKey: string): Promise<TokenPriceConfig | null> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("operation_config")
    .select("value")
    .eq("key", `model_token_price.${modelKey}`)
    .maybeSingle();

  if (error || !data) return null;
  return (data.value as TokenPriceConfig) ?? null;
}

/** 计算 token 消耗积分（输入 + 输出分别计价） */
export function calculateTokenCost(
  price: TokenPriceConfig,
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (inputTokens / 1000) * price.input_per_1k;
  const outputCost = (outputTokens / 1000) * price.output_per_1k;
  return Math.ceil(inputCost + outputCost); // 积分取整（向上）
}

/** 按 token 扣用户积分 */
export async function spendCoinsByToken(
  userId: string,
  modelKey: string,
  inputTokens: number,
  outputTokens: number,
  description?: string
): Promise<{ success: boolean; cost: number; balanceAfter: number; message?: string }> {
  const sb = supabaseAdmin();

  // 1. 读模型单价
  const price = await getModelTokenPrice(modelKey);
  if (!price) {
    return { success: false, cost: 0, balanceAfter: 0, message: `未知模型: ${modelKey}` };
  }

  // 2. 计算消耗
  const cost = calculateTokenCost(price, inputTokens, outputTokens);

  // 3. 查余额
  const balance = await getUserBalance(userId);
  const currentBalance = balance?.balance ?? 0;

  if (currentBalance < cost) {
    return { success: false, cost, balanceAfter: currentBalance, message: "积分余额不足" };
  }

  // 4. 扣积分
  const newBalance = currentBalance - cost;
  const { error: upsertErr } = await sb
    .from("user_coin_balance")
    .upsert({
      user_id: userId,
      balance: newBalance,
      total_earned: balance?.total_earned ?? 0,
      total_spent: (balance?.total_spent ?? 0) + cost,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (upsertErr) {
    throw new Error(`扣减积分失败: ${upsertErr.message}`);
  }

  // 5. 写流水
  const { error: txErr } = await sb.from("coin_transactions").insert({
    user_id: userId,
    type: "spend",
    amount: -cost,
    balance_after: newBalance,
    source: "model_usage",
    description: description || `${modelKey} ${inputTokens}/${outputTokens} tokens`,
    meta: { model: modelKey, input_tokens: inputTokens, output_tokens: outputTokens, cost },
    created_at: new Date().toISOString(),
  });

  if (txErr) {
    console.error("记录流水失败:", txErr.message);
    // 流水失败不打断，但记日志
  }

  return { success: true, cost, balanceAfter: newBalance };
}
