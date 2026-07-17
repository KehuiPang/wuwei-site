// 一次性 P0 迁移脚本（临时，跑完即删；不 commit）。
// 读 secrets 的 Session pooler 连接串，依次执行 schema.sql → schema_p0.sql，然后自查。
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const ENV = "/home/dacheng/.openclaw/secrets/wuwei-deploy.env";
const DIR = "/home/dacheng/.openclaw/workspace/projects/wuwei-site/supabase";

function readEnv(key) {
  const txt = fs.readFileSync(ENV, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && m[1] === key) return m[2].trim();
  }
  throw new Error("env key not found: " + key);
}

async function main() {
  const conn = readEnv("SUPABASE_DB_URL"); // Session pooler:5432 (IPv4)
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("[connect] ok →", conn.replace(/:[^:@/]+@/, ":****@"));

  for (const f of ["schema.sql", "schema_p0.sql"]) {
    const sql = fs.readFileSync(path.join(DIR, f), "utf8");
    await client.query(sql);
    console.log("[apply]", f, "ok");
  }

  console.log("\n===== 自查 =====");
  const q = async (label, sql) => {
    const r = await client.query(sql);
    console.log("\n#", label);
    console.table(r.rows);
  };

  await q("public 表", `select tablename from pg_tables where schemaname='public' order by 1`);
  await q("RLS 开关", `select relname, relrowsecurity as rls from pg_class
     where relname in ('releases','pricing_plans','site_config','analytics_events','client_events','admin_users')
     order by 1`);
  await q("RLS 策略", `select tablename, policyname, roles, cmd from pg_policies
     where schemaname='public' order by tablename, policyname`);
  await q("定价种子", `select region, plan_key, name, price, currency, period, is_active
     from pricing_plans order by region, sort_order`);
  await q("看板视图 reloptions", `select relname, reloptions from pg_class where relname='v_daily_stats'`);
  await q("Storage 桶", `select id, name, public from storage.buckets where id='releases'`);
  await q("is_admin 函数", `select proname, prosecdef as security_definer from pg_proc where proname='is_admin'`);

  await client.end();
  console.log("\n[done] P0 迁移完成");
}
main().catch((e) => { console.error("[ERR]", e.message); process.exit(1); });
