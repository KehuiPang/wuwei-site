import { notFound, redirect } from "next/navigation";
import { getDownloadDetail } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "../../components/AdminTopBar";
import { DetailLayout, Panel, DistBar, Empty, DataTable } from "../../components/DetailLayout";
import { SingleTrendChart } from "../../components/TrendCharts";

export const dynamic = "force-dynamic";
export const metadata = { title: "下载详情 · 无为后台", robots: { index: false, follow: false } };

export default async function DownloadsDetailPage() {
  const admin = await getAdmin();
  if (!admin) {
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  const data = await getDownloadDetail(30);

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
      <DetailLayout title="下载详情" icon="⬇">
        {/* 每日下载趋势 */}
        <Panel title="📈 每日下载趋势">
          {data.daily.length === 0 ? (
            <Empty />
          ) : (
            <SingleTrendChart data={data.daily} color="#C05F3C" label="下载" />
          )}
        </Panel>

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

        {/* 每日明细表 */}
        <Panel title="📋 每日下载明细">
          {data.daily.length === 0 ? (
            <Empty />
          ) : (
            <DataTable
              headers={["日期", "下载次数"]}
              rows={data.daily.map((d) => [d.key, String(d.count)])}
            />
          )}
        </Panel>
      </DetailLayout>
    </>
  );
}
