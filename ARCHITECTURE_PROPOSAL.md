# 无为官网 · 动态站 + 后台管理系统 · 架构方案（评审稿）

> 出品：小码 💻（技术部）｜2026-07-16｜送审：CEO 小笨 🎩
> 定位：本文是在 CEO 已有 `ARCHITECTURE.md v1` + 现有 Next.js 骨架基础上，做的**深化 / 可评审版**。只出方案、不落代码、不动线上。
> **品牌先行已过**：魂 =「一念既出，万事自成」；VI = 玄墨黑 `#16191E` · 月白 `#F4F6F8` · 靛青 `#274A63` · 竹青 `#5C8A73` · 一点朱 `#C05F3C`（≤10%）；气质 = 空灵、留白、premium。官网按 VI「亮色为主 + 大留白 + 一个朱赭 CTA + ○/门/水 静谧动效」。

---

## 0. 一页纸结论（给 CEO 速览）

- **框架**：沿用现有 **Next.js 16 App Router + Tailwind v4 + Supabase**，无需换栈。骨架已对，本方案是把它补成"完整系统"。
- **五大需求**全部有落地路径，见 §1 映射表。核心新增：**后台管理台（/admin）、CI 自动推包闭环、看板聚合、SEO 内容矩阵**。
- **3 个必须 CEO / 董事长拍板的决策点**（见 §9）：
  1. **国内访问 & 备案**——这是最大不确定性。百度 SEO ≈ 强制 ICP 备案；Vercel（境外）国内访问慢/不稳。**建议：一期先海外 Vercel 上线跑，国内 SEO/自然流量作为二期单独立项（需备案 + 国内节点）**。
  2. **迁到 Vercel 后，原「CF-IPCountry 分流」方案要改**——改用 Next.js middleware 读地理头做中英分流（详见 §2.3）。
  3. **定价一致性**——最新拍板 = 国内 ¥29/月、海外 $19/月（年付 ¥288/$190）；但现有 `schema.sql` 种子还是旧的 ¥39/¥299。因价格已「后台可配」，**建表时用最新数字做种子即可**，此后一律后台改、不改代码。
- **一期不做**：收费闭环（账号体系 + 支付 + API 计量代付）是独立后端工程，官网先上、下载/充值先占位——与 v1 结论一致。

---

## 1. 五大需求 → 系统映射

| # | 董事长需求 | 落地方案 | 现状 |
|---|---|---|---|
| ① | 安装包 CI 自动推 Storage → 官网真实下载 | Supabase Storage `releases` 桶 + `releases` 表；minicc 仓 push `v*` tag → GitHub Actions 出三平台包 → 调 `/api/ci/release`（带 CI 密钥）写包 + 元数据；首页读"最新已发布版"给下载按钮，经 `/api/download` 302 跳转并埋点 | 表 + `/api/download` 已有；**缺 CI 端点与 Actions 工作流** |
| ② | 价格等信息后台可配 | `pricing_plans` + `site_config` 表；后台改，前台 ISR 实时读，**改价不发版** | 表 + 前台读取已有；**缺后台编辑界面** |
| ③ | PV/UV/下载量/客户端登录 实时看板 | `analytics_events`（前台埋点）+ `client_events`（客户端上报）落原始事件 → 后台看板按 SQL 视图聚合 | 埋点写入已有；**缺看板页 + 聚合查询 + 客户端上报端点** |
| ④ | 官网动态化 + UI | Next.js App Router，SSR/ISR，首页数据全来自 Supabase；VI token 化，沿用现有文案与"魂" | 首页动态化雏形已有；**缺 VI token 系统化、三产品页、英文站** |
| ⑤ | SEO 自然流量 + 后台看流量 | Next metadata / sitemap / robots / OG / JSON-LD + **对标文章内容矩阵**（`claude-code-alternative` 等已写好的 SEO 文案 → 程序化落地页）；流量落 `analytics_events`，后台看板含来源/落地页/国家 | sitemap/robots 已有；**缺内容矩阵页 + 结构化数据 + 看板来源维度** |

---

## 2. 前端 / 站点架构

### 2.1 框架选型（结论：沿用 Next.js 16，不换）
- **为什么 Next 合适**：官网既要 **SEO（SSR/SSG 首屏可爬）**，又要 **动态数据（价格/下载/看板随时变）**，还要 **后台管理 + API 端点**——Next.js App Router 一套全包（页面 + Route Handler + middleware），且 Vercel 原生托管、零运维、免费额度够用。
- **渲染策略分层**：
  - 首页 / 产品页 / 对标文章：**ISR**（`revalidate = 60`）——静态化利于 SEO 与速度，又能在改价/发版后 60s 内自动刷新。现有 `page.tsx` 已用此法，正确。
  - 后台 `/admin`：**纯 CSR + 服务端校验**（`dynamic = 'force-dynamic'`，不缓存、不进 sitemap、不被索引）。
  - 埋点 / 下载 / CI：**Route Handler（Node runtime）**。
- **为何不选 Astro / 纯静态**：静态站满足不了后台管理与实时看板；无为要的是"一个系统"，不是"一个页面"。已有 Next 骨架，换栈是倒退。

### 2.2 页面结构（目录规划）
```
projects/wuwei-site/src/
├─ app/
│  ├─ (site)/                      # 前台（有品牌壳：导航/页脚/语言切换）
│  │  ├─ page.tsx                  # 中文主站首页（聚合三产品 + 下载 + 定价）
│  │  ├─ en/page.tsx               # 英文站首页（独立文案，非机翻）
│  │  ├─ wuwei/page.tsx            # 无为·客户端 产品页
│  │  ├─ nian/page.tsx             # 无为·念（语音输入）产品页
│  │  ├─ shot/page.tsx             # 无为·截（截图）产品页
│  │  └─ vs/[slug]/page.tsx        # 对标/SEO 落地页（claude-code-alternative 等，程序化）
│  ├─ admin/                       # 后台（Auth 保护，noindex）
│  │  ├─ layout.tsx                # 校验登录 + 白名单，否则 302 /admin/login
│  │  ├─ releases/page.tsx         # 发版：上传/勾选发布/回滚
│  │  ├─ pricing/page.tsx          # 改价：编辑 pricing_plans
│  │  ├─ config/page.tsx           # 站点文案/开关（site_config）
│  │  └─ dashboard/page.tsx        # 看板：PV/UV/下载/登录 趋势
│  ├─ api/
│  │  ├─ track/route.ts            # 前台埋点（已有）
│  │  ├─ download/route.ts         # 下载 302 + 埋点（已有）
│  │  ├─ client-event/route.ts     # 客户端登录/心跳上报（新增）
│  │  └─ ci/release/route.ts       # CI 推包写库（新增，CI 密钥鉴权）
│  ├─ sitemap.ts / robots.ts       # SEO（已有，需补多语言/对标页）
│  └─ layout.tsx / globals.css
├─ middleware.ts                   # 中英地理分流 + 手动切换 cookie（新增）
├─ components/                     # UI 组件（VI token 化）
├─ lib/
│  ├─ supabase.ts                  # public/admin client（已有）
│  ├─ data.ts                      # 前台读取（已有，扩展）
│  ├─ analytics.ts                 # 看板聚合查询（新增）
│  └─ brand/tokens.css             # VI 色彩/字体 token（新增，接小美导出）
└─ supabase/schema.sql             # 表结构（已有，本方案 §3 增量）
```

### 2.3 中英分流（⚠️ 迁 Vercel 后要改方案）
- **v1 原计划**用 Cloudflare Pages 的 `CF-IPCountry` 分流。**现改部署到 Vercel，CF-IPCountry 不再天然可用**（除非 DNS 仍走 Cloudflare 橙云代理）。
- **建议方案**：用 **Next.js `middleware.ts`** 读地理头分流：
  - Vercel 提供 `x-vercel-ip-country`；若 DNS 保留 Cloudflare 橙云代理，`cf-ipcountry` 也在。两者兜底取其一。
  - 逻辑：首次访问无 `lang` cookie → `CN` 落中文 `/`、其他落 `/en`；顶部「中/EN」手动切换写 cookie，后续以 cookie 为准（尊重用户选择，也利于 SEO 稳定 URL）。
  - **SEO 正确姿势**：中/英是两套独立 URL（`/` 与 `/en`），互相打 `hreflang` 标签，**不要用 302 跟随 IP 跳转爬虫**（否则 Google 只能爬到一套）。middleware 对 bot UA 放行、只对真人做首访分流。

### 2.4 VI 落地
- 把 §VI 色彩做成 `tokens.css`（`--brand-ink/water/spark/...`）+ Tailwind theme 扩展，全站只用 token，不散写色值。等小美正式导出 `tokens.css/json` 后直接替换，接口对齐。
- 首页 hero：○/门/水 静谧动效（现有内联 SVG 圆相 logo 已符合意象）；朱赭只给"下载"这一个主 CTA + hero 火种点，≤10% 面积，遵 Do/Don't。
- 字体：中文思源黑体、英文 Inter（hero 大标题可选 Fraunces），走 `next/font` 自托管（避免 Google Fonts 国内加载慢）。

---

## 3. 数据库设计（Supabase / Postgres）

现有 `schema.sql` 的 5 张表方向正确（`releases` / `pricing_plans` / `site_config` / `analytics_events` / `client_events`）。本方案做如下**增量与加固**：

### 3.1 新增：后台白名单表
```sql
-- 后台管理员白名单（只有这里的邮箱能进 /admin）
create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  role       text not null default 'admin' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);
```

### 3.2 RLS 策略（安全底线，必须开）
- **默认全表开 RLS**。前台匿名 client（publishable key）：
  - `releases` / `pricing_plans` / `site_config` → **只读**，且 `releases`/`pricing_plans` 只读 `is_published=true` / `is_active=true` 的行（用 policy 过滤，未发布的包/草稿价不外泄）。
  - `analytics_events` / `client_events` → **匿名不可读、不可直接写**；写入一律经服务端 Route Handler 用 **secret key**（绕过 RLS）。这样浏览器拿不到 service key，也伪造不了他人埋点表的读取。
- 后台 client（登录用户）：仅 `admin_users` 内邮箱可读写业务表——policy 用 `auth.uid() in (select id from admin_users)`。
- **关键红线**：`SUPABASE_SECRET_KEY` / `SERVICE_ROLE_KEY` 只存 Vercel 环境变量、只在 Route Handler / server 用，**绝不打进浏览器 bundle**（现有 `lib/supabase.ts` 已正确区分 public/admin，保持）。

### 3.3 定价种子（用最新数字）
建表种子改为**最新拍板价**（国内 ¥29/月、年付 ¥288；海外 $19/月、年付 $190），替换 `schema.sql` 里旧的 ¥39/¥299/$182。之后一律后台改，schema 不再硬编码价格。

### 3.4 看板聚合（性能与准确性）
- 现有 `v_daily_stats` 视图够 MVP。**演进**：数据量上来后（>百万行）改**物化视图**（`v_daily_stats_mat`）+ 定时 `refresh`（Supabase cron / pg_cron），避免每次看板全表扫。
- **UV 口径**：以 `anon_id`（前端 localStorage 持久匿名 ID）distinct 计，比 `ip_hash` 更准（同 IP 多人/NAT）。需在前端 `analytics.ts` 生成并持久化 `anon_id`。
- **防污染**：看板聚合时按 UA 过滤已知 bot（爬虫会撑高 PV）；`/api/track` 增加简单频率/来源校验，防刷。

### 3.5 下载文件存储策略
- **建议 MVP**：`releases` 桶设 **public**，`file_url` 存公链；下载**始终经 `/api/download` 302 跳转**以埋点（现有实现）。
- 权衡：public 桶公链可被直接访问绕过埋点（影响下载量统计精度，不影响安全）。若要严格，改 **private 桶 + 服务端签发 signed URL**（`/api/download` 现签现给，链接短时有效）——更准更防盗链，但实现略重。**建议一期 public 够用，二期看数据需要再升 signed URL**。

---

## 4. 后台管理方案（/admin）

### 4.1 鉴权
- 用 **Supabase Auth 邮箱登录**（magic link 或密码），登录后在 `admin/layout.tsx` 服务端校验 `auth.uid()` 是否在 `admin_users`，否则踢回登录页。白名单只放董事长 + CEO（+ 我小码运维）。
- 后台全部 `noindex`、不进 sitemap、`force-dynamic` 不缓存。

### 4.2 功能页（对应需求 ①②③⑤）
| 页面 | 能做什么 | 对应需求 |
|---|---|---|
| **发版 Releases** | 看各平台版本列表；手动上传安装包（补 CI 之外的临时发包）；勾选 `is_published` 上/下架；一键回滚到旧版；填更新日志 | ① |
| **改价 Pricing** | 编辑中/英各档 `pricing_plans`（价、原价、badge、卖点、排序、上下架）；所见即所得预览 | ② |
| **站点配置 Config** | 改首屏徽章五词、CTA 文案、公告开关、语言自动分流开关等 `site_config` | ②④ |
| **看板 Dashboard** | PV/UV/下载量/客户端登录 的日/周趋势；按国家、落地页、来源、平台维度拆分；Top 来源与转化漏斗（访问→下载→登录） | ③⑤ |

### 4.3 Build vs Buy（务实）
- **MVP 可先用 Supabase Studio 直接改表**（改价/发布勾选都能在 Studio 里做），把自研后台的**发版上传**和**看板**优先做，其余延后——省一期工时。但董事长要的是"官网后台"体验，**建议改价 + 看板这两个高频页先自研**，Studio 作兜底。

---

## 5. CI 自动推包流程（需求 ①闭环）

```
 minicc 仓库 push tag v1.3.3
        │
        ▼
 GitHub Actions（matrix: windows / macos / linux）
   1. 构建三平台安装包（.exe / .dmg / .AppImage）
   2. 算 sha256、文件大小
   3. 上传包到 Supabase Storage releases 桶
      （用 SUPABASE_SECRET_KEY，走 Storage API）
   4. POST 官网 /api/ci/release
      header: x-ci-secret: <CI_RELEASE_SECRET>
      body: { version, platform, arch, file_url, file_name, file_size, sha256, notes, channel }
        │
        ▼
 /api/ci/release（Route Handler）
   - 校验 x-ci-secret（Vercel 环境变量，防伪造）
   - upsert releases 行，is_published = false（默认不自动上架）
        │
        ▼
 后台 Releases 页人工勾选 is_published = true → 首页 60s 内出现真实下载
```

- **要点**：
  - CI 密钥 `CI_RELEASE_SECRET` 存 GitHub Secrets + Vercel 环境变量，两端校验，**不复用 Supabase 密钥给 GitHub**（最小权限；GitHub 只需能上传 Storage + 调端点）。
  - `is_published=false` 默认 = **发版与上架解耦**，CI 推上来先待审，人工点发布——避免半成品包直接对外。董事长若要"推完即上架"，把默认改 true 即可（一个开关）。
  - 首个真实包出来前，首页下载按钮显示"即将上线"占位（现有 `page.tsx` 已处理）。

---

## 6. 埋点与看板（需求 ③⑤）

- **前台 pageview**：轻量 `beacon`（现有 `<Track/>` 组件）在页面加载打 `/api/track`，服务端补 `country`（Vercel/CF geo 头）、`ip_hash`（加盐 SHA256，只存哈希——遵品牌"诚实不套路"，现有实现已如此）。前端生成持久 `anon_id` 用于 UV。
- **下载**：`/api/download` 落 `download` 事件（已有）。
- **CTA / 注册**：关键按钮打 `cta_click` / `signup`。
- **客户端登录**：minicc 客户端登录/启动时上报 `/api/client-event`（`anon_id` + `version` + `platform` + `event`），落 `client_events`。**隐私**：客户端只报匿名 ID 与版本，不报个人数据。
- **看板**：后台读 `analytics.ts` 里的聚合查询（over 视图），出趋势图（可用轻量图表库如 `recharts` 或纯 SVG，避免重依赖）。**补充**：可同时接 **Vercel Web Analytics**（一行开启）作为交叉验证与兜底，但自有看板是主口径（数据在自己库里，可控）。

---

## 7. SEO 方案（需求 ⑤ · 无为的自然流量主战场）

- **技术 SEO（Next 原生）**：每页 `generateMetadata`（title/description/canonical/OG/twitter card）；`sitemap.ts` 覆盖全部前台页含多语言 `alternates`；`robots.ts` 放行前台、屏蔽 `/admin` 与 `/api`；结构化数据 **JSON-LD `SoftwareApplication`**（产品名/价格/评分位）+ 面包屑，利于富摘要。
- **多语言 SEO**：`/` 与 `/en` 互标 `hreflang`（`zh-CN` / `en` / `x-default`），避免重复内容惩罚。
- **内容矩阵（增长核心）**：品牌中心已写好一批高意图对标文案——`claude-code-alternative` / `claude-code-free-alternative` / `wuwei-vs-claude-code` / `wispr-flow-free-alternative` / `claude-code-account-banned`。**建议做成程序化落地页 `/vs/[slug]`**，每篇一个对标关键词入口，从搜索引擎捞"找 Claude Code 平替/被封号找替代"的高转化人群直达下载。这是无为最省钱的获客渠道，值得一期就上。
- **性能即 SEO**：Core Web Vitals 靠 ISR 静态化 + `next/font` 自托管 + `next/image` 优化 + 图片走 Supabase/Vercel CDN。目标 LCP < 2.5s。
- **⚠️ 国内 SEO（百度）**：见 §9 风险——**百度收录高度依赖 ICP 备案 + 国内可访问**，境外 Vercel + .io 域名做百度自然流量基本吃亏。一期先吃 Google（海外 + 国内技术人群翻墙），国内百度 SEO 作二期备案后专项。

---

## 8. 部署与域名

- **部署**：Vercel（账号 kehuipang，同 Forgly），连 GitHub 仓自动 CI/CD；环境变量（Supabase URL/keys、IP_HASH_SALT、CI_RELEASE_SECRET）配在 Vercel。运行时前台走 Supabase PostgREST（publishable key）；服务端敏感写用 secret key。
- **域名**：`wuweiai.io` DNS 现在 Cloudflare（token 已到位，切 DNS 我直接能做，无需再问董事长）。迁移时改解析指向 Vercel；`www` 证书 Vercel 自动签 + 跳转。
- **DNS 切换零停机**：先在 Vercel 部署 + 绑定域名验证通过，再切 A/CNAME，TTL 提前调低；切换窗口选低峰。
- **凭证**：全部已在 `secrets/wuwei-deploy.env` / `wuwei-cloudflare.env`，**不需向董事长再要**（见 INVENTORY.md）。上线稳定后提醒董事长轮换一次（此前群内明文发过）。

---

## 9. 风险点与待拍板决策 ⚠️

| 风险 / 决策 | 说明 | 建议 |
|---|---|---|
| **① 国内访问 & ICP 备案**（最大） | .io + Vercel（境外）国内访问可能慢/不稳；面向国内运营严格讲涉 ICP 备案；百度 SEO ≈ 必须备案 | **一期海外 Vercel 先上线跑通、吃 Google 流量**；国内自然流量（百度 + 稳定访问）作**二期专项**：备案 + 国内节点/CDN（备案需国内主体、周期以周计）。这点必须让董事长知情定调 |
| **② 迁 Vercel 后分流方案变更** | 原 CF-IPCountry 失效 | 改 Next middleware 读地理头（§2.3），对 bot 放行避免伤 SEO |
| **③ 定价数据一致性** | 最新 ¥29/$19 vs 种子旧 ¥39/$299 | 建表种子用最新价；此后一律后台改、不改代码 |
| **④ 收费闭环缺前置系统** | Pro 托管额度 = 账号体系 + 支付（微信/支付宝/Stripe）+ API 计量代付，是独立后端硬工程 | 官网先上、下载/充值先占位；收费系统**单独立项**（归 minicc-pro 技术线），不挡官网 |
| **⑤ 真实安装包依赖 minicc CI** | 官网"下载"要接 minicc 三平台包才非占位 | CI 端点先备好（§5），minicc 侧出包工作流并行推进；正式对外前必须有真包 |
| **⑥ 密钥安全** | service/secret key、CI 密钥泄露风险 | 只进环境变量、只服务端用；RLS 兜底；上线后轮换一次明文发过的 key |
| **⑦ Storage 下载埋点绕过** | public 桶公链可绕过 /api/download | MVP 可接受；二期需精确统计再上 private 桶 + signed URL |

---

## 10. 分阶段实施计划

> 每阶段独立可验收；一期目标 = **海外能真实下载 + 后台能改价发版 + 看得到流量**。

**P0 · 地基（1）**
- 跑 `schema.sql`（增 `admin_users`、RLS 策略、最新定价种子）到 Supabase；建 Storage `releases` 桶。
- Vercel 环境变量配齐；VI `tokens.css` 骨架接入 Tailwind。

**P1 · 前台动态化（2）**
- 首页/产品页 VI 落地 + 读 `releases`/`pricing_plans`（ISR）；`middleware.ts` 中英分流；英文站 `/en` 独立文案。
- `/vs/[slug]` 对标 SEO 落地页矩阵（复用已写文案）；metadata/sitemap/JSON-LD/hreflang 补全。

**P2 · 后台管理（3）**
- Supabase Auth 登录 + 白名单校验；发版页（上传/发布/回滚）、改价页、站点配置页。

**P3 · 数据闭环（4）**
- 埋点补 `anon_id` UV + 客户端上报端点；看板页（PV/UV/下载/登录 趋势 + 来源维度）。

**P4 · CI 推包（5）**
- `/api/ci/release` 端点 + minicc 仓 GitHub Actions（三平台构建→传 Storage→写库）；打通"push tag → 首页真下载"。

**P5 · 上线（6）**
- Vercel 部署 + 绑域名 + DNS 切换（低峰、TTL 预降）；灰度验证；提醒董事长轮换密钥。

**二期（另立项）**：国内备案 + 国内节点 + 百度 SEO；收费闭环（账号 + 支付 + 计量）；private 桶 signed URL；三产品独立站深化。

---

## 11. 与 v1 的主要增量（给 CEO 对照）

1. 明确 **middleware 分流**替代失效的 CF-IPCountry，并给出**对 SEO 友好**的正确姿势（hreflang + 不跟随 IP 跳爬虫）。
2. 补 **RLS 策略 + `admin_users` 白名单**——原 v1 只说"RLS 关闭前不开放写"，本方案给出可执行的策略红线。
3. 补 **CI 推包完整时序 + 密钥模型 + 发版/上架解耦**。
4. 补 **看板性能演进（物化视图）+ UV 用 anon_id 口径 + bot 过滤**。
5. 把 **对标文案变成 `/vs/[slug]` 内容矩阵**——SEO 从"技术 SEO"升级为"内容获客"，这是无为最省钱的流量入口。
6. 标出 **定价种子不一致**、**国内备案对百度 SEO 是硬门槛** 两个坑，请董事长拍板。

---

_本文仅为方案评审稿，未落任何代码、未动线上。CEO 审定后，我按 §10 分阶段落地。_
