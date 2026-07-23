"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export function AdminTopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div style={s.topbar}>
      <div style={s.left}>
        <span style={s.logo}>⬡</span>
        <span style={s.title}>{title}</span>
        {subtitle && <span style={s.subtitle}>{subtitle}</span>}
      </div>
      <div style={s.right}>
        <button onClick={handleRefresh} style={s.btn} title="刷新数据">
          ↻ 刷新
        </button>
        <button onClick={handleLogout} style={{ ...s.btn, ...s.btnDanger }} title="退出登录">
          退出
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    borderBottom: "1px solid var(--adm-border)",
    background: "var(--adm-surface)",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontSize: 20,
    color: "var(--adm-indigo)",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "var(--adm-paper)",
  },
  subtitle: {
    fontSize: 13,
    color: "var(--adm-dim)",
    marginLeft: 4,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    padding: "6px 14px",
    fontSize: 13,
    borderRadius: 8,
    border: "1px solid var(--adm-border)",
    background: "var(--adm-surface2)",
    color: "var(--adm-paper)",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  btnDanger: {
    color: "#e0645a",
    borderColor: "rgba(224,100,90,.3)",
  },
};
