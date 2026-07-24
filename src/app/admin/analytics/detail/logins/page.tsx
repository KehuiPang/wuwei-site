import { notFound, redirect } from "next/navigation";
import { getLoginDetail } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";
import { AdminTopBar } from "../../components/AdminTopBar";
import { DetailLayout, Panel, DistBar, Empty, DataTable } from "../../components/DetailLayout";
import { SingleTrendChart } from "../../components/TrendCharts";

export const dynamic = "force-dynamic";
export const metadata = { title: "客户端登录详情 · 无为后台", robots: { index: false, follow: false } };

export default async function LoginsDetailPage() {
  const admin = await getAdmin();
  if (!admin) {
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  const data = await getLoginDetail(30);

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
      <DetailLayout title="客户端登录详情" icon="🔑">
        {/* 每日登录趋势 */}
        <Panel title="📈 每日登录趋势">
          {data.daily.length === 0 ? (
            <Empty hint="客户端登录上报接入后自动显示" />
          ) : (
            <SingleTrendChart data={data.daily} color="#8B6FC7" label="登录" />
          )}
        </Panel>

        {/* 每日登录明细表（可点击下钻） */}
        <Panel title="📋 每日登录明细（点击数字查看当日明细）">
          {data.daily.length === 0 ? (
            <Empty hint="客户端登录上报接入后自动显示" />
          ) : (
            <DataTable
              headers={["日期", "登录次数"]}
              rows={data.daily.map((d) => [d.key, String(d.count)])}
              links={data.daily.map((d) => [
                null,
                `/admin/analytics/detail/logins/${d.key}`,
              ])}
            />
          )}
        </Panel>

        {/* 分布区 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
          {data.byVersion.length > 0 && (
            <Panel title="📦 按版本分布">
              <DistBar items={data.byVersion} accent="var(--adm-gold)" />
            </Panel>
          )}
          {data.byPlatform.length > 0 && (
            <Panel title="💻 按平台分布">
              <DistBar items={data.byPlatform} accent="var(--adm-cyan)" />
            </Panel>
          )}
        </div>

        {/* 最近登录记录 */}
        <Panel title="📋 最近登录记录（近 50 条）">
          {data.recentLogins.length === 0 ? (
            <Empty hint="客户端登录上报接入后自动显示" />
          ) : (
            <DataTable
              headers={["时间", "匿名 ID", "版本", "平台"]}
              rows={data.recentLogins.map((l) => [
                l.created_at.slice(0, 16).replace("T", " "),
                l.anon_id.slice(0, 12) + "…",
                l.version,
                l.platform,
              ])}
            />
          )}
        </Panel>
      </DetailLayout>
    </>
  );
}
