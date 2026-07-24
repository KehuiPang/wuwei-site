import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDashboard } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "./components/AdminTopBar";
import { PvDownloadChart, SingleTrendChart } from "./components/TrendCharts";

// 后台统计看板：访问/下载/激活/使用/登录 数据汇总
export const dynamic = "force-dynamic";

export const metadata = {
  title: "无为 · 数据后台",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  // 服务端鉴权（fail-closed）：未登录 → 跳登录页；登录但不在 admin_users 白名单 → 404
  const admin = await getAdmin();
  if (!admin) {
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  let dashboard;
  try {
    dashboard = await getDashboard(30);
  } catch {
    dashboard = null;
  }

  if (!dashboard) {
    return (
      <div style={s.page}>
        <style>{ADMIN_CSS_VARS}</style>
        <AdminTopBar title="无为 · 数据后台" />
        <div style={s.container}>
          <div style={s.errorCard}>
            <p style={{ color: "var(--adm-dim)" }}>
              数据加载失败。请确认 Supabase 连接和 v_daily_stats 视图已创建。
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    totals,
    daily,
    loginsByDay,
    activationsByDay,
    usageByDay,
    downloadToActivateRate,
    dau,
    topReferers,
    topCountries,
    topLanding,
    clientVersions,
  } = dashboard;

  return (
    <div style={s.page}>
      <style>{ADMIN_CSS_VARS}</style>
      <AdminTopBar title="无为 · 数据后台" subtitle={`近 ${dashboard.windowDays} 天数据`} />

      <div style={s.container}>
        {/* —— 6 列核心指标卡（4 张可点击查看详情） —— */}
        <div style={s.statsGrid}>
          <Link href="/admin/analytics/detail/pv" style={s.statLink}>
            <StatCard label="页面访问 PV" value={totals.pv} icon="👁" accent="var(--adm-indigo)" clickable />
          </Link>
          <Link href="/admin/analytics/detail/uv" style={s.statLink}>
            <StatCard label="独立访客 UV" value={totals.uv} icon="👤" accent="var(--adm-bamboo)" clickable />
          </Link>
          <Link href="/admin/analytics/detail/downloads" style={s.statLink}>
            <StatCard label="下载次数" value={totals.downloads} icon="⬇" accent="var(--adm-spark)" clickable />
          </Link>
          <StatCard label="客户端激活" value={totals.activations} icon="⚡" accent="var(--adm-gold)" />
          <StatCard label="今日活跃客户端" value={dau} icon="📱" accent="var(--adm-cyan)" />
          <Link href="/admin/analytics/detail/logins" style={s.statLink}>
            <StatCard label="客户端登录" value={totals.logins} icon="🔑" accent="var(--adm-purple)" clickable />
          </Link>
        </div>

        {/* —— 下载→激活转化率 —— */}
        <div style={s.conversionPanel}>
          <div style={s.conversionLeft}>
            <span style={{ fontSize: 28 }}>🔄</span>
            <div>
              <div style={{ fontSize: 13, color: "var(--adm-dim)" }}>下载 → 激活转化率</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: downloadToActivateRate > 0 ? "var(--adm-gold)" : "var(--adm-dim)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {downloadToActivateRate > 0 ? `${downloadToActivateRate}%` : "—"}
              </div>
            </div>
          </div>
          <div style={s.conversionRight}>
            <div style={s.conversionStat}>
              <span style={s.conversionNum}>{totals.downloads.toLocaleString()}</span>
              <span style={s.conversionLabel}>下载</span>
            </div>
            <span style={{ color: "var(--adm-dim)", fontSize: 20 }}>→</span>
            <div style={s.conversionStat}>
              <span style={{ ...s.conversionNum, color: "var(--adm-gold)" }}>
                {totals.activations.toLocaleString()}
              </span>
              <span style={s.conversionLabel}>激活</span>
            </div>
          </div>
          {totals.activations === 0 && (
            <div style={{ fontSize: 12, color: "var(--adm-dim)", marginTop: 8, width: "100%" }}>
              客户端激活上报尚未接入，接入后自动显示数据
            </div>
          )}
        </div>

        {/* —— 每日访问/下载趋势（全宽） —— */}
        <div style={s.panel}>
          <div style={s.panelHeader}>
            <span style={s.panelTitle}>📈 每日访问 / 下载趋势</span>
          </div>
          {daily.length === 0 ? (
            <Empty />
          ) : (
            <PvDownloadChart data={daily} />
          )}
        </div>

        {/* —— 客户端三维度趋势（三列并排） —— */}
        <div style={s.chartsRow}>
          {/* 客户端激活趋势 */}
          <div style={{ ...s.panel, flex: 1, marginBottom: 0 }}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>⚡ 客户端激活趋势</span>
            </div>
            {activationsByDay.length === 0 ? (
              <EmptyWithHint hint="客户端激活上报接入后自动显示" />
            ) : (
              <SingleTrendChart data={activationsByDay} color="#D4A853" label="激活" />
            )}
          </div>

          {/* 客户端使用趋势 */}
          <div style={{ ...s.panel, flex: 1, marginBottom: 0 }}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>📱 每日客户端使用</span>
            </div>
            {usageByDay.length === 0 ? (
              <EmptyWithHint hint="客户端使用上报接入后自动显示" />
            ) : (
              <SingleTrendChart data={usageByDay} color="#4AADA8" label="使用" />
            )}
          </div>

          {/* 客户端登录趋势 */}
          <div style={{ ...s.panel, flex: 1, marginBottom: 0 }}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>🔑 客户端登录趋势</span>
            </div>
            {loginsByDay.length === 0 ? (
              <EmptyWithHint hint="客户端登录上报接入后自动显示" />
            ) : (
              <SingleTrendChart data={loginsByDay} color="#8B6FC7" label="登录" />
            )}
          </div>
        </div>

        {/* —— 分布数据区（三列网格） —— */}
        <div style={s.distGrid}>
          {topReferers.length > 0 && (
            <DistPanel title="🔗 来源 Top 8" items={topReferers} accent="var(--adm-indigo)" />
          )}
          {topCountries.length > 0 && (
            <DistPanel title="🌍 国家/地区 Top 8" items={topCountries} accent="var(--adm-bamboo)" />
          )}
          {topLanding.length > 0 && (
            <DistPanel title="📄 落地页 Top 8" items={topLanding} accent="var(--adm-spark)" />
          )}
        </div>

        {/* —— 客户端版本 —— */}
        {clientVersions.length > 0 && (
          <div style={s.panel}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>📦 客户端版本分布</span>
            </div>
            <div style={s.versionGrid}>
              {clientVersions.map((v) => (
                <div key={v.key} style={s.versionCard}>
                  <div style={s.versionName}>{v.key}</div>
                  <div style={s.versionCount}>{v.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* —— 每日明细表（可折叠，数字可点击下钻） —— */}
        <details style={s.panel}>
          <summary style={s.detailsSummary}>📋 每日明细数据（点击数字查看当日明细）</summary>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>日期</th>
                  <th style={{ ...s.th, textAlign: "right" }}>PV</th>
                  <th style={{ ...s.th, textAlign: "right" }}>UV</th>
                  <th style={{ ...s.th, textAlign: "right" }}>下载</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((d) => (
                  <tr key={d.day}>
                    <td style={s.td}>{d.day}</td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: 600 }}>
                      <Link href={`/admin/analytics/detail/pv/${d.day}`} style={s.cellLink}>
                        {d.pv.toLocaleString()}
                      </Link>
                    </td>
                    <td style={{ ...s.td, textAlign: "right" }}>
                      <Link href={`/admin/analytics/detail/pv/${d.day}`} style={s.cellLink}>
                        {d.uv.toLocaleString()}
                      </Link>
                    </td>
                    <td style={{ ...s.td, textAlign: "right" }}>
                      <Link href={`/admin/analytics/detail/downloads/${d.day}`} style={{ ...s.cellLink, color: "var(--adm-spark)" }}>
                        {d.downloads.toLocaleString()}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}

// ============================================================
// 子组件
// ============================================================

function StatCard({
  label,
  value,
  icon,
  accent,
  clickable,
}: {
  label: string;
  value: number;
  icon: string;
  accent: string;
  clickable?: boolean;
}) {
  return (
    <div
      style={{
        ...s.statCard,
        ...(clickable ? s.statCardClickable : {}),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {clickable && (
            <span style={{ fontSize: 11, color: "var(--adm-dim)", opacity: 0.6 }}>详情 →</span>
          )}
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, opacity: 0.7 }} />
        </div>
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--adm-paper)",
          margin: "12px 0 4px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 13, color: "var(--adm-dim)" }}>{label}</div>
    </div>
  );
}

function DistPanel({
  title,
  items,
  accent,
}: {
  title: string;
  items: { key: string; count: number }[];
  accent: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div style={s.panel}>
      <div style={s.panelHeader}>
        <span style={s.panelTitle}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <div key={item.key} style={s.distRow}>
            <div style={s.distLabel} title={item.key}>
              {item.key}
            </div>
            <div style={s.distBarWrap}>
              <div
                style={{
                  ...s.distBar,
                  width: `${(item.count / max) * 100}%`,
                  background: accent,
                }}
              />
            </div>
            <div style={s.distValue}>{item.count.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "var(--adm-dim)", fontSize: 14 }}>
      暂无数据
    </div>
  );
}

function EmptyWithHint({ hint }: { hint: string }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--adm-dim)", fontSize: 13 }}>
      <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>📊</div>
      <div>暂无数据</div>
      <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>{hint}</div>
    </div>
  );
}

// ============================================================
// Admin 深色 CSS 变量（内联注入，不依赖全局 CSS）
// ============================================================

const ADMIN_CSS_VARS = `
  :root {
    --adm-bg: #0E1116;
    --adm-surface: #161B22;
    --adm-surface2: #1C2330;
    --adm-border: #2A3340;
    --adm-paper: #E6E9EE;
    --adm-dim: #7A8590;
    --adm-indigo: #5B7FBF;
    --adm-bamboo: #5C8A73;
    --adm-spark: #C05F3C;
    --adm-gold: #D4A853;
    --adm-cyan: #4AADA8;
    --adm-purple: #8B6FC7;
  }
  @media (max-width: 768px) {
    .adm-charts-row { flex-direction: column !important; }
  }
  /* 可点击指标卡 hover 效果 */
  a[style] > div[style]:hover {
    border-color: var(--adm-dim) !important;
    transform: translateY(-1px);
  }
`;

// ============================================================
// 样式 —— 深色 dashboard 风
// ============================================================

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--adm-bg)",
    color: "var(--adm-paper)",
    fontFamily: "var(--font-sans)",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 24px 64px",
  },
  errorCard: {
    background: "var(--adm-surface)",
    border: "1px solid var(--adm-border)",
    borderRadius: 12,
    padding: 32,
    textAlign: "center" as const,
  },

  // 6 列指标卡
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "var(--adm-surface)",
    border: "1px solid var(--adm-border)",
    borderRadius: 12,
    padding: "20px 20px 16px",
    transition: "border-color 0.2s, transform 0.15s",
  },
  statCardClickable: {
    cursor: "pointer",
  },
  statLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  // 转化率面板
  conversionPanel: {
    background: "var(--adm-surface)",
    border: "1px solid var(--adm-border)",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: 16,
  },
  conversionLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  conversionRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  conversionStat: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  conversionNum: {
    fontSize: 24,
    fontWeight: 700,
    color: "var(--adm-paper)",
    fontVariantNumeric: "tabular-nums",
  },
  conversionLabel: {
    fontSize: 12,
    color: "var(--adm-dim)",
    marginTop: 2,
  },

  // 图表区
  chartsRow: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap" as const,
  },

  // 分布面板
  distGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  distRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  distLabel: {
    fontSize: 12,
    color: "var(--adm-dim)",
    width: 100,
    flexShrink: 0,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  distBarWrap: {
    flex: 1,
    height: 16,
    background: "var(--adm-surface2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  distBar: {
    height: "100%",
    borderRadius: 4,
    minWidth: 2,
    transition: "width 0.3s",
  },
  distValue: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--adm-paper)",
    width: 40,
    textAlign: "right" as const,
    flexShrink: 0,
    fontVariantNumeric: "tabular-nums",
  },

  // 版本卡片
  versionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 12,
  },
  versionCard: {
    background: "var(--adm-surface2)",
    borderRadius: 8,
    padding: "12px 16px",
    textAlign: "center" as const,
  },
  versionName: {
    fontSize: 13,
    color: "var(--adm-dim)",
    marginBottom: 4,
  },
  versionCount: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--adm-paper)",
    fontVariantNumeric: "tabular-nums",
  },

  // 面板通用
  panel: {
    background: "var(--adm-surface)",
    border: "1px solid var(--adm-border)",
    borderRadius: 12,
    padding: 20,
    minWidth: 0,
    marginBottom: 24,
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid var(--adm-border)",
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: 600,
  },

  // 明细表
  detailsSummary: {
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: "var(--adm-dim)",
    userSelect: "none" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    padding: "8px 12px",
    textAlign: "left" as const,
    fontWeight: 600,
    fontSize: 12,
    color: "var(--adm-dim)",
    borderBottom: "1px solid var(--adm-border)",
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "8px 12px",
    borderBottom: "1px solid var(--adm-border)",
    verticalAlign: "top" as const,
  },
  cellLink: {
    color: "var(--adm-indigo)",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "1px dashed transparent",
    transition: "border-color 0.15s",
  },
};
