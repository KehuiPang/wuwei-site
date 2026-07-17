-- 无为官网 · 数据库表结构 v1
-- 目标库：Supabase 项目 wuwei (ref mayjabfxjzegovfmmony), Postgres 17.6
-- 跑法：Session pooler(5432) 连接后执行；或 Supabase SQL Editor 粘贴。
-- 约定：所有表默认 RLS 关闭前不对匿名开放写；前台只读经 view/policy，写走 service key。

-- ============ 1. 安装包版本 ============
create table if not exists releases (
  id           bigint generated always as identity primary key,
  version      text        not null,                 -- 语义化版本 如 1.3.3
  platform     text        not null check (platform in ('windows','macos','linux')),
  arch         text        default 'x64',            -- x64/arm64
  channel      text        not null default 'stable' check (channel in ('stable','beta')),
  file_url     text        not null,                  -- Supabase Storage 路径/公链
  file_name    text,
  file_size    bigint,                                -- 字节
  sha256       text,
  notes        text,                                  -- 更新日志(markdown)
  is_published boolean     not null default false,    -- 后台勾选后前台才可见
  created_at   timestamptz not null default now()
);
create index if not exists idx_releases_pub on releases (platform, channel, is_published, created_at desc);

-- ============ 2. 定价档位（后台可配） ============
create table if not exists pricing_plans (
  id         bigint generated always as identity primary key,
  region     text        not null check (region in ('cn','global')),
  plan_key   text        not null,                    -- free / pro / annual / team
  name       text        not null,
  price      numeric(10,2) not null default 0,        -- cn=人民币元, global=美元
  currency   text        not null default 'CNY',      -- CNY / USD
  period     text        not null default 'month' check (period in ('once','month','year','custom')),
  original_price numeric(10,2),                        -- 划线原价(可空)
  badge      text,                                     -- 如"早鸟价"
  features   jsonb       not null default '[]'::jsonb, -- 卖点数组
  sort_order int         not null default 0,
  is_active  boolean     not null default true,
  updated_at timestamptz not null default now(),
  unique (region, plan_key)
);

-- ============ 3. 站点键值配置（首屏文案/开关等） ============
create table if not exists site_config (
  key        text primary key,                         -- 如 hero.badges / cta.text / lang.autoswitch
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============ 4. 埋点原始事件（PV/UV/下载/客户端登录看板源） ============
create table if not exists analytics_events (
  id         bigint generated always as identity primary key,
  event_type text        not null check (event_type in ('pageview','download','client_login','signup','cta_click')),
  path       text,                                     -- 落地页/页面路径
  referer    text,
  country    text,                                     -- CF/Vercel geo
  lang       text,                                     -- cn/en
  platform   text,                                     -- 下载/登录时的平台
  ip_hash    text,                                     -- 只存哈希，不存明文IP（隐私）
  anon_id    text,                                     -- 前端持久匿名ID(算UV)
  ua         text,
  meta       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_ae_type_time on analytics_events (event_type, created_at desc);
create index if not exists idx_ae_time on analytics_events (created_at desc);

-- ============ 5. 客户端上报（客户端登录/活跃） ============
create table if not exists client_events (
  id         bigint generated always as identity primary key,
  anon_id    text,                                     -- 客户端匿名标识
  event      text        not null default 'login' check (event in ('login','heartbeat','install')),
  version    text,
  platform   text,
  meta       jsonb       not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_ce_time on client_events (event, created_at desc);

-- ============ 看板便捷视图 ============
create or replace view v_daily_stats as
select date_trunc('day', created_at) as day,
       count(*) filter (where event_type='pageview')                as pv,
       count(distinct anon_id) filter (where event_type='pageview') as uv,
       count(*) filter (where event_type='download')                as downloads
from analytics_events
group by 1 order by 1 desc;

-- ============ 种子：初始定价（2026-07-16 董事长拍板价，后台可改） ============
-- 国内 ¥29/月·¥288/年；海外 $19/月·$190/年；free 保留。价格"后台可配"，此处仅初始值。
-- do update = 幂等，重跑即校正为最新价（避免旧种子残留）。
insert into pricing_plans (region, plan_key, name, price, currency, period, original_price, badge, features, sort_order) values
 ('cn','free','免费版',0,'CNY','month',null,null,'["核心功能全开","自带自己的 key","永久免费"]',1),
 ('cn','pro','无为 Pro',29,'CNY','month',null,null,'["托管额度","更长上下文","更高并发"]',2),
 ('cn','annual','无为 Pro 年付',288,'CNY','year',null,'付10月送2月 ≈¥24/月','["≈¥24/月","付10月送2月"]',3),
 ('global','free','Free',0,'USD','month',null,null,'["Full features","Bring your own key","Free forever"]',1),
 ('global','pro','Wuwei Pro',19,'USD','month',null,null,'["Hosted credits","Longer context","Higher concurrency"]',2),
 ('global','annual','Wuwei Pro Annual',190,'USD','year',null,'pay 10, get 12 ≈$15.8/mo','["$15.8/mo","Pay 10, get 12"]',3)
on conflict (region, plan_key) do update set
  name           = excluded.name,
  price          = excluded.price,
  currency       = excluded.currency,
  period         = excluded.period,
  original_price = excluded.original_price,
  badge          = excluded.badge,
  features       = excluded.features,
  sort_order     = excluded.sort_order,
  is_active      = true,
  updated_at     = now();
