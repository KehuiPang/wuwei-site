import Link from "next/link";

// 详情页通用布局：返回链接 + 标题 + 内容区
export function DetailLayout({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div style={s.page}>
      <div style={s.container}>
        <Link href="/admin/analytics" style={s.back}>
          ← 返回仪表盘
        </Link>
        <div style={s.header}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <h1 style={s.title}>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

// 详情页通用面板
export function Panel({
  title,
  children,
  flex,
}: {
  title: string;
  children: React.ReactNode;
  flex?: number;
}) {
  return (
    <div style={{ ...s.panel, ...(flex ? { flex } : {}) }}>
      <div style={s.panelHeader}>
        <span style={s.panelTitle}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// 分布条形图（复用仪表盘样式）
export function DistBar({ items, accent }: { items: { key: string; count: number }[]; accent: string }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
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
  );
}

// 空态
export function Empty({ hint }: { hint?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--adm-dim)", fontSize: 13 }}>
      <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>📊</div>
      <div>暂无数据</div>
      {hint && <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>{hint}</div>}
    </div>
  );
}

// 数据表
export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={s.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ ...s.th, textAlign: i > 0 ? ("right" as const) : ("left" as const) }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    ...s.td,
                    textAlign: j > 0 ? ("right" as const) : ("left" as const),
                    fontWeight: j > 0 ? 600 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
  back: {
    display: "inline-block",
    fontSize: 13,
    color: "var(--adm-dim)",
    textDecoration: "none",
    marginBottom: 16,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
  },
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
  distRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  distLabel: {
    fontSize: 12,
    color: "var(--adm-dim)",
    width: 120,
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
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    padding: "8px 12px",
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
    fontVariantNumeric: "tabular-nums",
  },
};
