import { notFound } from "next/navigation";

// 后台入口。始终动态渲染（读 ?key= 做访问校验）。
export const dynamic = "force-dynamic";

export const metadata = {
  title: "后台",
  robots: { index: false, follow: false }, // 后台不进搜索引擎
};

type SP = { key?: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const key = typeof sp.key === "string" ? sp.key : "";

  // —— 最简访问保护：?key= 必须等于 server-only 的 ADMIN_ACCESS_KEY ——
  const expected = process.env.ADMIN_ACCESS_KEY ?? "";
  if (!expected || key !== expected) {
    notFound();
  }

  const wrap: React.CSSProperties = {
    maxWidth: 520,
    margin: "0 auto",
    padding: "56px 24px",
    fontFamily: "var(--font-sans)",
    color: "var(--color-ink)",
  };
  const card: React.CSSProperties = {
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
    borderRadius: 16,
    padding: 28,
  };
  const btnBase: React.CSSProperties = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid var(--color-border-strong)",
  };

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        无为 · 后台
      </h1>
      <p style={{ color: "var(--color-dim)", fontSize: 14, marginBottom: 24 }}>
        站点已锁定深色主题。
      </p>

      <div style={card}>
        <div style={{ fontSize: 15, marginBottom: 20 }}>
          快捷入口
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={`/admin/operations?key=${encodeURIComponent(key)}`}
            style={{
              ...btnBase,
              background: "var(--color-water)",
              color: "#F4F6F8",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            🎛️ 运营配置
          </a>
          <a
            href={`/admin/analytics?key=${encodeURIComponent(key)}`}
            style={{
              ...btnBase,
              background: "var(--color-bamboo)",
              color: "#F4F6F8",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            📊 访问统计
          </a>
        </div>
      </div>

      <p style={{ color: "var(--color-mute)", fontSize: 12, marginTop: 20 }}>
        访问受 ADMIN_ACCESS_KEY 保护，请勿分享带 key 的链接。
      </p>
    </main>
  );
}
