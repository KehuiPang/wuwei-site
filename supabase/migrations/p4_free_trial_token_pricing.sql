-- P4 · 设备级免费试用 + 模型按 token 计价配置升级
-- 目标：未登录用户也能免费试用 N 次，用完提示登录；模型计费从按条改为按 token

-- ============ 1. 设备免费试用表 ============
create table if not exists device_free_trial (
  device_id    text primary key,                        -- 设备指纹/匿名 ID
  total_quota  integer not null default 10,            -- 总配额（后台可配默认值）
  remaining    integer not null default 10,            -- 剩余次数
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 设备试用：匿名可读写（通过 device_id 匹配）
alter table device_free_trial enable row level security;

-- 匿名通过 device_id 查自己的配额（客户端传 device_id）
create policy if not exists "anon_device_trial_select"
  on device_free_trial for select to anon using (true);

-- 匿名通过 device_id 更新自己的配额（扣减剩余次数）
create policy if not exists "anon_device_trial_update"
  on device_free_trial for update to anon using (true) with check (true);

-- 匿名可插入新设备记录
create policy if not exists "anon_device_trial_insert"
  on device_free_trial for insert to anon with check (true);

-- ============ 2. 升级模型配置：按 token 计价（兼容现有字段） ============
-- 现有 model_cost.* 配置保留 cost_per_msg（按条），新增 token 单价字段
-- 优先使用 token 单价，没有时回退到按条

insert into operation_config (key, value, category, label, description) values
  -- 免费试用配额
  ('free_trial.quota', '{"default_quota": 10, "enabled": true}'::jsonb, 'general', '免费试用配额', '新设备默认免费试用次数'),
  
  -- 模型按 token 计价（输入/输出分别定价，单位：无为币 / 千 token）
  ('model_token_price.claude-sonnet-4', '{"name": "Claude Sonnet 4", "input_per_1k": 0.3, "output_per_1k": 1.5, "cost_per_msg": 1.5}'::jsonb, 'model', 'Claude Sonnet 4 Token价', '输入/输出每千 token 消耗无为币'),
  ('model_token_price.claude-opus-4', '{"name": "Claude Opus 4", "input_per_1k": 1.5, "output_per_1k": 7.5, "cost_per_msg": 5.0}'::jsonb, 'model', 'Claude Opus 4 Token价', '输入/输出每千 token 消耗无为币'),
  ('model_token_price.gpt-4o', '{"name": "GPT-4o", "input_per_1k": 0.25, "output_per_1k": 1.0, "cost_per_msg": 1.0}'::jsonb, 'model', 'GPT-4o Token价', '输入/输出每千 token 消耗无为币'),
  ('model_token_price.kimi-k3', '{"name": "Kimi K3", "input_per_1k": 0.1, "output_per_1k": 0.4, "cost_per_msg": 0.5}'::jsonb, 'model', 'Kimi K3 Token价', '输入/输出每千 token 消耗无为币'),
  ('model_token_price.deepseek-v3', '{"name": "DeepSeek V3", "input_per_1k": 0.05, "output_per_1k": 0.2, "cost_per_msg": 0.3}'::jsonb, 'model', 'DeepSeek V3 Token价', '输入/输出每千 token 消耗无为币'),
  ('model_token_price.glm-5', '{"name": "GLM-5", "input_per_1k": 0.08, "output_per_1k": 0.3, "cost_per_msg": 0.4}'::jsonb, 'model', 'GLM-5 Token价', '输入/输出每千 token 消耗无为币')

on conflict (key) do update set
  value = excluded.value,
  category = excluded.category,
  label = excluded.label,
  description = excluded.description,
  updated_at = now();
