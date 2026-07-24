import { notFound, redirect } from "next/navigation";
import { getDayDownloadDetail } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "../../../components/AdminTopBar";
import { DetailLayout, Panel, DistBar, Empty } from "../../../components/DetailLayout";

export const dynamic = "force-dynamic";
export const metadata = { title: "单日下载明细 · 无为后台", robots: { index: false, follow: false } };

export default async function DayDownloadsPage({ params }: { params: Promise<{ day: string }> }) {
  const admin = await getAdmin();
  if (!admin) {
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  const { day } = await params;
  const data = await getDayDownloadDetail(day);

  return (
    <>
      <style>{`
        :root {
          --adm-bg: #0E1116; --adm-surface: #161B22; --adm-surface2: #1C2330;
          --adm-border: #2A3340; --adm-paper: #E6E9EE; --adm-dim: #7A8590;
          --adm-indigo: #5B7FBF; --adm-bamboo: #5C8A73; --adm-spark: #C05F3C;
          --adm-gold: #D4A853; --adm-cyan: #4AADA8; --adm-purple: #8B6FC7;
        }
      `}</style>
      <AdminTopBar title="无为 · 数据后台" />
      <DetailLayout title={`${day} 下载明细`} icon="⬇">
        {/* 当日汇总 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={summaryCard}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--adm-spark)" }}>{data.total}</div>
            <div style={{ fontSize: 13, color: "var(--adm-dim)" }}>总下载次数</div>
          </div>
        </div>

        {/* 分布区 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
          {data.byProduct.length > 0 && (
            <Panel title="📦 按产品分布">
              <DistBar items={data.byProduct} accent="var(--adm-gold)" />
            </Panel>
          )}
          {data.byPlatform.length > 0 && (
            <Panel title="💻 按平台分布">
              <DistBar items={data.byPlatform} accent="var(--adm-cyan)" />
            </Panel>
          )}
        </div>

        {data.total === 0 && <Empty hint="当日无下载数据" />}
      </DetailLayout>
    </>
  );
}

const summaryCard: React.CSSProperties = {
  background: "var(--adm-surface)",
  border: "1px solid var(--adm-border)",
  borderRadius: 12,
  padding: "20px 24px",
  minWidth: 160,
};
