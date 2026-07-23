import type { Metadata } from "next";
import "../landing.css";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { HeroDemo } from "@/components/HeroDemo";
import { AuthButton } from "@/components/AuthButton";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "无为念 — 让表达，追上思考 | AI 时代的语音输入",
  description:
    "打字让我们迁就了机器几十年。无为念把它翻过来：你只管开口，话实时落成文字、自动润色，进你正在打字的地方。免费、跨平台、中文友好、数据本地。",
  alternates: {
    canonical: "https://wuweiai.io/voice",
    languages: {
      "zh-CN": "https://wuweiai.io/voice",
      en: "https://wuweiai.io/en/voice",
      "x-default": "https://wuweiai.io/en/voice",
    },
  },
  openGraph: {
    title: "无为念 — 让表达，追上思考 | AI 时代的语音输入",
    description:
      "打字让我们迁就了机器几十年。无为念把它翻过来：你只管开口，话实时落成文字、自动润色，进你正在打字的地方。免费、跨平台、中文友好、数据本地。",
    url: "https://wuweiai.io/voice",
  },
  twitter: {
    card: "summary_large_image",
    title: "无为念 — 让表达，追上思考 | AI 时代的语音输入",
    description:
      "打字让我们迁就了机器几十年。无为念把它翻过来：你只管开口，话实时落成文字、自动润色，进你正在打字的地方。免费、跨平台、中文友好、数据本地。",
  },
  keywords: [
    "无为念",
    "语音输入",
    "AI语音",
    "语音转文字",
    "免费语音输入",
    "跨平台语音输入",
    "本地语音识别",
    "中文语音输入",
    "AI听写",
    "按住说话",
  ],
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "无为念",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Windows, macOS, Linux",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CNY",
        "availability": "https://schema.org/InStock"
      },
      "description": "AI 时代的语音输入工具。按住说话，实时转文字，自动润色，落进你正在打字的地方。免费、跨平台、中文友好、数据本地。",
      "url": "https://wuweiai.io/voice",
      "downloadUrl": "https://wuweiai.io/api/download?product=voice&platform=windows",
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
    <svg viewBox="0 0 240 240" className={className} aria-label="无为念">
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
    title: "按住说，松手成文",
    desc: "微信、文档、浏览器，光标在哪，字就落在哪。不切窗口、不复制粘贴——说完就在那儿了。",
  },
  {
    n: "02",
    title: "AI 替你把话说圆",
    desc: "不是生硬的听写。口误、重复、缺的标点，它顺手补齐，落下来就是能直接发出去的一段话。",
  },
  {
    n: "03",
    title: "中文越用越懂你",
    desc: "中文识别准，中英混、术语、人名都接得住。自带私人记忆库，你常用的词它记得住，越用越贴。",
  },
  {
    n: "04",
    title: "免费，且跨平台",
    desc: "开箱即用，不收月费；Windows 上托盘常驻，随叫随到。免费，是我们的立场，不是限时的饵。",
  },
  {
    n: "05",
    title: "你说的话，留在本地",
    desc: "语音在你自己机器上处理，用完即散，不送去别处。",
  },
];

export default function VoicePage() {
  return (
    <div className="wu-land">
      <Track path="/voice" />
      <Reveal />

      {/* ——— 导航 ——— */}
      <nav className="nav"><div className="wrap">
        <a className="brand" href="#top">
          <WuMark stroke={12} dot={10} />
          <span><span className="zh">无为念</span> <span className="en">WUWEI VOICE</span></span>
        </a>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#feature">功能</a>
            <a href="#how">怎么用</a>
            <a href="#story">无为·念</a>
          </div>
          <AuthButton locale="zh" />
        </div>
      </div></nav>
      <span id="top"></span>

      {/* ——— Hero ——— */}
      <header className="hero"><div className="wrap">
        <WuMark className="logo" stroke={9} dot={7.4} />
        <h1>让表达，<span className="spark">追上思考</span>。</h1>
        <div className="en">ONE INTENTION. WORDS INTO TEXT.</div>
        <p className="vp">
          <b>无为念，是 AI 时代的语音输入。</b><br/>
          <span className="dim">按住说话，它实时转成文字、顺手把口误和标点理好，落进你正打字的地方。你什么都没多做，字已成。</span>
        </p>
        <div className="claims">
          <span className="claim">按住说，松手成文</span>
          <span className="claim">AI 把话说圆</span>
          <span className="claim">中文越用越懂你</span>
          <span className="claim">免费跨平台</span>
          <span className="claim">数据本地</span>
        </div>
        <div className="btns" id="download">
          <a className="btn btn-p" href="/api/download?product=voice&platform=windows">▼ 免费下载无为念</a>
          <a className="btn btn-g" href="#how">看它如何工作</a>
        </div>
        <div className="plat">免费开始 · 国内直连　|　Windows · macOS · Linux</div>

        <HeroDemo title="无为念 · 按住说话，字自己落成" lines={[
          {role:"you", text:"你 ▸ 按住说话：这个方案我觉得可以，明天上午十点前发我"},
          {role:"wu", text:"无为念 ▸ 正在转写…"},
          {role:"wu", text:"　　　 已理好口误、补齐标点 ✓"},
          {role:"ok", text:"✓ 文字已落进光标处：「这个方案我觉得可以，明天上午十点前发我。」"}
        ]} />

        <div className="trust">
          <div className="tt">光标在哪，字就落在哪</div>
          <div className="logos">
            <span className="chip"><b>微信</b></span>
            <span className="chip"><b>文档</b></span>
            <span className="chip"><b>浏览器</b></span>
            <span className="chip"><b>任何输入框</b></span>
          </div>
        </div>
      </div></header>

      {/* ——— 转折：键盘 → 语音 ——— */}
      <section className="sec turn"><div className="wrap">
        <div className="row rv">
          <div className="side old"><div className="k">打字这件事</div>
            <p>我们做了几十年，做到以为它天经地义。<br/>可它从来不自然——是人在迁就机器，把心里那句已经成型的话，拆成一颗颗按键，一个字母一个字母敲出来。<b>几十年，是人在迁就机器。</b></p>
          </div>
          <div className="arrow">→</div>
          <div className="side new"><div className="k">无为念</div>
            <p>现在，反过来了。<br/>你只管开口，话自己落成字。不切窗口、不复制粘贴，说完就在那儿了。<b>AI 时代，表达追上思考。</b></p>
          </div>
        </div>
      </div></section>

      {/* ——— 5 大卖点 ——— */}
      <section className="sec" id="feature"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Why WUWEI VOICE</div>
          <div className="h2">强大，但<span className="zhu">简单到人人会用</span></div>
          <p className="lead">语音输入本该像说话一样自然。无为念把复杂留给自己，把简单留给你——按住，说，松手，字已成。</p>
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
          <div className="h2">不止能听，更<span className="zhu">能懂你</span></div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">实时转写</span>
            <h3>按住说话，松手成文</h3>
            <p>微信、文档、浏览器，光标在哪，字就落在哪。不切窗口、不复制粘贴——说完就在那儿了。像发语音一样自然，但落下的是文字。</p>
            <ul>
              <li>全局热键，任何输入框都能用</li>
              <li>说完即落，不用等、不用贴</li>
              <li>支持长句、连续说，不断线</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">无为念 · 按住说话</span></div>
            <div className="body">
              <div className="p">你 ▸</div>
              <div className="u">按住：明天下午三点会议室别忘了带投影转接头</div>
              <div className="d">　</div>
              <div className="g">无为念 ▸ 实时转写中…</div>
              <div className="g">　　　 已理好语序、补齐标点 ✓</div>
              <div className="ok">✓ 已落进微信输入框：「明天下午三点会议室，别忘了带投影转接头。」</div>
            </div>
          </div>
        </div>

        <div className="frow rev rv">
          <div className="ftext">
            <span className="tag">AI 润色</span>
            <h3>AI 替你把话说圆</h3>
            <p>不是生硬的听写。口误、重复、缺的标点，它顺手补齐，落下来就是能直接发出去的一段话。你说得随意，它落得体面。</p>
            <ul>
              <li>自动去口误、去重复、补标点</li>
              <li>语序理顺，直接可发</li>
              <li>保留你的语气，不改成机器人腔</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">AI 润色 · 说圆</span></div>
            <div className="body">
              <div className="d">原始语音</div>
              <div className="u">那个啥就是我觉得吧这个方案其实还行就是时间有点赶</div>
              <div className="d">　</div>
              <div className="g">无为念 ▸ 去口误、补标点、理顺语序</div>
              <div className="ok">✓ 「我觉得这个方案其实还行，就是时间有点赶。」</div>
            </div>
          </div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">中文优化</span>
            <h3>中文越用越懂你</h3>
            <p>中文识别准，中英混、术语、人名都接得住。自带私人记忆库，你常用的词它记得住，越用越贴。</p>
            <ul>
              <li>中文识别精准，方言口音也能接</li>
              <li>中英混说、专业术语、人名地名都认得</li>
              <li>私人记忆库，常用词越用越准</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">中文 · 越用越懂你</span></div>
            <div className="body">
              <div className="g">你 ▸ 按住：给张伟发邮件说 Q3 的 KPI 复盘改到周五</div>
              <div className="d">　</div>
              <div className="g">无为念 ▸ 识别「张伟」「Q3」「KPI」✓</div>
              <div className="g">　　　 已加入记忆库：张伟、Q3、KPI</div>
              <div className="ok">✓ 「给张伟发邮件，说 Q3 的 KPI 复盘改到周五。」</div>
            </div>
          </div>
        </div>
      </div></section>

      {/* ——— 三步上手 ——— */}
      <section className="sec" id="how"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">How it works</div>
          <div className="h2">三步，从<span className="zhu">开口</span>到<span className="zhu">成文</span></div>
          <p className="lead">无为念把复杂留给自己，把简单留给你。你要做的，只有第一步。</p>
        </div>
        <div className="steps">
          <div className="step rv"><div className="num">一</div><h4>按住</h4><p>全局热键一按，或者点一下托盘图标。不用切窗口，不用找输入框。</p></div>
          <div className="step rv"><div className="num">二</div><h4>说话</h4><p>像平时说话一样，自然说。口误、重复、缺标点，都没关系。</p></div>
          <div className="step rv"><div className="num">三</div><h4>松手</h4><p>字已落进光标处，理好标点、去好口误。直接发，不用改。</p></div>
        </div>
      </div></section>

      {/* ——— 品牌故事 ——— */}
      <section className="sec story" id="story"><div className="wrap">
        <WuMark className="ens rv" stroke={8} dot={7} />
        <div className="line rv">一念既出，<span className="zhu">落字自成</span>。</div>
        <div className="para rv">
          我们迁就键盘太久了。<br/><br/>
          语音，是人最早学会的表达，现在它也成了最快的那个。你只管开口——<b>一念既出，落字自成。</b><br/><br/>
          「念」是双关：一念，是心里那一点动；念出来，是嘴上那一句说。无为念，让心里那一点动，直接变成屏幕上那行字。<br/><br/>
          这，就是 AI 该有的样子：<b>你起念，它成文。无为，而无不为。</b>
        </div>
        <div className="sig rv">— 无为念 · 让表达，追上思考</div>
      </div></section>

      {/* ——— 定价 ——— */}
      <section className="sec" id="price" style={{background:"linear-gradient(180deg,rgba(26,31,38,.35),rgba(20,23,28,0))"}}><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Pricing</div>
          <div className="h2">免费开始，<span className="zhu">用顺了再说</span></div>
          <p className="lead">下载即用，先免费体验。用出感觉、需要更多，再升级——一步都不勉强。</p>
        </div>
        <div className="prices">
          <div className="price rv">
            <div className="pn">免费版</div>
            <div className="pd">按住说话，松手成文</div>
            <div className="amt">¥0</div>
            <ul>
              <li>按住说话，松手成文</li>
              <li>AI 把话说圆</li>
              <li>中文越用越懂你</li>
              <li>数据本地</li>
            </ul>
            <a className="btn btn-g" href="/api/download?product=voice&platform=windows" style={{justifyContent:"center"}}>免费下载</a>
            <div className="note">无需注册，下载即用</div>
          </div>
          <div className="price feat rv">
            <div className="badge">最受欢迎</div>
            <div className="pn">无为念 Pro</div>
            <div className="pd">更快响应，更长录音</div>
            <div className="amt">¥19 <span>/ 月</span></div>
            <ul>
              <li>免费版全部功能</li>
              <li>更快响应</li>
              <li>更长录音</li>
              <li>优先支持</li>
            </ul>
            <a className="btn btn-p" href="#price" style={{justifyContent:"center"}}>升级 Pro</a>
            <div className="note">随时可升级 / 取消</div>
          </div>
          <div className="price rv">
            <div className="pn">无为念 Pro 年付</div>
            <div className="pd">付 10 月送 2 月，更划算</div>
            <div className="amt">¥99 <span>/ 年</span></div>
            <ul>
              <li>Pro 全部功能</li>
              <li>年付更划算</li>
            </ul>
            <a className="btn btn-g" href="#price" style={{justifyContent:"center"}}>选择年付</a>
            <div className="note">≈¥8.3/月</div>
          </div>
        </div>
      </div></section>

      {/* ——— 最终 CTA ——— */}
      <section className="sec final"><div className="wrap">
        <h2 className="rv">让表达，<span className="spark">追上思考</span>。</h2>
        <p className="rv">把打字交出去，把说话还给自己。现在就开始，免费。</p>
        <div className="btns rv">
          <a className="btn btn-p" href="/api/download?product=voice&platform=windows">▼ 免费下载无为念</a>
          <a className="btn btn-g" href="#how">看它如何工作</a>
        </div>
        <div className="plat">Windows · macOS · Linux　|　免费开始，开箱即用</div>
      </div></section>

      {/* ——— 页脚 ——— */}
      <footer className="land-footer"><div className="wrap">
        <div className="frow2">
          <div className="fbrand"><WuMark stroke={12} dot={10} />无为念 · WUWEI VOICE</div>
          <div className="fmenu">
            <a href="#feature">功能</a>
            <a href="#how">怎么用</a>
            <a href="#story">无为·念</a>
            <a href="#download">下载</a>
          </div>
        </div>
        <div className="copy">一念既出，落字自成 · One intention. Words into text. · © 2026 无为 Wuwei</div>
      </div></footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}
