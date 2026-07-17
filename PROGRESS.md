# 无为官网 · 施工进度

> 执行：小码 💻（技术部）｜依据 `ARCHITECTURE_PROPOSAL.md`（董事长已批·先海外后国内）
> 铁律：未部署线上、未切 DNS、未 commit（改动留工作区）；service/secret key 只服务端用。

---

## ✅ P0 · 地基（2026-07-16 完成）

### 一、做了啥

**1. 数据库结构落到 Supabase（新加坡 wuwei 项目）**
- 连接：Session pooler `aws-0-ap-southeast-1.pooler.supabase.com:5432`（IPv4，SCRAM 认证通）。本机无 psql/py-pg，用 `npm i pg --no-save`（不写进 package.json）跑迁移。
- 应用文件：`supabase/schema.sql`（5 张业务表 + 看板视图 + 定价种子）→ `supabase/schema_p0.sql`（P0 增量）。均**幂等**，可重跑。
- **新增 `admin_users` 表**：后台管理员白名单（id→auth.users / email / role）。
- **全表开 RLS + 红线策略**（方案 §3.2）：
  - `releases` / `pricing_plans` / `site_config`：匿名**只读**，且 `releases` 仅 `is_published=true`、`pricing_plans` 仅 `is_active=true`（未发布包 / 草稿价不外泄）。
  - `analytics_events` / `client_events`：匿名**零策略 = 不可读不可写**；写入一律经服务端 route handler 用 service key（service_role 绕过 RLS），浏览器永远拿不到 service key。
  - `admin_users`：匿名完全不可见。
  - 后台管理员（登录且在白名单，`is_admin()` security-definer 判定，避免策略递归）可读写业务表 —— P2 后台生效。
  - 看板视图 `v_daily_stats` 设 `security_invoker=on`，防止视图绕过底表 RLS。
- **定价种子改为最新拍板价**（幂等 upsert，重跑自动校正）：
  | region | plan | 价 |
  |---|---|---|
  | cn | 免费版 / 无为 Pro / 年付 | ¥0 / **¥29·月** / **¥288·年** |
  | global | Free / Wuwei Pro / Annual | $0 / **$9·月** / **$90·年** |

**2. Storage 桶**：建 `releases` 桶（MVP `public`，方案 §3.5）。读公开、上传经 service key；二期要精确防绕过再改 private + signed URL。

**3. VI Design Tokens 骨架接入 Tailwind**
- 新增 `src/app/brand-tokens.css`：VI 五色权威名（ink/paper/water/water-light/bamboo/spark/spark-hover）+ 中性/面/描边 + 功能色 + 字体，取值以《无为VI落地规范v1》为准。保留 `indigo`/`cinnabar` 兼容别名（现有 `page.tsx` 在用，不破坏）。
- `globals.css` 改为 `@import "./brand-tokens.css"`，色彩收敛到单一真源。小美正式导出 `tokens.json` 后按同名接口替换即可。

**4. Vercel 环境变量清单**（见下「环境变量」节，先列不连线上）。

### 二、验证结果（都实测过，非口头）
- **迁移自查**：6 张业务表 + admin_users 建好；6 表 RLS 全开；策略挂载正确；定价 6 行 = 最新价；`v_daily_stats` reloptions=`security_invoker=on`；`releases` 桶 public=true；`is_admin()` security_definer=true。
- **匿名 key 端到端 RLS 验证**（用 publishable key 模拟浏览器）：
  - 读在售 `pricing_plans` → 6 行 ✓
  - 读已发布 `releases` → 0 行（暂无包，预期）✓
  - 读 `analytics_events` → 被拦/空 ✓（拿不到埋点）
  - 写 `analytics_events` → 被 RLS 拒绝 ✓（`violates row-level security policy`）
- **前端构建**：`next build` ✓ 编译通过、TypeScript 通过、首页 ISR（revalidate 1m）正常 → tokens 骨架被 Tailwind 正确加载，无破坏。

### 三、遇到的坑 / 要注意
- **⚠️ 库里已存在一套非本方案的旧表**（不是本次建的，我一律未动）：`profiles`(1行,账号:email/name/avatar/provider) / `usage_daily`(计量:day/user_id/device_id/messages) / `app_events`(user_id/device_id/os) / `app_versions`(≈releases) / `app_config`(1行,≈site_config)。
  - 判断：像是早前搭的「账号+计量+版本」底子。`profiles`/`usage_daily`/`app_events` 对应方案里「收费闭环/账号体系」（本就另立项）；但 `app_versions`/`app_config` 与我们的 `releases`/`site_config` **概念重叠**。
  - **需 CEO 定夺**：合并清理（迁数据后下线 app_*）还是并存。**不挡 P0/P1**——官网只读我们自己的表。我不擅自删他人建的表。
- 本机无 psql/py-pg/node-pg，已用 `pg --no-save` 解决；迁移脚本 `_migrate_p0.cjs` 留在工作区（可复用于 P1，未 commit）。
- 定价「海外 $9/$90」按 CEO 本次指令落种子；此前方案/记忆写的是 $19/$190。若 9 是笔误，因价格**后台可配**，一句话我改种子或后台一键改。

### 环境变量（Vercel 部署时配，现只列不连）
| 变量 | 作用 | 来源(secrets/wuwei-deploy.env) | 暴露面 |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 前台 Supabase 地址 | `SUPABASE_PROJECT_URL` | public（进浏览器，OK） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 前台匿名只读 key | `SUPABASE_PUBLISHABLE_KEY` | public（RLS 兜底，OK） |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端写埋点/发版 | `SUPABASE_SECRET_KEY` | **server only·绝不进 bundle** |
| `IP_HASH_SALT` | 埋点 IP 加盐哈希（只存哈希不存明文） | 需新生成一串随机盐 | server only |
| `CI_RELEASE_SECRET`（P4 预留） | 校验 CI 推包端点 | P4 时生成，GitHub + Vercel 两端配 | server only |

> 部署走 Vercel Serverless 时，若需直连 DB 用 Transaction pooler(6543)=`SUPABASE_DB_URL_TX`；前台数据走 Supabase JS(PostgREST)不需 DB 串。

### 四、下一步 P1 准备（前台动态化，等 CEO 发令再开）
- 首页/产品页 VI 落地（用 brand-tokens）+ 读 `releases`/`pricing_plans`（ISR，data.ts 已就绪）。
- `middleware.ts` 中英地理分流（Vercel geo 头，对 bot 放行护 SEO）；英文站 `/en` 独立文案。
- `/vs/[slug]` 对标 SEO 落地页矩阵（复用品牌中心已写文案）；metadata/sitemap/JSON-LD/hreflang 补全。
- 待 CEO 定夺：旧表(app_*/profiles/usage_daily)去留；海外定价 $9 vs $19 确认。

---

## ✅ P1a · 官网前台第一块（2026-07-16 完成）

> 执行：小码 💻｜依据 CEO P1a 派单｜铁律遵守：未部署 / 未切 DNS / 未 commit；service key 只服务端；`next build` 通过。
> 董事长「旧表 profiles/usage_daily/app_events/app_versions/app_config 并存不动」——本块一律未碰。

### 一、做了啥

**1. 改价（海外 pro $19/月·$190/年）**
- 走 P0 同一条 Session pooler（`aws-0-ap-southeast-1:5432`，IPv4）跑幂等迁移。
- 实测：改价前库里海外 pro 已是 **$19**、annual **$190**（P0 后已被校正为拍板价），本次迁移 0 行变动 = 幂等确认到位。国内 **¥29/月·¥288/年** 一行未动。
- `supabase/schema.sql` 种子同为 19/190（单一真源一致）。临时迁移脚本 `_migrate_p1a_pricing.cjs` 跑完即删，未 commit。

**2. 首页套 VI（brand-tokens，朱赭只给主 CTA）**
- 色彩全部走 token（ink/paper/water/water-light/bamboo/spark），不散写色值。
- **一点朱收敛到 ≤10%**：全站唯一朱赭实心按钮 = hero「免费下载无为」主 CTA；圆相 logo 火种点；Pro 定价卡极细朱顶条点睛。**招牌五词徽章由原来的全朱改为水青中性**（原实现整行朱赭超标，已修正）。
- premium 空灵留白：hero/分区间距加大，卡片用 surface + mist 描边、water/bamboo 点缀。

**3. 首页读库 + ISR + 下载占位**
- 定价区读 `pricing_plans`（`getPricing('cn')`）、下载区读 `releases`（`getLatestReleases`），`revalidate=60` ISR。
- 无包时三平台按钮显示「即将上线」占位 + CTA 副文案「三平台安装包即将上线」。

### 二、验证结果（实测）
- `next build` ✓ 编译 2.2s、TypeScript 通过、8/8 静态页生成；`/` = ○ 静态 + Revalidate 1m（ISR）。
- 预渲染 HTML 命中：`免费版` / `无为 Pro` / 价 `¥29`·`288`（定价读库成功）、`即将上线`×8（无包占位正确）、`免费下载无为`（主 CTA）。
- 端到端：pricing_plans 6 行经匿名 key 正常读出，价格显示为 ¥29 / ¥288（无 .00 冗余）。

### 三、本块没做（按派单归 P1b/后续）
- 中英分流 `middleware.ts`、英文站 `/en`、`vs/[slug]` 对标落地页、三产品页 → **P1b**。
- 未部署 / 未切 DNS / 未 commit（改动全留工作区）。
- 旧表去留仍待 CEO 定夺（董事长已定「并存不动」，本块遵此未碰）。

---

## ✅ P1b · 官网前台第二块（2026-07-16 完成）

> 执行：小码 💻｜依据 CEO P1b 派单｜铁律遵守：未部署 / 未切 DNS / 未 commit；service key 只服务端；`next build` 通过。
> 旧表（profiles/usage_daily/app_events/app_versions/app_config）董事长定并存不动——本块一律未碰。

### 一、做了啥（三件）

**1. 中英地理分流 `src/middleware.ts`**
- 读 Vercel geo 头 `x-vercel-ip-country`，兜底 `cf-ipcountry`（橙云代理时可用）。
- **对 bot UA 一律放行不跳转**（护 SEO：中/英是两套独立 URL 互打 hreflang，绝不按 IP 302 跟随爬虫，否则 Google 只爬到一套）——BOT_UA 覆盖 google/baidu/bing/yandex/ahrefs/lighthouse 等。
- 顶部「中/EN」手动切换写 `wuwei_lang` cookie（`LanguageSwitch` 组件，1 年、SameSite=Lax），**之后以 cookie 为准**（尊重用户选择、URL 稳定）。
- `matcher` 只拦 `/`，成本最低、不误伤子页/静态资源。首访：CN/未知→留中文 `/`，其他→跳 `/en`。
- 构建产物显示为 `ƒ Proxy (Middleware)` 已激活。

**2. 英文站 `/en`（独立文案，非机翻）**
- 海外定位三支柱：**privacy（本地优先/代码不出机/开源可审）· own-your-keys（自带模型、不锁生态、随时能走）· simpler than Cursor（免命令行、免配置马拉松）**。
- 套同一套 VI token（ink/water/bamboo/spark），一点朱只给主 CTA；招牌词用水青中性徽章。
- 读 `pricing_plans` **global 档**（`getPricing('global')`）+ `releases`，ISR 60s。实测预渲染命中：Free **$0** / Wuwei Pro **$19/mo** / Annual **$190/yr（≈$15.8/mo）**，无包时下载区显示 "Coming soon" 占位。
- `metadata` 全套：英文 title/description/keywords/OG/twitter + **hreflang alternates（zh-CN / en / x-default）** + canonical。

**3. 三产品页 `/wuwei`、`/nian`、`/shot`（中文）**
- 文案来源 = 品牌中心「产品中心」，搬运落地在 `lib/products.ts`（P1b 前已备），**非机翻**。定位以品牌中心为准：**无为=通用 AI Agent 本尊（非「编程客户端」）**、无为念=AI 语音输入、无为截=会思考的截图。
- 共享骨架 `components/ProductPage.tsx`：SiteHeader(壳) + hero（无为念/无为截带故事式 opening 引子）+ h1/sub + 主 CTA（朱，回 `/#download`）+ 次级对标链接 + 5 卖点卡 + 收尾二次 CTA + SiteFooter。
- 各页独立 metadata（title/description/OG/canonical），ISR 60s。

**4. 首页接壳（顺带，让新页可导航）**
- 首页 `page.tsx` 接入 `SiteHeader`（产品/定价/中英切换/下载）+ `SiteFooter`（原内联页脚替换为统一组件），并补 hreflang alternates（与 /en 互标）。VI 与既有验收内容未改。
- `sitemap.ts` 补 `/wuwei /nian /shot` + `/` `/en` 的多语言 alternates。

### 二、验证结果（实测 `npx next build`）
- ✓ 编译 2.5s、**TypeScript 通过**、静态页 **12/12** 全生成。
- 路由全出：`○ /`、`○ /en`、`○ /wuwei`、`○ /nian`、`○ /shot`（均 ISR 1m）+ `sitemap.xml` / `robots.txt` + `ƒ Proxy(Middleware)`。
- 预渲染 HTML 抽验命中：/en（One intention / Own your keys / Simpler than Cursor / $0·$19·$190）；/wuwei（一念既出/把活干成/免费下载无为）；/nian（opening 引子）；/shot（截图，会思考了）；首页导航含 `/wuwei` 等产品链接。
- hreflang 互标 + canonical 全部正确落地（/ 与 /en 互指，产品页各自 canonical）。

### 三、本块没做 / 已知小项（留后续）
- `/vs/[slug]` 对标 SEO 落地页矩阵 → **P1c**（本块按派单未做）。
- JSON-LD 结构化数据、robots 屏蔽 /admin·/api → 待 /admin(P2) 落地时一并补。
- **`/en` 的 `<html lang>` 仍是 `zh-CN`**（根 layout 单一 `<html>`，App Router 需 `[lang]` 段重构才能分语言设）——已由 hreflang alternates 覆盖 SEO 语言信号，属次要项，后续做站点结构时一并处理。
- 三产品页目前只有中文版（英文详情页 = 二期，与方案一致）；SiteHeader 英文态产品链接暂指向中文详情页。
- Next 16 提示 `middleware` 命名将迁 `proxy`（仅告警，功能正常），留待统一升级。
- **未部署 / 未切 DNS / 未 commit**；service key 只服务端（`lib/supabase.ts` 未改动）。

---

## ✅ P5a · 部署官网到 Vercel 生产（2026-07-16 完成 · 软上线）

> 执行：小码 💻｜董事长已批准软上线（暂不推广）｜铁律：**未切 DNS（CEO 亲自切）· 未 commit**；service key 只服务端。

### 一、部署结果
- **生产 URL（稳定别名）**：https://wuwei-site.vercel.app
- 本次部署 URL：https://wuwei-site-49s0yrgok-kehuipangs-projects.vercel.app ｜ readyState=READY
- Vercel 项目：`kehuipangs-projects/wuwei-site`（projectId `prj_tobGkzFveR3BjpkAOVKzZNfAgEWW`）
- 检视台：https://vercel.com/kehuipangs-projects/wuwei-site

### 二、环境变量（生产·均 Encrypted，值不外泄）
| 变量 | 值来源(secrets/wuwei-deploy.env) | 暴露面 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `SUPABASE_PROJECT_URL` | public（前台读，OK） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `SUPABASE_PUBLISHABLE_KEY` | public（RLS 兜底，OK） |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SECRET_KEY` | **server only·无 NEXT_PUBLIC 前缀·绝不进 bundle** |
| `IP_HASH_SALT` | 部署时 `openssl rand -hex 32` 新生成 | server only |
> 变量名以代码为准（`src/lib/supabase.ts` + `api/track|download`）。

### 三、线上自测（全绿）
- 首页 `/`（带 `wuwei_lang=zh` 绕地理分流）→ **HTTP 200**，命中「免费下载无为」「无为 Pro」「288」「为什么是无为」（定价读库成功）。
- `/`（无 cookie·curl 从非 CN 出口）→ **307 跳 `/en`** = middleware 地理分流按预期生效。
- `/en` → **200**，命中「One intention」「Own your keys」「Wuwei Pro」「190」（global 档 $19/$190 读库成功）。
- 产品页 `/wuwei` → **200**，产品文案命中。
- **Googlebot UA 访问 `/` → 200 不跳转**（bot 放行护 SEO，符合方案）。
- **🔒 安全红线**：service key 值在 全量 HTML + 9 个 `_next/static` JS chunk（641KB）中 **0 命中 → 未泄露**。

### 四、没做 / 交接
- **DNS 未切**（`wuweiai.io` 仍指旧处）——由 CEO 小笨亲自切 A/CNAME 到 Vercel。当前只能经 `wuwei-site.vercel.app` 访问。
- 未 commit（改动全留工作区）；`vercel link` 顺带往 `.env.local` 写了 `VERCEL_OIDC_TOKEN`（gitignore 内，不入库）。
- GitHub 自动连接失败（CLI 直传部署已成功，Git 自动 CI/CD 可后续在 Vercel 后台手动接）。
- 提醒：上线稳定后轮换一次此前群内明文发过的 key（方案 §8 已记）。
