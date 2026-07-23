"use client";
// Hero 核心视觉 · 可交互对话输入框（视觉+交互 demo，不连后端）
// —— 打字、示例提示词轮播、点发送 → 引导下载客户端体验完整版。
// 无为 VI：玄墨黑底 / 靛青描边 / 一点朱发送键 / 月白字。尊重 prefers-reduced-motion。
import { useEffect, useRef, useState } from "react";

export type HeroChatBoxProps = {
  lang: "zh" | "en";
  /** 下载区锚点（默认 #price，定价区有下载按钮） */
  downloadHref?: string;
};

const PROMPTS: Record<"zh" | "en", string[]> = {
  zh: [
    "把这份 sales.xlsx 清洗好，导出 CSV 再画张趋势图",
    "重构项目里的支付模块，加单元测试",
    "读这个代码库，给我写份架构文档",
    "把这堆会议纪要整理成一份周报",
  ],
  en: [
    "Clean up sales.xlsx, export CSV and plot a trend",
    "Refactor the payment module and add unit tests",
    "Read this codebase and write an architecture doc",
    "Turn these meeting notes into a weekly report",
  ],
};

const COPY = {
  zh: {
    send: "发送",
    hint: "下载客户端，体验完整版",
    modalTitle: "这只是个演示 ✦",
    modalBody: "真正的无为住在客户端里——下载它，说句人话，活就自己干完了。",
    modalCta: "▼ 免费下载 · 30 秒上手",
    modalGhost: "再看看",
  },
  en: {
    send: "Send",
    hint: "Download the client for the full experience",
    modalTitle: "This is just a demo ✦",
    modalBody: "The real Wuwei lives in the client — download it, say it in plain words, and the work gets done.",
    modalCta: "▼ Download Free · 30-sec start",
    modalGhost: "Keep looking",
  },
};

export function HeroChatBox({ lang, downloadHref = "#price" }: HeroChatBoxProps) {
  const t = COPY[lang];
  const prompts = PROMPTS[lang];
  const [value, setValue] = useState("");
  const [pi, setPi] = useState(0);           // 当前轮播到第几条
  const [typed, setTyped] = useState("");    // 轮播占位符已打出的字
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);   // 引导下载 modal
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 示例提示词打字轮播（仅在输入框为空且未聚焦时展示）
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) { setTyped(prompts[0]); return; }
    if (value || focused) return; // 用户接管时停轮播

    let ci = 0;
    let timer: ReturnType<typeof setTimeout>;
    const full = prompts[pi];
    const tick = () => {
      if (ci <= full.length) {
        setTyped(full.slice(0, ci));
        ci += 1;
        timer = setTimeout(tick, 55);
      } else {
        // 停留后切下一条
        timer = setTimeout(() => {
          setTyped("");
          setPi((p) => (p + 1) % prompts.length);
        }, 2400);
      }
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [pi, value, focused, prompts]);

  // Esc 关 modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = () => {
    setOpen(true);
  };

  const goDownload = () => {
    setOpen(false);
    document.querySelector(downloadHref)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={"hero-chat" + (focused ? " focus" : "")}>
      <div className="hc-box">
        <textarea
          ref={taRef}
          className="hc-input"
          rows={2}
          value={value}
          placeholder={typed || " "}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          aria-label={lang === "zh" ? "对无为说出你的需求" : "Tell Wuwei what you need"}
        />
        <button type="button" className="hc-send" onClick={submit} aria-label={t.send}>
          <span className="hc-send-txt">{t.send}</span>
          <svg className="hc-send-ic" viewBox="0 0 24 24" width="18" height="18" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <button type="button" className="hc-hint" onClick={goDownload}>
        {t.hint} <span className="hc-hint-arrow">↓</span>
      </button>

      {open && (
        <div className="hc-mask" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="hc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hc-modal-title">{t.modalTitle}</div>
            {value.trim() && <div className="hc-modal-echo">「{value.trim()}」</div>}
            <p className="hc-modal-body">{t.modalBody}</p>
            <div className="hc-modal-btns">
              <button type="button" className="btn btn-p hc-modal-cta" onClick={goDownload}>{t.modalCta}</button>
              <button type="button" className="btn btn-g" onClick={() => setOpen(false)}>{t.modalGhost}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
