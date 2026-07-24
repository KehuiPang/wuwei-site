"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

// 产品切换器：按 meta->>product 过滤总览数据（全部/本尊/念/截）
const PRODUCTS = [
  { key: "", label: "🌐 全部" },
  { key: "site", label: "🏠 本尊" },
  { key: "voice", label: "🎤 念" },
  { key: "shot", label: "📷 截" },
];

export function ProductSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function select(key: string) {
    const next = new URLSearchParams(sp.toString());
    if (key) next.set("product", key);
    else next.delete("product");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {PRODUCTS.map((p) => {
        const active = current === p.key;
        return (
          <button
            key={p.key}
            onClick={() => select(p.key)}
            style={{
              padding: "6px 16px",
              fontSize: 13,
              borderRadius: 8,
              border: active ? "1px solid #5B7FBF" : "1px solid var(--adm-border, #3A3A3A)",
              background: active ? "#5B7FBF" : "var(--adm-surface2, #2A2A2A)",
              color: active ? "#FFFFFF" : "var(--adm-paper, #E6E9EE)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
