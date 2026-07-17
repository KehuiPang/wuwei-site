import type { Metadata } from "next";
import "../landing.css";
import { getPricing, getLatestReleases, type Plan } from "@/lib/data";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { LandLangSwitch } from "@/components/LandLangSwitch";

export const revalidate = 60; // ISR：改价/发版后 60s 内自动生效

export const metadata: Metadata = {
  title: "Wuwei — One intention. Everything done. | The AI agent for everyone",
  description:
    "Wuwei — an AI productivity client anyone can use. You set the intent; Wuwei does the work: real file read/write, precise edits, run commands, web search, all with permission checks. Bring your own key — Claude / OpenAI / local & open models, switch in one click. Free to start, ready out of the box. Mac / Windows / Linux.",
  alternates: {
    canonical: "https://wuweiai.io/en",
    languages: {
      "zh-CN": "https://wuweiai.io",
      en: "https://wuweiai.io/en",
      "x-default": "https://wuweiai.io/en",
    },
  },
  openGraph: {
    type: "website",
    url: "https://wuweiai.io/en",
    siteName: "Wuwei",
    title: "Wuwei — One intention. Everything done.",
    description: "An AI agent that gets things done. Bring your own key, ready out of the box. Free to start.",
  },
};

function WuMark({ className, stroke = 12, dot = 10 }: { className?: string; stroke?: number; dot?: number }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-label="Wuwei">
      <g transform="rotate(-8 120 118)">
        <path d="M152.04 193.48 A82 82 0 1 1 195.48 150.04" fill="none"
          stroke="var(--color-paper)" strokeWidth={stroke} strokeLinecap="round" />
        <circle cx="195.48" cy="150.04" r={dot} fill="var(--color-spark)" />
      </g>
    </svg>
  );
}

const PLAN_COPY: Record<string, { pd: string; note: string }> = {
  free: { pd: "Everything you need, right out of the box.", note: "No sign-up. Download and go." },
  pro: { pd: "Hosted credits + more power — skip bringing your own key.", note: "Upgrade or cancel anytime." },
  annual: { pd: "Pay yearly, save more — the no-fuss choice for regulars.", note: "Pay 10 months, get 2 free." },
};

function symbolOf(currency: string) {
  return currency === "USD" ? "$" : currency === "CNY" ? "¥" : "";
}
function periodOf(period: string) {
  return period === "year" ? " / yr" : period === "month" ? " / mo" : "";
}

function PriceCards({ plans, hasRelease }: { plans: Plan[]; hasRelease: boolean }) {
  return (
    <div className="prices">
      {plans.map((p) => {
        const feat = p.plan_key === "pro";
        const copy = PLAN_COPY[p.plan_key] ?? { pd: "", note: "" };
        const sym = symbolOf(p.currency);
        const per = p.price > 0 ? periodOf(p.period) : "";
        return (
          <div key={p.plan_key} className={"price rv" + (feat ? " feat" : "")}>
            {feat && <div className="badge">MOST POPULAR</div>}
            <div className="pn">{p.name}</div>
            <div className="pd">{copy.pd}</div>
            <div className="amt">
              {sym}{p.price}
              {per && <span>{per}</span>}
            </div>
            <ul>
              {(p.features ?? []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            {p.plan_key === "free" ? (
              hasRelease ? (
                <a className="btn btn-g" href="/api/download?platform=windows">Download Free</a>
              ) : (
                <span className="btn btn-g btn-disabled">Coming soon</span>
              )
            ) : (
              <a className={"btn " + (feat ? "btn-p" : "btn-g")} href="#price">
                {feat ? "Upgrade to Pro" : "Choose annual"}
              </a>
            )}
            <div className="note">{copy.note}</div>
          </div>
        );
      })}
      {plans.length === 0 && (
        <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--mist2)" }}>Loading pricing…</p>
      )}
    </div>
  );
}

export default async function EnHome() {
  const [plans, releases] = await Promise.all([getPricing("global"), getLatestReleases()]);
  const hasRelease = Object.keys(releases).length > 0;

  return (
    <div className="wu-land">
      <Track path="/en" />
      <Reveal />

      {/* NAV */}
      <nav className="nav"><div className="wrap">
        <a className="brand" href="#top">
          <WuMark stroke={12} dot={10} />
          <span><span className="zh">Wuwei</span> <span className="en">无为</span></span>
        </a>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#feature">Features</a>
            <a href="#how">How</a>
            <a href="#story">Story</a>
            <a href="#price">Pricing</a>
          </div>
          <LandLangSwitch to="zh" label="中" />
          <a className="nav-cta" href="#price">Download Free</a>
        </div>
      </div></nav>

      <span id="top"></span>

      {/* HERO */}
      <header className="hero"><div className="wrap">
        <WuMark className="logo" stroke={9} dot={7.4} />
        <h1>One intention. <span className="spark">Everything done.</span></h1>
        <div className="en">无为 · WUWEI</div>
        <p className="vp"><b>Effortless · Zero setup · Free.</b><br /><span className="dim">Download, open, say it in plain words — and the work quietly gets done, beautifully.</span></p>
        <div className="claims">
          <span className="claim">Effortless</span>
          <span className="claim">Zero setup</span>
          <span className="claim">Free</span>
          <span className="claim">Silky to use</span>
          <span className="claim">Done well</span>
        </div>
        <div className="btns" id="download">
          <a className="btn btn-p" href="#price">▼ Download Free · 30-sec start</a>
          <a className="btn btn-g" href="#how">See how it works</a>
        </div>
        <div className="plat">{hasRelease ? "Free to start" : "Free to start · installers coming soon"}　|　macOS · Windows · Linux</div>
        <div className="trust">
          <div className="tt">Use any model you like · or configure nothing at all</div>
          <div className="logos">
            <span className="chip"><b>Claude</b></span>
            <span className="chip"><b>OpenAI</b></span>
            <span className="chip">Local <b>vLLM / Ollama</b></span>
            <span className="chip">Open <b>GLM · Kimi · DeepSeek</b></span>
          </div>
        </div>
      </div></header>

      {/* PAIN -> TURN */}
      <section className="sec turn"><div className="wrap">
        <div className="row rv">
          <div className="side old">
            <div className="k">THE POWERFUL AI TOOLS</div>
            <p>Claude Code and Codex are genuinely strong——<br />but you set up environments, configure keys, get past the firewall, type commands, and pay by the token. <b>For most people, just getting started is the wall.</b></p>
          </div>
          <div className="arrow">→</div>
          <div className="side new">
            <div className="k">WUWEI</div>
            <p>Download, open, talk like a human.<br />No config, no VPN, no coding required — direct connection, free to start. <b>The same power — this time ordinary people can actually use it, and enjoy it.</b></p>
          </div>
        </div>
      </div></section>

      {/* CORE VALUE */}
      <section className="sec"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Why WUWEI</div>
          <div className="h2">Powerful, yet <span className="zhu">simple enough for everyone</span></div>
          <p className="lead">Top-tier AI shouldn't belong only to geeks. Wuwei strips away the barriers, the cost, the complexity — leaving one thing: you ask, it gets done.</p>
        </div>
        <div className="vals">
          <div className="val rv"><div className="n">01</div><h3>Open and use, zero barrier</h3><p>No environments, no keys, no VPN, no code. Download, open, and say what you want in plain words — as simple as sending a message.</p></div>
          <div className="val rv"><div className="n">02</div><h3>Free to start, silky to use</h3><p>Free to get going, costs transparent. A clean, intuitive interface — none of the command-line chill. Every step keeps up with your instinct.</p></div>
          <div className="val rv"><div className="n">03</div><h3>The job gets done, and done well</h3><p>Not advice — done work: files edited, code running, reports formed. Bit by bit the work quietly gets done, and the result holds up.</p></div>
        </div>
      </div></section>

      {/* FEATURE ROWS */}
      <section className="sec tint" id="feature"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Features</div>
          <div className="h2">More than chat — it <span className="zhu">gets things done</span></div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">REAL ACTIONS</span>
            <h3>You say what you want; it does it, end to end</h3>
            <p>Wuwei holds real tools: read/write files, line-precise code edits, terminal commands, web search. It doesn't suggest how — it acts for you, and every change and command asks your confirmation first. Safe and in control.</p>
            <ul>
              <li>Precise edits: which line, which function — say it, it does it</li>
              <li>Run commands, install deps, make dirs — always with confirmation</li>
              <li>Search the web for the latest, working as it goes</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{ background: "#e0645a" }}></i><i style={{ background: "#e2b34a" }}></i><i style={{ background: "#5fb87a" }}></i><span className="t">Wuwei</span></div>
            <div className="body">
              <div className="p">You ▸</div>
              <div className="u">Delete every console.log in the project and run the tests</div>
              <div className="d">　</div>
              <div className="g">Wuwei ▸ found 14 console.log across 6 files</div>
              <div className="g">　　　 Edited 6 files …… <span className="ok">✓ done</span></div>
              <div className="g">　　　 Ran npm test …… <span className="ok">✓ 32 passed</span></div>
              <div className="u">All clean, tests green.</div>
            </div>
          </div>
        </div>

        <div className="frow rev rv">
          <div className="ftext">
            <span className="tag">ANY BACKEND</span>
            <h3>Your model, your call — bring your key, ready to go</h3>
            <p>Not locked to any vendor. Plug in Claude for top reasoning, open models for cost and compliance, or local vLLM / Ollama so data never leaves your machine. Switch in one click — cost, privacy, compliance, all in your hands.</p>
            <ul>
              <li>Claude / OpenAI / GLM / Kimi / DeepSeek and more</li>
              <li>Local models vLLM · Ollama, data stays on device</li>
              <li>Bring your key — pay for what you use, costs transparent</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{ background: "#e0645a" }}></i><i style={{ background: "#e2b34a" }}></i><i style={{ background: "#5fb87a" }}></i><span className="t">Switch backend</span></div>
            <div className="body">
              <div className="d">Current backend</div>
              <div className="u">◉ Claude　<span className="d">top reasoning</span></div>
              <div className="g">○ DeepSeek　<span className="d">cheap · compliant</span></div>
              <div className="g">○ Ollama (local)　<span className="d">data stays home</span></div>
              <div className="d">　</div>
              <div className="ok">✓ Switch in one click, session continues</div>
            </div>
          </div>
        </div>

        <div className="frow rv">
          <div className="ftext">
            <span className="tag">LONG TASKS</span>
            <h3>Dozens of steps? It won't fall apart</h3>
            <p>Context filling up? It auto-compacts and keeps what matters. Many tasks at once? Sessions persist independently — switch back anytime. Tokens spent and progress are always clear. No more mid-task amnesia.</p>
            <ul>
              <li>Auto-compaction, long chats never drop</li>
              <li>Persistent multi-session — close and reopen, keep going</li>
              <li>Live token usage, spending always in view</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{ background: "#e0645a" }}></i><i style={{ background: "#e2b34a" }}></i><i style={{ background: "#5fb87a" }}></i><span className="t">Long task · running</span></div>
            <div className="body">
              <div className="g">Task: refactor payment module (step 18 / 24)</div>
              <div className="d">──────────────</div>
              <div className="u">▸ Context 78% → <span className="ok">auto-compacted to 32%</span></div>
              <div className="u">▸ Session persisted, switch back anytime</div>
              <div className="u">▸ This run: 142k tokens</div>
              <div className="ok">✓ 26 min stable, no interruptions</div>
            </div>
          </div>
        </div>
      </div></section>

      {/* HOW IT WORKS */}
      <section className="sec" id="how"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">How it works</div>
          <div className="h2">Three steps, from a <span className="zhu">thought</span> to <span className="zhu">done</span></div>
          <p className="lead">Wuwei keeps the complexity to itself and leaves the simple part to you. All you do is step one.</p>
        </div>
        <div className="steps">
          <div className="step rv"><div className="num">1</div><h4>Intend</h4><p>Say what you want in plain words — one sentence, one thought. No commands to learn, no syntax to memorize.</p></div>
          <div className="step rv"><div className="num">2</div><h4>Wuwei acts</h4><p>It breaks things down and gets to work: read/write files, run commands, look things up — confirming at key steps, finishing the job.</p></div>
          <div className="step rv"><div className="num">3</div><h4>Done</h4><p>Results land right in your files, your project. You just review, and hand execution off for good.</p></div>
        </div>
      </div></section>

      {/* SCENES */}
      <section className="sec tint"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Scenarios</div>
          <div className="h2">Who uses Wuwei, <span className="zhu">and for what</span></div>
          <p className="lead">Not just a programmer's tool. Any job you can imagine but can't be bothered to do — hand it over.</p>
        </div>
        <div className="scenes">
          <div className="scene rv"><div className="ic">⌨️</div><h4>Developers</h4><p>Fix bugs, build features, refactor, run tests, read unfamiliar codebases — an extra pair of hands at the keyboard.</p></div>
          <div className="scene rv"><div className="ic">📄</div><h4>Knowledge workers</h4><p>Batch-organize docs, reformat, extract data, draft reports — it takes the repetitive load.</p></div>
          <div className="scene rv"><div className="ic">📊</div><h4>Data folks</h4><p>Clean, transform, run scripts, plot — say what you want, it runs all the way to the result.</p></div>
          <div className="scene rv"><div className="ic">🚀</div><h4>Founders / one-person co.</h4><p>No team? Wuwei is your execution team — turn ideas into things, same day.</p></div>
        </div>
      </div></section>

      {/* WHY / COMPARE */}
      <section className="sec why"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">The difference</div>
          <div className="h2">Different from those <span className="zhu">geek tools</span></div>
          <p className="lead">Claude Code and Codex are strong — but they're for programmers. Wuwei's mission: put that same power into every ordinary person's hands.</p>
        </div>
        <div className="cmp">
          <div className="col them rv">
            <h4>Pro tools like Claude Code · Codex</h4>
            <ul>
              <li>Built for programmers — command line first</li>
              <li>Need environments and API keys to run</li>
              <li>Mostly need a VPN, clumsy in some regions</li>
              <li>Billed by token, pricier the more you use</li>
              <li>Powerful, but daunting for normal people</li>
            </ul>
          </div>
          <div className="col us rv">
            <h4>Wuwei</h4>
            <ul>
              <li>For everyone — talk like a human</li>
              <li>Download and go, zero config</li>
              <li>Direct connection, smooth, no fuss</li>
              <li>Free to start, costs transparent</li>
              <li>Gets the job done just as well — beautifully</li>
            </ul>
          </div>
        </div>
      </div></section>

      {/* BRAND STORY */}
      <section className="sec story" id="story"><div className="wrap">
        <WuMark className="ens rv" stroke={8} dot={7} />
        <div className="line rv">A circle with a gap can hold the world; once a thought stirs, the deed is done.<br /><span className="zhu">You only intend — the circle completes itself.</span></div>
        <div className="para rv">
          We drew a two-thousand-year-old Eastern wisdom into a single symbol.<br /><br />
          An almost-closed circle — the ensō, a whole universe in one stroke. It <b>leaves a gap on purpose</b>: the Tao Te Ching says "great perfection seems incomplete" — true wholeness never fills itself in. Leave a breath, leave a door, and it can grow, and hold all things.<br /><br />
          On the gap sits <b>a single point of cinnabar red</b>. That is the "one thought" — the spark, the only warmth in this silent black.<br /><br />
          <b>One intention, and the circle closes itself.</b> You needn't trace every stroke by hand — just light that one thought, and leave the rest to Wuwei.<br /><br />
          This is what AI should be: <b>you intend, it accomplishes. Wuwei — doing nothing, yet leaving nothing undone.</b>
        </div>
        <div className="sig rv">— Wuwei · so everyone can "do nothing, yet leave nothing undone"</div>
      </div></section>

      {/* PRICING（Supabase pricing_plans · region=global · ISR 60s） */}
      <section className="sec tint" id="price"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Pricing</div>
          <div className="h2">Start free, <span className="zhu">decide later</span></div>
          <p className="lead">Download and use — feel how it works for you first, free. When you're hooked and need more, sign in and upgrade. Never forced.</p>
        </div>
        <PriceCards plans={plans} hasRelease={hasRelease} />
      </div></section>

      {/* FINAL CTA */}
      <section className="sec final"><div className="wrap">
        <h2 className="rv">One intention. <span className="spark">Everything done.</span></h2>
        <p className="rv">Hand off execution, get your time back. Start now — free.</p>
        <div className="btns rv">
          <a className="btn btn-p" href="#price">▼ Download Wuwei — Free</a>
          <a className="btn btn-g" href="#how">See how it works</a>
        </div>
        <div className="plat">macOS · Windows · Linux　|　Bring your key, ready out of the box</div>
      </div></section>

      {/* FOOTER */}
      <footer className="land-footer"><div className="wrap">
        <div className="frow2">
          <div className="fbrand">
            <WuMark stroke={12} dot={10} />
            Wuwei · 无为
          </div>
          <div className="fmenu">
            <a href="#feature">Features</a>
            <a href="#how">How</a>
            <a href="#story">Story</a>
            <a href="#price">Pricing</a>
            <a href="#download">Download</a>
          </div>
        </div>
        <div className="copy">One intention. Everything done. · 无为 Wuwei · © 2026</div>
      </div></footer>
    </div>
  );
}
