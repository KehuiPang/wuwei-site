# 无为官网 · 动态站 + 后台管理系统 架构方案 v1

> 记录：小笨(CEO) 🎩 | 2026-07-16 | 品牌先行已过：魂=「一念既出，万事自成」、无为而成/上善若水；VI 玄墨黑#16191E·月白#F4F6F8·靛青#274A63·竹青#5C8A73·一点朱#C05F3C(≤10%)、大留白空灵。
> 董事长 7-16 拍板：官网从静态页升级为**真·动态站 + 后台管理系统**。栈 = Vercel + Supabase。

---

## 一、五大需求 → 系统映射

| # | 董事长需求 | 落地方案 |
|---|---|---|
| ① | 安装包后台上传 / CI 自动推 → 首页真实下载 | Supabase Storage `releases` 桶 + `releases` 表；后台上传或 CI 用 service key 推包；首页读"最新已发布版"给三平台下载按钮 |
| ② | 价格等信息后台可配 | `pricing_plans` + `site_config` 表；后台改，前台实时读，改价不发版 |
| ③ | PV/UV/下载量/客户端登录 实时看板 | `analytics_events` 表落原始事件 → 后台看板聚合；客户端登录走 `client_events` |
| ④ | 官网动态化 + UI | Next.js(App Router) SSR/ISR，首页数据来自 Supabase；沿用现有 index.html 的魂与文案 |
| ⑤ | SEO 做自然流量 + 后台看流量 | Next.js metadata/sitemap/OG；PV 落 `analytics_events`，后台看板含来源/落地页 |

## 二、技术栈

- **前端/站点**：Next.js 15 App Router（TS）+ Tailwind（VI token 化）。部署 Vercel（账号 kehuipang，同 Forgly）。
- **后端/数据**：Supabase（项目 wuwei / ref mayjabfxjzegovfmmony / 新加坡）。Postgres + Storage + Auth + RLS。
- **鉴权**：后台管理用 Supabase Auth（邮箱登录，仅董事长/CEO 白名单）；前台匿名。
- **DB 连接**：运行时前台走 Supabase JS(PostgREST, publishable key)；服务端/CI 敏感写用 secret key。建表迁移走 Session pooler(5432, IPv4)。Vercel Serverless 若需直连走 Transaction pooler(6543)。
- **域名**：wuweiai.io（DNS 现在 Cloudflare）→ 迁移时改解析指向 Vercel；www 证书 Vercel 自动签。

## 三、目录结构（规划）

```
projects/wuwei-site/
├─ app/                    # Next.js App Router
│  ├─ (site)/page.tsx      # 中文主站(动态首页)
│  ├─ (site)/en/page.tsx   # 英文站
│  ├─ api/                 # 下载跳转/埋点/CI上传 endpoint
│  └─ admin/               # 后台(受Auth保护): 发版/改价/看板
├─ lib/supabase/           # server & browser client
├─ supabase/schema.sql     # 表结构(本文件配套)
├─ legacy/index.html       # 旧静态页(留档参考,文案复用)
└─ ...
```

## 四、数据库表（详见 supabase/schema.sql）

- `releases` — 安装包版本：version/platform/channel/file_url/size/sha256/notes/is_published
- `pricing_plans` — 定价档位：region(cn/global)/plan_key/name/price/period/features/badge/sort_order/is_active
- `site_config` — 键值配置：首屏文案/开关等后台可改项(jsonb)
- `analytics_events` — 原始埋点：event_type(pageview/download/client_login)/path/country/ua/ip_hash/referer/meta
- `client_events` — 客户端上报：客户端登录/心跳(anon_id/version/platform)

看板聚合 SQL 直接 over `analytics_events`（PV=计数，UV=distinct ip_hash/anon_id，下载量=event_type='download'）。

## 五、埋点/隐私（上善若水·诚实不浮夸）

- IP 只存**哈希**(ip_hash)，不存明文；符合品牌"诚实、不套路"。
- 前台 pageview 用轻量 beacon 打 `/api/track`，服务端补 country(CF/Vercel geo)。

## 六、分步推进计划

1. ✅ 品牌先行 + 架构/表结构（本文件 + schema.sql）
2. 建 Supabase 表结构（跑 schema.sql）+ 建 Storage `releases` 桶
3. Scaffold Next.js + Tailwind + Supabase client；VI token 化
4. 迁移现有 index.html 文案/魂 → 动态首页(读 releases/pricing)
5. 后台：登录(白名单) → 发版上传 / 改价 / 看板
6. 埋点 `/api/track` + 下载跳转 `/api/download`
7. 英文站 /en + CF-IPCountry 分流
8. 接 minicc CI 自动推包(push v*tag → 上传 Storage + 写 releases)
9. 部署 Vercel + 绑域名 + DNS 切换（需董事长 GitHub/Vercel 授权那一步）

**硬前置提醒（不挡官网先上，但收费闭环要另立项）**：Pro 托管额度 = 账号体系 + 支付(微信/支付宝/Stripe) + API 计量代付，是真后端工程；官网可先上、下载/充值先占位。国内访问/ICP 备案上线前评估。
