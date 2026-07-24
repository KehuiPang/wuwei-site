import { notFound, redirect } from "next/navigation";
import { getUvDetail } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "../../components/AdminTopBar";
import { DetailLayout, Panel, DistBar, Empty, DataTable } from "../../components/DetailLayout";
import { SingleTrendChart } from "../../components/TrendCharts";

export const dynamic = "force-dynamic";
export const metadata = { title: "UV 详情 · 无为后台", robots: { index: false, follow: false } };

export default async function UvDetailPage() {
  const admin = await getAdmin();
  if (!admin) {
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  const data = await getUvDetail(30);

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
      <DetailLayout title="独立访客 UV 详情" icon="👤">
        {/* 每日 UV 趋势 */}
        <Panel title="📈 每日独立访客趋势">
          {data.daily.length === 0 ? (
            <Empty />
          ) : (
            <SingleTrendChart
              data={data.daily.map((d) => ({ key: d.day, count: d.uv }))}
              color="#5C8A73"
              label="UV"
            />
          )}
        </Panel>

        {/* 分布区 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
          {data.topReferers.length > 0 && (
            <Panel title="🔗 来源分布（按 UV）Top 10">
              <DistBar items={data.topReferers} accent="var(--adm-indigo)" />
            </Panel>
          )}
          {data.topCountries.length > 0 && (
            <Panel title="🌍 国家/地区（按 UV）Top 10">
              <DistBar items={data.topCountries} accent="var(--adm-bamboo)" />
            </Panel>
          )}
          {data.topLanding.length > 0 && (
            <Panel title="📄 落地页（按 UV）Top 10">
              <DistBar items={data.topLanding} accent="var(--adm-spark)" />
            </Panel>
          )}
        </div>

        {/* 每日明细表（UV 数字可点击下钻） */}
        <Panel title="📋 每日 UV 明细（点击数字查看当日明细）">
          {data.daily.length === 0 ? (
            <Empty />
          ) : (
            <DataTable
              headers={["日期", "UV"]}
              rows={data.daily.map((d) => [d.day, String(d.uv)])}
              links={data.daily.map((d) => [
                null,
                `/admin/analytics/detail/pv/${d.day}`,
              ])}
            />
          )}
        </Panel>
      </DetailLayout>
    </>
  );
}
