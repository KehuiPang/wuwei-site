import type { Metadata } from "next";
import "../../landing.css";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { HeroDemo } from "@/components/HeroDemo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Wuwei Shot — Screenshots that think | Frame it, and AI reads it",
  description:
    "Screenshots used to copy a block of pixels. Wuwei Shot lets you frame anything on your screen and have AI read it: translate, extract, ask, act. One hotkey to capture, annotate if you need. Free and light.",
  alternates: {
    canonical: "https://wuweiai.io/en/shot",
    languages: {
      "zh-CN": "https://wuweiai.io/shot",
      en: "https://wuweiai.io/en/shot",
      "x-default": "https://wuweiai.io/en/shot",
    },
  },
  openGraph: {
    title: "Wuwei Shot — Screenshots that think | Frame it, and AI reads it",
    description:
      "Screenshots used to copy a block of pixels. Wuwei Shot lets you frame anything on your screen and have AI read it: translate, extract, ask, act. One hotkey to capture, annotate if you need. Free and light.",
    url: "https://wuweiai.io/en/shot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wuwei Shot — Screenshots that think | Frame it, and AI reads it",
    description:
      "Screenshots used to copy a block of pixels. Wuwei Shot lets you frame anything on your screen and have AI read it: translate, extract, ask, act. One hotkey to capture, annotate if you need. Free and light.",
  },
  keywords: [
    "Wuwei Shot",
    "AI screenshot",
    "smart screenshot",
    "screenshot OCR",
    "screenshot translate",
    "screen capture tool",
    "free screenshot tool",
    "cross-platform screenshot",
    "AI screen recognition",
    "screenshot annotation",
  ],
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Wuwei Shot",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Windows, macOS, Linux",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "description": "AI screenshot tool. Frame anything on your screen and have AI read it: translate, extract, ask, act. One hotkey to capture. Free and light.",
      "url": "https://wuweiai.io/en/shot",
      "downloadUrl": "https://wuweiai.io/api/download?product=shot&platform=windows",
      "softwareVersion": "1.0",
      "inLanguage": "en",
      "publisher": {
        "@type": "Organization",
        "name": "Wuwei",
        "url": "https://wuweiai.io"
      }
    },
    {
      "@type": "Organization",
      "name": "Wuwei",
      "url": "https://wuweiai.io",
      "logo": "https://wuweiai.io/favicon.ico",
      "description": "Making AI tools that are zero-barrier, free, and smooth for everyone."
    }
  ]
};

function WuMark({ className, stroke = 12, dot = 10 }: { className?: string; stroke?: number; dot?: number }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-label="Wuwei Shot">
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
    title: "Snap, and it's ready",
    desc: "Alt+A to drag, ✓ to confirm, and the shot is in your clipboard for Ctrl+V anywhere. It stays out of your flow.",
  },
  {
    n: "02",
    title: "Frame it, and it gets it",
    desc: "Frame foreign text and it translates. Frame words and it extracts them. Frame a chart and it explains. You wanted the meaning, not the image — it gives you the meaning.",
  },
  {
    n: "03",
    title: "Snap, then ask",
    desc: "No saving and re-uploading. Snap, then ask Wuwei: what is this, how do I fix it, write this for me. See it, ask it.",
  },
  {
    n: "04",
    title: "Just enough annotation",
    desc: "Arrows, text, mosaic. Circle what matters, hide what shouldn't show. No wall of buttons you'll never touch.",
  },
  {
    n: "05",
    title: "Light enough to forget",
    desc: "Cross-platform, small, quietly there. The interaction feels like breathing.",
  },
];

export default function ShotPageEn() {
  return (
    <div className="wu-land">
      <Track path="/en/shot" />
      <Reveal />

      {/* ——— Nav ——— */}
      <nav className="nav"><div className="wrap">
        <a className="brand" href="#top">
          <WuMark stroke={12} dot={10} />
          <span><span className="zh">Wuwei Shot</span> <span className="en">WUWEI SHOT</span></span>
        </a>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#feature">Features</a>
            <a href="#how">How it works</a>
            <a href="#story">Wuwei · Shot</a>
          </div>
          <a className="nav-cta" href="#download">Download Free</a>
        </div>
      </div></nav>
      <span id="top"></span>

      {/* ——— Hero ——— */}
      <header className="hero"><div className="wrap">
        <WuMark className="logo" stroke={9} dot={7.4} />
        <h1>Screenshots<br/><span className="spark">that think</span>.</h1>
        <div className="en">SCREENSHOTS THAT THINK.</div>
        <p className="vp">
          <b>Wuwei Shot lets you frame anything on your screen, and AI reads it.</b><br/>
          <span className="dim">A line of foreign text, an error, a chart. It no longer just copies pixels; it reads the intent behind what you framed: translate it, extract it, ask AI about it in one step.</span>
        </p>
        <div className="claims">
          <span className="claim">One hotkey snap</span>
          <span className="claim">Frame it, it gets it</span>
          <span className="claim">Snap then ask</span>
          <span className="claim">Just enough annotate</span>
          <span className="claim">Light and free</span>
        </div>
        <div className="btns" id="download">
          <span className="btn btn-p" style={{opacity:0.6,cursor:"not-allowed"}}>▼ Coming Soon</span>
          <a className="btn btn-g" href="#how">See how it works</a>
        </div>
        <div className="plat">Free to start · Direct connect　|　Windows · macOS · Linux</div>

        <HeroDemo title="Wuwei Shot · Frame your screen, AI reads it" lines={[
          {role:"you", text:"You ▸ Alt+A frame an English error message"},
          {role:"wu", text:"Wuwei Shot ▸ Recognizing…"},
          {role:"wu", text:"　　　 Extracted text, translated to Chinese ✓"},
          {role:"ok", text:"✓ Translation copied: 「Module not found: please check dependency installation」"}
        ]} />

        <div className="trust">
          <div className="tt">Frame anything, it understands everything</div>
          <div className="logos">
            <span className="chip"><b>Foreign text</b></span>
            <span className="chip"><b>Errors</b></span>
            <span className="chip"><b>Charts</b></span>
            <span className="chip"><b>Anything on screen</b></span>
          </div>
        </div>
      </div></header>

      {/* ——— Turn: Old screenshot → New screenshot ——— */}
      <section className="sec turn"><div className="wrap">
        <div className="row rv">
          <div className="side old"><div className="k">Old screenshots</div>
            <p>Haven't changed in decades: frame a piece of your screen, copy a block of pixels.<br/>They've always been dumb — you capture the picture, not the meaning, and only you can read it.<b>Screenshots only copy pixels.</b></p>
          </div>
          <div className="arrow">→</div>
          <div className="side new"><div className="k">Wuwei Shot</div>
            <p>Now it's different.<br/>Whatever you frame, it understands. Translate, extract, ask, act.<b>From copying pixels to copying intent.</b></p>
          </div>
        </div>
      </div></section>

      {/* ——— 5 Features ——— */}
      <section className="sec" id="feature"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Why WUWEI SHOT</div>
          <div className="h2">Screenshots,<span className="zhu"> that think</span></div>
          <p className="lead">Screenshots should feel as natural as breathing. Wuwei Shot keeps the complexity to itself and leaves simplicity to you — frame it, and it gets it.</p>
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

      {/* ——— Feature demos ——— */}
      <section className="sec tint"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Features</div>
          <div className="h2">Not just capture,<span className="zhu"> but understand</span></div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">AI recognition</span>
            <h3>Frame it, and it gets it</h3>
            <p>Frame foreign text and it translates. Frame words and it extracts them. Frame a chart and it explains. You wanted the meaning, not the image — it gives you the meaning.</p>
            <ul>
              <li>Foreign screenshots, one-step translation</li>
              <li>Error messages, tells you how to fix</li>
              <li>Chart data, auto-extracted as table</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">Wuwei Shot · AI Recognition</span></div>
            <div className="body">
              <div className="p">You ▸</div>
              <div className="u">Alt+A frame a line of English documentation</div>
              <div className="d">　</div>
              <div className="g">Wuwei Shot ▸ OCR recognizing…</div>
              <div className="g">　　　 Extracted text, translated to Chinese ✓</div>
              <div className="ok">✓ Translation copied, ready to paste</div>
            </div>
          </div>
        </div>

        <div className="frow rev rv">
          <div className="ftext">
            <span className="tag">Snap then ask</span>
            <h3>Snap, then ask</h3>
            <p>No saving and re-uploading. Snap, then ask Wuwei: what is this, how do I fix it, write this for me. See it, ask it.</p>
            <ul>
              <li>Ask AI right after snapping, no window switching</li>
              <li>Code error? Ask how to fix</li>
              <li>Document content? Ask for summary</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">Snap then ask · AI</span></div>
            <div className="body">
              <div className="d">You snapped a code error screenshot</div>
              <div className="u">Ask: How do I fix this error?</div>
              <div className="d">　</div>
              <div className="g">Wuwei AI ▸ Analyzing error…</div>
              <div className="ok">✓ "This is a dependency version conflict. Run npm install --force to fix."</div>
            </div>
          </div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">Light annotation</span>
            <h3>Just enough annotation</h3>
            <p>Arrows, text, mosaic. Circle what matters, hide what shouldn't show. No wall of buttons you'll never touch.</p>
            <ul>
              <li>Arrows, text, mosaic — one-click add</li>
              <li>No clutter, just enough</li>
              <li>Annotate then copy or save directly</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">Annotate · Just enough</span></div>
            <div className="body">
              <div className="g">You ▸ Frame a chart</div>
              <div className="d">　</div>
              <div className="g">Wuwei Shot ▸ Added arrow pointing to key data</div>
              <div className="g">　　　 Added text note "Q3 growth 47%"</div>
              <div className="ok">✓ Annotation done, copied to clipboard</div>
            </div>
          </div>
        </div>
      </div></section>

      {/* ——— 3 Steps ——— */}
      <section className="sec" id="how"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">How it works</div>
          <div className="h2">Three steps from<span className="zhu"> frame</span> to<span className="zhu"> understand</span></div>
          <p className="lead">Wuwei Shot keeps the complexity to itself and leaves simplicity to you. You only need to do the first step.</p>
        </div>
        <div className="steps">
          <div className="step rv"><div className="num">1</div><h4>Frame</h4><p>Alt+A to drag, or click the tray icon. No window switching, no menu hunting.</p></div>
          <div className="step rv"><div className="num">2</div><h4>Confirm</h4><p>✓ to confirm, screenshot auto-copied to clipboard. AI starts recognizing content.</p></div>
          <div className="step rv"><div className="num">3</div><h4>Use</h4><p>Paste anywhere, or ask AI directly. What you see is what you get.</p></div>
        </div>
      </div></section>

      {/* ——— Brand Story ——— */}
      <section className="sec story" id="story"><div className="wrap">
        <WuMark className="ens rv" stroke={8} dot={7} />
        <div className="line rv">One intention,<span className="zhu"> what you see is what you get</span>.</div>
        <div className="para rv">
          Screenshots haven't changed in decades.<br/><br/>
          You used to capture an image and make sense of it yourself. Now you frame the intent, and reading it is Wuwei's job.<b>One intention, what you see is what you get.</b><br/><br/>
          "Shot" is the action, and the result: capture the screen, capture the intent. Wuwei Shot turns everything on your screen into understandable, actionable information.<br/><br/>
          This is what AI should be:<b> you frame it, it reads it. Wu wei, and nothing is left undone.</b>
        </div>
        <div className="sig rv">— Wuwei Shot · Screenshots that think</div>
      </div></section>

      {/* ——— Pricing ——— */}
      <section className="sec" id="price" style={{background:"linear-gradient(180deg,rgba(26,31,38,.35),rgba(20,23,28,0))"}}><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Pricing</div>
          <div className="h2">Start free, <span className="zhu">upgrade when ready</span></div>
          <p className="lead">Download and use immediately. Upgrade when you need more — no pressure.</p>
        </div>
        <div className="prices">
          <div className="price rv">
            <div className="pn">Free</div>
            <div className="pd">Frame anything, AI reads it</div>
            <div className="amt">$0</div>
            <ul>
              <li>Frame anything, AI reads it</li>
              <li>Translate, extract, ask</li>
              <li>One hotkey to capture</li>
            </ul>
            <span className="btn btn-g" style={{justifyContent:"center",opacity:0.6,cursor:"not-allowed"}}>Coming Soon</span>
            <div className="note">Coming soon, stay tuned</div>
          </div>
          <div className="price feat rv">
            <div className="badge">Most Popular</div>
            <div className="pn">Wuwei Shot Pro</div>
            <div className="pd">Faster recognition, longer history</div>
            <div className="amt">$4.99 <span>/ month</span></div>
            <ul>
              <li>All Free features</li>
              <li>Faster recognition</li>
              <li>Longer history</li>
              <li>Priority support</li>
            </ul>
            <a className="btn btn-p" href="#price" style={{justifyContent:"center"}}>Upgrade Pro</a>
            <div className="note">Cancel anytime</div>
          </div>
          <div className="price rv">
            <div className="pn">Wuwei Shot Pro Annual</div>
            <div className="pd">Pay 10, get 12 months</div>
            <div className="amt">$36 <span>/ year</span></div>
            <ul>
              <li>All Pro features</li>
              <li>Best value</li>
            </ul>
            <a className="btn btn-g" href="#price" style={{justifyContent:"center"}}>Choose Annual</a>
            <div className="note">≈$3/month</div>
          </div>
        </div>
      </div></section>

      {/* ——— Final CTA ——— */}
      <section className="sec final"><div className="wrap">
        <h2 className="rv">Screenshots<br/><span className="spark">that think</span>.</h2>
        <p className="rv">Hand copying pixels over to Wuwei, and keep the intent for yourself. Start now, free.</p>
        <div className="btns rv">
          <span className="btn btn-p" style={{opacity:0.6,cursor:"not-allowed"}}>▼ Coming Soon</span>
          <a className="btn btn-g" href="#how">See how it works</a>
        </div>
        <div className="plat">Windows · macOS · Linux　|　Free to start, ready out of the box</div>
      </div></section>

      {/* ——— Footer ——— */}
      <footer className="land-footer"><div className="wrap">
        <div className="frow2">
          <div className="fbrand"><WuMark stroke={12} dot={10} />Wuwei Shot · WUWEI SHOT</div>
          <div className="fmenu">
            <a href="#feature">Features</a>
            <a href="#how">How it works</a>
            <a href="#story">Wuwei · Shot</a>
            <a href="#download">Download</a>
          </div>
        </div>
        <div className="copy">One intention, what you see is what you get. · © 2026 Wuwei</div>
      </div></footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}
