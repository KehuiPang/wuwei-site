import { notFound, redirect } from "next/navigation";
import { getDayPvDetail } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "../../../components/AdminTopBar";
import { DetailLayout, Panel, DistBar, Empty } from "../../../components/DetailLayout";

export const dynamic = "force-dynamic";
export const metadata = { title: "单日 PV 明细 · 无为后台", robots: { index: false, follow: false } };

export default async function DayPvPage({ params }: { params: Promise<{ day: string }> }) {
  const admin = await getAdmin();
  if (!admin) {
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  const { day } = await params;
  const data = await getDayPvDetail(day);

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
      <DetailLayout title={`${day} 访问明细`} icon="👁">
        {/* 当日汇总 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={summaryCard}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--adm-indigo)" }}>{data.pv}</div>
            <div style={{ fontSize: 13, color: "var(--adm-dim)" }}>页面访问 PV</div>
          </div>
          <div style={summaryCard}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--adm-bamboo)" }}>{data.uv}</div>
            <div style={{ fontSize: 13, color: "var(--adm-dim)" }}>独立访客 UV</div>
          </div>
        </div>

        {/* 分布区 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
          {data.topReferers.length > 0 && (
            <Panel title="🔗 来源分布">
              <DistBar items={data.topReferers} accent="var(--adm-indigo)" />
            </Panel>
          )}
          {data.topLanding.length > 0 && (
            <Panel title="📄 落地页分布">
              <DistBar items={data.topLanding} accent="var(--adm-spark)" />
            </Panel>
          )}
          {data.topCountries.length > 0 && (
            <Panel title="🌍 国家/地区">
              <DistBar items={data.topCountries} accent="var(--adm-bamboo)" />
            </Panel>
          )}
        </div>

        {data.pv === 0 && <Empty hint="当日无访问数据" />}
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
