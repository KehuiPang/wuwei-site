import type { Metadata } from "next";
import "../../landing.css";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { HeroDemo } from "@/components/HeroDemo";
import { AuthButton } from "@/components/AuthButton";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Wuwei Voice — Let your words keep up with your mind | Voice input for the AI era",
  description:
    "We bent to the keyboard for decades. Wuwei Voice turns it around: just speak, and your words land as text in real time, cleaned up, right where you're typing. Free, cross-platform, local.",
  alternates: {
    canonical: "https://wuweiai.io/en/voice",
    languages: {
      "zh-CN": "https://wuweiai.io/voice",
      en: "https://wuweiai.io/en/voice",
      "x-default": "https://wuweiai.io/en/voice",
    },
  },
  openGraph: {
    title: "Wuwei Voice — Let your words keep up with your mind | Voice input for the AI era",
    description:
      "We bent to the keyboard for decades. Wuwei Voice turns it around: just speak, and your words land as text in real time, cleaned up, right where you're typing. Free, cross-platform, local.",
    url: "https://wuweiai.io/en/voice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wuwei Voice — Let your words keep up with your mind | Voice input for the AI era",
    description:
      "We bent to the keyboard for decades. Wuwei Voice turns it around: just speak, and your words land as text in real time, cleaned up, right where you're typing. Free, cross-platform, local.",
  },
  keywords: [
    "Wuwei Voice",
    "voice input",
    "AI dictation",
    "speech to text",
    "free voice typing",
    "cross-platform dictation",
    "local voice recognition",
    "Chinese voice input",
    "AI transcription",
    "push to talk",
  ],
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Wuwei Voice",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Windows, macOS, Linux",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "description": "Voice input for the AI era. Hold to speak, and it transcribes in real time, smooths the slips and punctuation, and drops the text right where you're typing. Free, cross-platform, local.",
      "url": "https://wuweiai.io/en/voice",
      "downloadUrl": "https://wuweiai.io/api/download?product=voice&platform=windows",
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
    <svg viewBox="0 0 240 240" className={className} aria-label="Wuwei Voice">
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
    title: "Hold, speak, and it's written",
    desc: "Chat apps, docs, the browser — the words land wherever your cursor is. No switching, no paste. You stop talking, and it's already there.",
  },
  {
    n: "02",
    title: "AI rounds out what you said",
    desc: "Not raw dictation. It fixes the slips, trims the repeats, adds the punctuation you skipped, so what lands is a passage you can send as is.",
  },
  {
    n: "03",
    title: "It learns your words",
    desc: "Accurate with Chinese, fine with mixed English, jargon, and names. A private memory holds your common terms, so it fits you better the more you talk.",
  },
  {
    n: "04",
    title: "Free, and cross-platform",
    desc: "Works out of the box, no monthly fee. Lives in the Windows tray, ready when you are. Free is where we stand, not bait with a timer.",
  },
  {
    n: "05",
    title: "What you say stays local",
    desc: "Your voice is processed on your own machine. Used once, then gone. Nothing shipped off.",
  },
];

export default function VoicePageEn() {
  return (
    <div className="wu-land">
      <Track path="/en/voice" />
      <Reveal />

      {/* ——— Nav ——— */}
      <nav className="nav"><div className="wrap">
        <a className="brand" href="#top">
          <WuMark stroke={12} dot={10} />
          <span><span className="zh">Wuwei Voice</span> <span className="en">WUWEI VOICE</span></span>
        </a>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#feature">Features</a>
            <a href="#how">How it works</a>
            <a href="#story">Wuwei · Voice</a>
          </div>
          <AuthButton locale="en" />
        </div>
      </div></nav>
      <span id="top"></span>

      {/* ——— Hero ——— */}
      <header className="hero"><div className="wrap">
        <WuMark className="logo" stroke={9} dot={7.4} />
        <h1>Your mind moves fast.<br/><span className="spark">Now your words can too.</span></h1>
        <div className="en">ONE INTENTION. WORDS INTO TEXT.</div>
        <p className="vp">
          <b>Wuwei Voice is voice input for the AI era.</b><br/>
          <span className="dim">Hold to speak, and it transcribes in real time, smooths the slips and punctuation, and drops the text right where you're already typing. You did nothing extra, yet it's written.</span>
        </p>
        <div className="claims">
          <span className="claim">Hold to speak</span>
          <span className="claim">AI rounds it out</span>
          <span className="claim">Learns your words</span>
          <span className="claim">Free cross-platform</span>
          <span className="claim">Local processing</span>
        </div>
        <div className="btns" id="download">
          <a className="btn btn-p" href="/api/download?product=voice&platform=windows">▼ Download Wuwei Voice — Free</a>
          <a className="btn btn-g" href="#how">See how it works</a>
        </div>
        <div className="plat">Free to start · Direct connect　|　Windows · macOS · Linux</div>

        <HeroDemo title="Wuwei Voice · Hold to speak, text lands itself" lines={[
          {role:"you", text:"You ▸ Hold to speak: This plan looks good, send it to me by 10am tomorrow"},
          {role:"wu", text:"Wuwei Voice ▸ Transcribing…"},
          {role:"wu", text:"　　　 Fixed slips, added punctuation ✓"},
          {role:"ok", text:"✓ Text landed at cursor: 「This plan looks good, send it to me by 10am tomorrow.」"}
        ]} />

        <div className="trust">
          <div className="tt">Where your cursor is, the words land</div>
          <div className="logos">
            <span className="chip"><b>WeChat</b></span>
            <span className="chip"><b>Docs</b></span>
            <span className="chip"><b>Browser</b></span>
            <span className="chip"><b>Any input field</b></span>
          </div>
        </div>
      </div></header>

      {/* ——— Turn: Keyboard → Voice ——— */}
      <section className="sec turn"><div className="wrap">
        <div className="row rv">
          <div className="side old"><div className="k">Typing</div>
            <p>We've done it for decades, until it felt natural.<br/>But it never was — us bending to the machine, breaking a whole thought into keystrokes, one slow letter at a time.<b>For decades, humans bent to machines.</b></p>
          </div>
          <div className="arrow">→</div>
          <div className="side new"><div className="k">Wuwei Voice</div>
            <p>Now, it turns around.<br/>You just speak, and the words find their place. No switching, no paste.<b>In the AI era, expression keeps up with thought.</b></p>
          </div>
        </div>
      </div></section>

      {/* ——— 5 Features ——— */}
      <section className="sec" id="feature"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Why WUWEI VOICE</div>
          <div className="h2">Powerful, yet<span className="zhu"> simple enough for anyone</span></div>
          <p className="lead">Voice input should feel as natural as speaking. Wuwei Voice keeps the complexity to itself and leaves simplicity to you — hold, speak, release, and it's written.</p>
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
          <div className="h2">Not just listening,<span className="zhu"> but understanding</span></div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">Real-time transcription</span>
            <h3>Hold to speak, release to write</h3>
            <p>Chat apps, docs, the browser — the words land wherever your cursor is. No switching, no paste. As natural as sending a voice message, but what lands is text.</p>
            <ul>
              <li>Global hotkey, works in any input field</li>
              <li>Speak and it lands, no waiting, no pasting</li>
              <li>Long sentences, continuous speech, never breaks</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">Wuwei Voice · Hold to speak</span></div>
            <div className="body">
              <div className="p">You ▸</div>
              <div className="u">Hold: Don't forget the projector adapter for the meeting at 3pm tomorrow</div>
              <div className="d">　</div>
              <div className="g">Wuwei Voice ▸ Transcribing in real time…</div>
              <div className="g">　　　 Fixed word order, added punctuation ✓</div>
              <div className="ok">✓ Landed in WeChat input: 「Don't forget the projector adapter for the meeting at 3pm tomorrow.」</div>
            </div>
          </div>
        </div>

        <div className="frow rev rv">
          <div className="ftext">
            <span className="tag">AI polish</span>
            <h3>AI rounds out what you said</h3>
            <p>Not raw dictation. It fixes the slips, trims the repeats, adds the punctuation you skipped, so what lands is a passage you can send as is. You speak casually, it lands gracefully.</p>
            <ul>
              <li>Auto-removes slips and repeats, adds punctuation</li>
              <li>Fixes word order, ready to send</li>
              <li>Keeps your tone, never robotic</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">AI Polish · Rounding out</span></div>
            <div className="body">
              <div className="d">Original speech</div>
              <div className="u">Um like I think this plan is okay but the timeline is a bit tight</div>
              <div className="d">　</div>
              <div className="g">Wuwei Voice ▸ Removing slips, adding punctuation, fixing word order</div>
              <div className="ok">✓ 「I think this plan is okay, but the timeline is a bit tight.」</div>
            </div>
          </div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">Chinese optimization</span>
            <h3>It learns your words</h3>
            <p>Accurate with Chinese, fine with mixed English, jargon, and names. A private memory holds your common terms, so it fits you better the more you talk.</p>
            <ul>
              <li>Precise Chinese recognition, handles accents</li>
              <li>Mixed Chinese-English, technical terms, names all recognized</li>
              <li>Private memory, gets better the more you use it</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">Chinese · Learns you</span></div>
            <div className="body">
              <div className="g">You ▸ Hold: Email Zhang Wei about the Q3 KPI review moving to Friday</div>
              <div className="d">　</div>
              <div className="g">Wuwei Voice ▸ Recognized "Zhang Wei" "Q3" "KPI" ✓</div>
              <div className="g">　　　 Added to memory: Zhang Wei, Q3, KPI</div>
              <div className="ok">✓ 「Email Zhang Wei about the Q3 KPI review moving to Friday.」</div>
            </div>
          </div>
        </div>
      </div></section>

      {/* ——— 3 Steps ——— */}
      <section className="sec" id="how"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">How it works</div>
          <div className="h2">Three steps from<span className="zhu"> speak</span> to<span className="zhu"> written</span></div>
          <p className="lead">Wuwei Voice keeps the complexity to itself and leaves simplicity to you. You only need to do the first step.</p>
        </div>
        <div className="steps">
          <div className="step rv"><div className="num">1</div><h4>Hold</h4><p>Press the global hotkey, or click the tray icon. No window switching, no finding input fields.</p></div>
          <div className="step rv"><div className="num">2</div><h4>Speak</h4><p>Speak naturally, as you always do. Slips, repeats, missing punctuation — none of it matters.</p></div>
          <div className="step rv"><div className="num">3</div><h4>Release</h4><p>The text lands at your cursor, cleaned up and ready. Send it as is, no editing needed.</p></div>
        </div>
      </div></section>

      {/* ——— Brand Story ——— */}
      <section className="sec story" id="story"><div className="wrap">
        <WuMark className="ens rv" stroke={8} dot={7} />
        <div className="line rv">One intention,<span className="zhu"> words into text</span>.</div>
        <div className="para rv">
          We've bent to the keyboard for too long.<br/><br/>
          Speaking is the first language we ever learned — now it's the fastest one too. Just speak, and the words settle into place.<b>One intention, words into text.</b><br/><br/>
          "Voice" is a double meaning: the voice in your mind, and the voice you speak with. Wuwei Voice lets the spark in your mind become the line on your screen.<br/><br/>
          This is what AI should be:<b> you set the intent, it completes the text. Wu wei, and nothing is left undone.</b>
        </div>
        <div className="sig rv">— Wuwei Voice · Let your words keep up with your mind</div>
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
            <div className="pd">Hold to speak, release to text</div>
            <div className="amt">$0</div>
            <ul>
              <li>Hold to speak, release to text</li>
              <li>AI cleans up your words</li>
              <li>Chinese-friendly</li>
              <li>Local data</li>
            </ul>
            <a className="btn btn-g" href="/api/download?product=voice&platform=windows" style={{justifyContent:"center"}}>Download Free</a>
            <div className="note">No sign-up required</div>
          </div>
          <div className="price feat rv">
            <div className="badge">Most Popular</div>
            <div className="pn">Wuwei Voice Pro</div>
            <div className="pd">Faster response, longer recordings</div>
            <div className="amt">$9 <span>/ month</span></div>
            <ul>
              <li>All Free features</li>
              <li>Faster response</li>
              <li>Longer recordings</li>
              <li>Priority support</li>
            </ul>
            <a className="btn btn-p" href="#price" style={{justifyContent:"center"}}>Upgrade Pro</a>
            <div className="note">Cancel anytime</div>
          </div>
          <div className="price rv">
            <div className="pn">Wuwei Voice Pro Annual</div>
            <div className="pd">Pay 10, get 12 months</div>
            <div className="amt">$72 <span>/ year</span></div>
            <ul>
              <li>All Pro features</li>
              <li>Best value</li>
            </ul>
            <a className="btn btn-g" href="#price" style={{justifyContent:"center"}}>Choose Annual</a>
            <div className="note">≈$6/month</div>
          </div>
        </div>
      </div></section>

      {/* ——— Final CTA ——— */}
      <section className="sec final"><div className="wrap">
        <h2 className="rv">Your mind moves fast.<br/><span className="spark">Now your words can too.</span></h2>
        <p className="rv">Hand typing over to Wuwei, and keep speaking for yourself. Start now, free.</p>
        <div className="btns rv">
          <a className="btn btn-p" href="/api/download?product=voice&platform=windows">▼ Download Wuwei Voice — Free</a>
          <a className="btn btn-g" href="#how">See how it works</a>
        </div>
        <div className="plat">Windows · macOS · Linux　|　Free to start, ready out of the box</div>
      </div></section>

      {/* ——— Footer ——— */}
      <footer className="land-footer"><div className="wrap">
        <div className="frow2">
          <div className="fbrand"><WuMark stroke={12} dot={10} />Wuwei Voice · WUWEI VOICE</div>
          <div className="fmenu">
            <a href="#feature">Features</a>
            <a href="#how">How it works</a>
            <a href="#story">Wuwei · Voice</a>
            <a href="#download">Download</a>
          </div>
        </div>
        <div className="copy">One intention, words into text. · © 2026 Wuwei</div>
      </div></footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}
