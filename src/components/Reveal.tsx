"use client";
// 滚动入场：观察 .wu-land 内所有 .rv，进入视口加 .in。
// 兜底：1.2s 后强制全部显现，任何环境都不会白屏（照 legacy 脚本逻辑 1:1）。
import { useEffect } from "react";

export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".wu-land .rv"));
    let io: IntersectionObserver | null = null;
    try {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      els.forEach((el) => io!.observe(el));
    } catch {
      els.forEach((el) => el.classList.add("in"));
    }
    // 兜底：无论 IO 是否触发，1.2s 后确保全部显现
    const t = setTimeout(() => els.forEach((el) => el.classList.add("in")), 1200);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
  }, []);
  return null;
}
