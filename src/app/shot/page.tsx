import type { Metadata } from "next";
import "../landing.css";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { HeroDemo } from "@/components/HeroDemo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "无为截 — 截图，会思考了 | 框住屏幕，AI 直接读懂",
  description:
    "过去截图只是复制一堆像素。无为截让你框住屏幕上任何东西，AI 直接读懂：翻译、识别、追问、变成下一步。一按即截，还带标注。免费、轻量。",
  alternates: {
    canonical: "https://wuweiai.io/shot",
    languages: {
      "zh-CN": "https://wuweiai.io/shot",
      en: "https://wuweiai.io/en/shot",
      "x-default": "https://wuweiai.io/en/shot",
    },
  },
  openGraph: {
    title: "无为截 — 截图，会思考了 | 框住屏幕，AI 直接读懂",
    description:
      "过去截图只是复制一堆像素。无为截让你框住屏幕上任何东西，AI 直接读懂：翻译、识别、追问、变成下一步。一按即截，还带标注。免费、轻量。",
    url: "https://wuweiai.io/shot",
  },
  twitter: {
    card: "summary_large_image",
    title: "无为截 — 截图，会思考了 | 框住屏幕，AI 直接读懂",
    description:
      "过去截图只是复制一堆像素。无为截让你框住屏幕上任何东西，AI 直接读懂：翻译、识别、追问、变成下一步。一按即截，还带标注。免费、轻量。",
  },
  keywords: [
    "无为截",
    "AI截图",
    "智能截图",
    "截图OCR",
    "截图翻译",
    "屏幕截图工具",
    "免费截图工具",
    "跨平台截图",
    "AI屏幕识别",
    "截图标注",
  ],
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "无为截",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Windows, macOS, Linux",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY",
        "availability": "https://schema.org/InStock"
      },
      "description": "AI 截图工具。框住屏幕上任何东西，AI 直接读懂：翻译、识别、追问、变成下一步。一按即截，免费、轻量。",
      "url": "https://wuweiai.io/shot",
      "downloadUrl": "https://wuweiai.io/api/download?product=shot&platform=windows",
      "softwareVersion": "1.0",
      "inLanguage": "zh-CN",
      "publisher": {
        "@type": "Organization",
        "name": "无为 Wuwei",
        "url": "https://wuweiai.io"
      }
    },
    {
      "@type": "Organization",
      "name": "无为 Wuwei",
      "url": "https://wuweiai.io",
      "logo": "https://wuweiai.io/favicon.ico",
      "description": "把 Claude Code / Codex 那种极客专属的强，做成普通人零门槛、免费、丝滑就能用的 AI 工具。"
    }
  ]
};

function WuMark({ className, stroke = 12, dot = 10 }: { className?: string; stroke?: number; dot?: number }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-label="无为截">
      <g transform="rotate(-8 120 118)">
        <path d="M152.04 193.48 A82 82 0 1 1 195.48 150.04" fill="none"
          stroke="var(--color-paper)" strokeWidth={stroke} strokeLinecap="round" />
        <circle cx="195.48" cy="150.04" r={dot} fill="var(--color-spark)" />
      </g>
    </svg>
  );
}

const FEATURES = [
  {
    n: "01",
    title: "一按即截，顺手即得",
    desc: "Alt+A 拖框、✓ 确认，截图自动进剪贴板，随处 Ctrl+V。不打断你手上的事。",
  },
  {
    n: "02",
    title: "框住，它就读懂",
    desc: "外文一框就译，文字一框就提，图表一框就解。你要的是里面的意思，不是那张图——它给你意思。",
  },
  {
    n: "03",
    title: "截完，直接问",
    desc: "不用另存再上传。截完就能问无为 AI：这是什么、怎么改、帮我写。所见，即可问。",
  },
  {
    n: "04",
    title: "标注够用就好",
    desc: "箭头、文字、马赛克，该圈的圈、该遮的遮。克制，不堆一屏用不上的按钮。",
  },
  {
    n: "05",
    title: "轻到你忘了它在",
    desc: "跨平台、体积小、常驻不占地方。道法自然，交互如呼吸。",
  },
];

export default function ShotPage() {
  return (
    <div className="wu-land">
      <Track path="/shot" />
      <Reveal />

      {/* ——— 导航 ——— */}
      <nav className="nav"><div className="wrap">
        <a className="brand" href="#top">
          <WuMark stroke={12} dot={10} />
          <span><span className="zh">无为截</span> <span className="en">WUWEI SHOT</span></span>
        </a>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#feature">功能</a>
            <a href="#how">怎么用</a>
            <a href="#story">无为·截</a>
          </div>
          <a className="nav-cta" href="#download">免费下载</a>
        </div>
      </div></nav>
      <span id="top"></span>

      {/* ——— Hero ——— */}
      <header className="hero"><div className="wrap">
        <WuMark className="logo" stroke={9} dot={7.4} />
        <h1>截图，<span className="spark">会思考了</span>。</h1>
        <div className="en">SCREENSHOTS THAT THINK.</div>
        <p className="vp">
          <b>无为截，框住屏幕上任何东西，AI 直接读懂。</b><br/>
          <span className="dim">一段外文、一条报错、一张图表。它不再只是复制像素，而是读懂你框住的意图：一步翻译、识别、直接追问 AI。截图，从"复制画面"变成"复制意图"。</span>
        </p>
        <div className="claims">
          <span className="claim">一按即截</span>
          <span className="claim">框住就读懂</span>
          <span className="claim">截完直接问</span>
          <span className="claim">标注够用</span>
          <span className="claim">轻量免费</span>
        </div>
        <div className="btns" id="download">
          <a className="btn btn-p" href="/api/download?product=shot&platform=windows">▼ 免费下载无为截</a>
          <a className="btn btn-g" href="#how">看它如何工作</a>
        </div>
        <div className="plat">免费开始 · 国内直连　|　Windows · macOS · Linux</div>

        <HeroDemo title="无为截 · 框住屏幕，AI 直接读懂" lines={[
          {role:"you", text:"你 ▸ Alt+A 框住一段英文报错"},
          {role:"wu", text:"无为截 ▸ 识别中…"},
          {role:"wu", text:"　　　 已提取文字、翻译成中文 ✓"},
          {role:"ok", text:"✓ 翻译结果已复制：「模块未找到：请检查依赖安装」"}
        ]} />

        <div className="trust">
          <div className="tt">框住什么，就懂什么</div>
          <div className="logos">
            <span className="chip"><b>外文</b></span>
            <span className="chip"><b>报错</b></span>
            <span className="chip"><b>图表</b></span>
            <span className="chip"><b>任何屏幕内容</b></span>
          </div>
        </div>
      </div></header>

      {/* ——— 转折：旧截图 → 新截图 ——— */}
      <section className="sec turn"><div className="wrap">
        <div className="row rv">
          <div className="side old"><div className="k">过去的截图</div>
            <p>几十年没变过：框一块屏幕，复制一堆像素。<br/>它一直很笨——你截下的是画面，不是意思；看得懂的，只有你自己。<b>截图只是复制像素。</b></p>
          </div>
          <div className="arrow">→</div>
          <div className="side new"><div className="k">无为截</div>
            <p>现在不一样了。<br/>你框住的东西，它读得懂。翻译、识别、追问、变成行动。<b>截图从复制画面，变成复制意图。</b></p>
          </div>
        </div>
      </div></section>

      {/* ——— 5 大卖点 ——— */}
      <section className="sec" id="feature"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Why WUWEI SHOT</div>
          <div className="h2">截图，<span className="zhu">会思考了</span></div>
          <p className="lead">截图本该像呼吸一样自然。无为截把复杂留给自己，把简单留给你——框住，它就懂。</p>
        </div>
        <div className="vals">
          {FEATURES.map((f) => (
            <div key={f.n} className="val rv">
              <div className="n">{f.n}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* ——— 功能演示区 ——— */}
      <section className="sec tint"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Features</div>
          <div className="h2">不止能截，更<span className="zhu">能懂你</span></div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">AI 识别</span>
            <h3>框住，它就读懂</h3>
            <p>外文一框就译，文字一框就提，图表一框就解。你要的是里面的意思，不是那张图——它给你意思。</p>
            <ul>
              <li>外文截图，一步翻译成中文</li>
              <li>报错信息，直接告诉你怎么修</li>
              <li>图表数据，自动提取成表格</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">无为截 · AI 识别</span></div>
            <div className="body">
              <div className="p">你 ▸</div>
              <div className="u">Alt+A 框住一段英文文档</div>
              <div className="d">　</div>
              <div className="g">无为截 ▸ OCR 识别中…</div>
              <div className="g">　　　 已提取文字、翻译成中文 ✓</div>
              <div className="ok">✓ 翻译结果已复制，可直接粘贴</div>
            </div>
          </div>
        </div>

        <div className="frow rev rv">
          <div className="ftext">
            <span className="tag">截完即问</span>
            <h3>截完，直接问</h3>
            <p>不用另存再上传。截完就能问无为 AI：这是什么、怎么改、帮我写。所见，即可问。</p>
            <ul>
              <li>截完直接问 AI，不用切换窗口</li>
              <li>代码报错，问怎么修</li>
              <li>文档内容，问怎么总结</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">截完即问 · AI</span></div>
            <div className="body">
              <div className="d">你截了一张代码报错图</div>
              <div className="u">问：这个报错怎么解决？</div>
              <div className="d">　</div>
              <div className="g">无为 AI ▸ 分析报错信息…</div>
              <div className="ok">✓ 「这是依赖版本冲突，运行 npm install --force 即可」</div>
            </div>
          </div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">轻量标注</span>
            <h3>标注够用就好</h3>
            <p>箭头、文字、马赛克，该圈的圈、该遮的遮。克制，不堆一屏用不上的按钮。</p>
            <ul>
              <li>箭头、文字、马赛克，一键添加</li>
              <li>不堆功能，够用就好</li>
              <li>标注完直接复制或保存</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">标注 · 够用就好</span></div>
            <div className="body">
              <div className="g">你 ▸ 框住一张图表</div>
              <div className="d">　</div>
              <div className="g">无为截 ▸ 添加箭头指向关键数据</div>
              <div className="g">　　　 添加文字说明「Q3 增长 47%」</div>
              <div className="ok">✓ 标注完成，已复制到剪贴板</div>
            </div>
          </div>
        </div>
      </div></section>

      {/* ——— 三步上手 ——— */}
      <section className="sec" id="how"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">How it works</div>
          <div className="h2">三步，从<span className="zhu">框住</span>到<span className="zhu">读懂</span></div>
          <p className="lead">无为截把复杂留给自己，把简单留给你。你要做的，只有第一步。</p>
        </div>
        <div className="steps">
          <div className="step rv"><div className="num">一</div><h4>框住</h4><p>Alt+A 拖框，或者点一下托盘图标。不用切窗口，不用找菜单。</p></div>
          <div className="step rv"><div className="num">二</div><h4>确认</h4><p>✓ 确认，截图自动进剪贴板。AI 同时开始识别内容。</p></div>
          <div className="step rv"><div className="num">三</div><h4>使用</h4><p>粘贴到任何地方，或者直接问 AI。所见，即得。</p></div>
        </div>
      </div></section>

      {/* ——— 品牌故事 ——— */}
      <section className="sec story" id="story"><div className="wrap">
        <WuMark className="ens rv" stroke={8} dot={7} />
        <div className="line rv">一念既出，<span className="zhu">所见即得</span>。</div>
        <div className="para rv">
          截图这个动作，几十年没变过。<br/><br/>
          过去你截下一张图，得自己看懂它。现在，你框住的是意图，读懂它的事，交给无为。<b>一念既出，所见即得。</b><br/><br/>
          「截」是动作，也是结果：截下画面，截获意图。无为截，让屏幕上的一切，都变成可理解、可行动的信息。<br/><br/>
          这，就是 AI 该有的样子：<b>你框住，它读懂。无为，而无不为。</b>
        </div>
        <div className="sig rv">— 无为截 · 截图，会思考了</div>
      </div></section>

      {/* ——— 最终 CTA ——— */}
      <section className="sec final"><div className="wrap">
        <h2 className="rv">截图，<span className="spark">会思考了</span>。</h2>
        <p className="rv">把复制像素交出去，把复制意图还给自己。现在就开始，免费。</p>
        <div className="btns rv">
          <a className="btn btn-p" href="/api/download?product=shot&platform=windows">▼ 免费下载无为截</a>
          <a className="btn btn-g" href="#how">看它如何工作</a>
        </div>
        <div className="plat">Windows · macOS · Linux　|　免费开始，开箱即用</div>
      </div></section>

      {/* ——— 页脚 ——— */}
      <footer className="land-footer"><div className="wrap">
        <div className="frow2">
          <div className="fbrand"><WuMark stroke={12} dot={10} />无为截 · WUWEI SHOT</div>
          <div className="fmenu">
            <a href="#feature">功能</a>
            <a href="#how">怎么用</a>
            <a href="#story">无为·截</a>
            <a href="#download">下载</a>
          </div>
        </div>
        <div className="copy">一念既出，所见即得 · One intention. What you see is what you get. · © 2026 无为 Wuwei</div>
      </div></footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}
