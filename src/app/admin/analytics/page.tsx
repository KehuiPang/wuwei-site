import { notFound, redirect } from "next/navigation";
import { getDashboard } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "./components/AdminTopBar";

// 后台统计看板：访问/下载/激活/登录 数据汇总
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

  const { totals, daily, loginsByDay, topReferers, topCountries, topLanding, clientVersions } = dashboard;

  // 计算趋势图最大值（用于归一化柱高）
  const maxPv = Math.max(...daily.map((d) => d.pv), 1);
  const maxDl = Math.max(...daily.map((d) => d.downloads), 1);
  const maxLogin = Math.max(...loginsByDay.map((d) => d.count), 1);

  return (
    <div style={s.page}>
      <style>{ADMIN_CSS_VARS}</style>
      <AdminTopBar title="无为 · 数据后台" subtitle={`近 ${dashboard.windowDays} 天数据`} />

      <div style={s.container}>
        {/* —— 4 列核心指标卡 —— */}
        <div style={s.statsGrid}>
          <StatCard label="页面访问 PV" value={totals.pv} icon="👁" accent="var(--adm-indigo)" />
          <StatCard label="独立访客 UV" value={totals.uv} icon="👤" accent="var(--adm-bamboo)" />
          <StatCard label="下载次数" value={totals.downloads} icon="⬇" accent="var(--adm-spark)" />
          <StatCard label="客户端登录" value={totals.logins} icon="🔑" accent="var(--adm-gold)" />
        </div>

        {/* —— 趋势图表区（并排） —— */}
        <div style={s.chartsRow}>
          {/* 每日访问/下载趋势 */}
          <div style={{ ...s.panel, flex: 2 }}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>📈 每日访问 / 下载趋势</span>
              <div style={s.legend}>
                <span style={s.legendItem}>
                  <span style={{ ...s.legendDot, background: "var(--adm-indigo)" }} /> PV
                </span>
                <span style={s.legendItem}>
                  <span style={{ ...s.legendDot, background: "var(--adm-spark)" }} /> 下载
                </span>
              </div>
            </div>
            {daily.length === 0 ? (
              <Empty />
            ) : (
              <div style={s.chartWrap}>
                <div style={s.barChart}>
                  {daily.map((d) => (
                    <div key={d.day} style={s.barGroup}>
                      <div style={s.barPair}>
                        <div
                          style={{
                            ...s.bar,
                            height: `${Math.max((d.pv / maxPv) * 100, 2)}%`,
                            background: "var(--adm-indigo)",
                          }}
                          title={`${d.day} PV: ${d.pv}`}
                        />
                        <div
                          style={{
                            ...s.bar,
                            height: `${Math.max((d.downloads / maxDl) * 100, 2)}%`,
                            background: "var(--adm-spark)",
                          }}
                          title={`${d.day} 下载: ${d.downloads}`}
                        />
                      </div>
                      <div style={s.barLabel}>{d.day.slice(5)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 客户端登录趋势 */}
          <div style={{ ...s.panel, flex: 1 }}>
            <div style={s.panelHeader}>
              <span style={s.panelTitle}>🔑 客户端登录趋势</span>
            </div>
            {loginsByDay.length === 0 ? (
              <Empty />
            ) : (
              <div style={s.chartWrap}>
                <div style={s.barChart}>
                  {loginsByDay.map((d) => (
                    <div key={d.key} style={s.barGroup}>
                      <div style={s.barPair}>
                        <div
                          style={{
                            ...s.bar,
                            height: `${Math.max((d.count / maxLogin) * 100, 2)}%`,
                            background: "var(--adm-bamboo)",
                          }}
                          title={`${d.key}: ${d.count}`}
                        />
                      </div>
                      <div style={s.barLabel}>{d.key.slice(5)}</div>
                    </div>
                  ))}
                </div>
              </div>
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

        {/* —— 每日明细表（可折叠） —— */}
        <details style={s.panel}>
          <summary style={s.detailsSummary}>📋 每日明细数据</summary>
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
                    <td style={{ ...s.td, textAlign: "right", fontWeight: 600 }}>{d.pv.toLocaleString()}</td>
                    <td style={{ ...s.td, textAlign: "right" }}>{d.uv.toLocaleString()}</td>
                    <td style={{ ...s.td, textAlign: "right", color: "var(--adm-spark)", fontWeight: 600 }}>
                      {d.downloads.toLocaleString()}
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

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon: string; accent: string }) {
  return (
    <div style={s.statCard}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, opacity: 0.7 }} />
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: "var(--adm-paper)", margin: "12px 0 4px", fontVariantNumeric: "tabular-nums" }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 13, color: "var(--adm-dim)" }}>{label}</div>
    </div>
  );
}

function DistPanel({ title, items, accent }: { title: string; items: { key: string; count: number }[]; accent: string }) {
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
  }
  @media (max-width: 768px) {
    .adm-charts-row { flex-direction: column !important; }
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

  // 4 列指标卡
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "var(--adm-surface)",
    border: "1px solid var(--adm-border)",
    borderRadius: 12,
    padding: "20px 20px 16px",
  },

  // 图表区
  chartsRow: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap" as const,
  },
  chartWrap: {
    height: 180,
    display: "flex",
    alignItems: "flex-end",
    padding: "0 4px",
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 3,
    width: "100%",
    height: "100%",
  },
  barGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    minWidth: 0,
  },
  barPair: {
    display: "flex",
    gap: 2,
    alignItems: "flex-end",
    height: "calc(100% - 20px)",
    width: "100%",
    justifyContent: "center",
  },
  bar: {
    width: "45%",
    minWidth: 3,
    borderRadius: "3px 3px 0 0",
    transition: "height 0.3s",
  },
  barLabel: {
    fontSize: 10,
    color: "var(--adm-dim)",
    marginTop: 4,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  legend: {
    display: "flex",
    gap: 12,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "var(--adm-dim)",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    display: "inline-block",
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
};
