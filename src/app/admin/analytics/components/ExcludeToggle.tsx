"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// 统计口径切换：默认排除本人+爬虫（ip_tags 标签 self/bot），?exclude=0 显示全部
export function ExcludeToggle({ isExcluding }: { isExcluding: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function toggle() {
    const next = new URLSearchParams(sp.toString());
    if (isExcluding) next.set("exclude", "0");
    else next.delete("exclude");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", marginBottom: 8 }}>
      <button
        onClick={toggle}
        style={{
          background: isExcluding ? "#5C8A73" : "#3A3A3A",
          color: "#E6E9EE",
          border: "none",
          borderRadius: 6,
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        {isExcluding ? "✅ 已排除本人+爬虫" : "👁 显示全部（含本人/爬虫）"}
      </button>
      {!isExcluding && (
        <span style={{ color: "#7A8590", fontSize: 12 }}>当前显示全部 IP 的数据</span>
      )}
    </div>
  );
}
