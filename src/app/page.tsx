import type { Metadata } from "next";
import "./landing.css";
import { getPricing, getLatestReleases, type Plan, type Release } from "@/lib/data";
import { FALLBACK_PLANS_CN } from "@/lib/fallback-pricing";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { HeroDemo } from "@/components/HeroDemo";
import { HeroChatBox } from "@/components/HeroChatBox";
import { LandNav } from "@/components/LandNav";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "无为 WUWEI · 一念既出，万事自成 | 人人可用的 AI 提效客户端",
  description: "无为（WUWEI）——人人可用的 AI 提效客户端。你只管起念，把执行交给无为：真读写文件、精确编辑、跑命令、联网搜索，带权限确认。自带你的 key，接 Claude / OpenAI / 本地与国产大模型一键切换。免费开始，开箱即用。Mac / Windows / Linux。",
  alternates: {
    canonical: "https://wuweiai.io",
    languages: {
      "zh-CN": "https://wuweiai.io",
      en: "https://wuweiai.io/en",
      "x-default": "https://wuweiai.io",
    },
  },
};

function WuMark({ className, stroke = 12, dot = 10 }: { className?: string; stroke?: number; dot?: number }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-label="无为">
      <g transform="rotate(-8 120 118)">
        <path d="M152.04 193.48 A82 82 0 1 1 195.48 150.04" fill="none"
          stroke="var(--color-paper)" strokeWidth={stroke} strokeLinecap="round" />
        <circle cx="195.48" cy="150.04" r={dot} fill="var(--color-spark)" />
      </g>
    </svg>
  );
}

const PLAN_COPY: Record<string, { pd: string; note: string }> = {
  free: { pd: "开箱即用，体验无为的全部核心能力", note: "无需注册，下载即用" },
  pro: { pd: "托管额度 + 增强能力，省去自配 key 的麻烦", note: "随时可升级 / 取消" },
  annual: { pd: "按年付更划算，长期用无为的省心之选", note: "付 10 月送 2 月" },
};

function symbolOf(currency: string) { return currency === "USD" ? "$" : currency === "CNY" ? "¥" : ""; }
function periodOf(period: string) { return period === "year" ? " / 年" : period === "month" ? " / 月" : ""; }

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
            {feat && <div className="badge">最受欢迎</div>}
            <div className="pn">{p.name}</div>
            <div className="pd">{copy.pd}</div>
            <div className="amt">{sym}{p.price}{per && <span>{per}</span>}</div>
            <ul>{(p.features ?? []).map((f, i) => <li key={i}>{f}</li>)}</ul>
            {p.plan_key === "free" ? (
              hasRelease ? <a className="btn btn-g" href="/api/download?platform=windows">免费下载</a>
              : <span className="btn btn-g btn-disabled">即将上线</span>
            ) : (
              <a className={"btn " + (feat ? "btn-p" : "btn-g")} href="#price">{feat ? "升级 Pro" : "选择年付"}</a>
            )}
            <div className="note">{copy.note}</div>
          </div>
        );
      })}
      {plans.length === 0 && <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--mist2)" }}>定价加载中…</p>}
    </div>
  );
}

export default async function Home() {
  let plans: Plan[] = [];
  let releases: Record<string, Release> = {};
  
  try {
    [plans, releases] = await Promise.all([getPricing("cn", "wuwei"), getLatestReleases()]);
  } catch (e) {
    console.error("Failed to fetch pricing:", e);
  }
  
  // fallback: 如果数据库没返回，用静态数据
  if (!plans || plans.length === 0) {
    plans = FALLBACK_PLANS_CN as Plan[];
  }
  
  const hasRelease = Object.keys(releases).length > 0;

  return (
    <div className="wu-land">
      <Track path="/" />
      <Reveal />
      <LandNav locale="zh" />
      <span id="top"></span>
      <header className="hero"><div className="wrap">
        <WuMark className="logo" stroke={9} dot={7.4} />
        <h1>一念既出，<span className="spark">万事自成</span>。</h1>
        <div className="en">ONE INTENTION. EVERYTHING DONE.</div>
        <div className="claims">
          <span className="claim">极致简单</span>
          <span className="claim">零门槛</span>
          <span className="claim">免费</span>
          <span className="claim">用着丝滑</span>
          <span className="claim">干得漂亮</span>
        </div>
        <p className="vp"><span className="dim">下载打开，说句人话——用着用着，活就悄悄干完了，而且干得漂亮。</span></p>
        <HeroChatBox lang="zh" />
        <div className="plat" id="download">免费开始 · 国内直连　|　macOS · Windows · Linux</div>
        <HeroDemo title="无为 · 一句话，活自己干完" lines={[
          {role:"you", text:"你 ▸ 把这份 sales.xlsx 清洗好，导出 CSV 再画张趋势图"},
          {role:"wu", text:"无为 ▸ 读取 sales.xlsx · 2,317 行"},
          {role:"wu", text:"　　　 清洗缺失值、统一日期格式 ✓"},
          {role:"wu", text:"　　　 导出 clean.csv ✓　生成 trend.png ✓"},
          {role:"ok", text:"✓ 全部搞定，文件已放到你桌面。"}
        ]} />
        <div className="trust">
          <div className="tt">想用哪个大模型，都行 · 也可以什么都不用配</div>
          <div className="logos">
            <span className="chip"><b>Claude</b></span>
            <span className="chip"><b>OpenAI</b></span>
            <span className="chip">本地 <b>vLLM / Ollama</b></span>
            <span className="chip">国产 <b>GLM · Kimi · DeepSeek · 豆包</b></span>
          </div>
        </div>
      </div></header>
      <section className="sec turn"><div className="wrap">
        <div className="row rv">
          <div className="side old"><div className="k">那些强大的 AI 工具</div>
            <p>Claude Code、Codex 确实强——<br/>可要装环境、配 API key、翻墙、敲命令行，还按量计费越用越贵。<b>普通人光是"用上它"，就卡在门外。</b></p>
          </div>
          <div className="arrow">→</div>
          <div className="side new"><div className="k">无为</div>
            <p>下载，打开，说人话。<br/>不配置、不翻墙、不懂代码也行，国内直连、免费开始。<b>同样的强大，这次普通人真能用上——而且用着爽。</b></p>
          </div>
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Why WUWEI</div>
          <div className="h2">强大，但<span className="zhu">简单到人人会用</span></div>
          <p className="lead">顶级 AI 的能力，本不该只属于极客。无为把门槛、费用、复杂全拿掉，只留下一件事：你说，它做成。</p>
        </div>
        <div className="vals">
          <div className="val rv"><div className="n">01</div><h3>打开就会，零门槛</h3><p>不装环境、不配 key、不用翻墙、不用懂代码。下载打开，用大白话说出你要什么就行——像发一条消息那样简单。</p></div>
          <div className="val rv"><div className="n">02</div><h3>免费开始，用着丝滑</h3><p>免费就能上手，成本透明不肉疼。干净顺手的界面，没有命令行的冷冰冰，每一步都跟得上你的直觉——用起来一个字，爽。</p></div>
          <div className="val rv"><div className="n">03</div><h3>活干完，还干得漂亮</h3><p>不是给你建议，是把事做成：文件改好、代码跑通、报告成形。用着用着，活就悄悄干完了，结果拿得出手。</p></div>
        </div>
      </div></section>
      <section className="sec tint" id="feature"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Features</div>
          <div className="h2">不止能聊，更<span className="zhu">能成事</span></div>
        </div>
        <div className="frow rv">
          <div className="ftext">
            <span className="tag">真执行</span>
            <h3>你说要什么，它直接动手做完</h3>
            <p>无为手里握着真工具：文件读写、精准到行的代码编辑、终端命令、联网检索。它不是建议你怎么做，而是替你做——每一个改动、每一条命令，都先请你确认，安全可控。</p>
            <ul>
              <li>精确编辑：改哪一行、加哪个函数，说清就动手</li>
              <li>跑命令、装依赖、建目录，全程带确认</li>
              <li>联网搜索最新资料，边查边干</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">无为 · Wuwei</span></div>
            <div className="body">
              <div className="p">你 ▸</div>
              <div className="u">把项目里所有 console.log 删掉，跑一遍测试</div>
              <div className="d">　</div>
              <div className="g">无为 ▸ 搜索到 14 处 console.log，分布在 6 个文件</div>
              <div className="g">　　　 精确编辑 6 个文件 …… <span className="ok">✓ 完成</span></div>
              <div className="g">　　　 执行 npm test …… <span className="ok">✓ 32 passed</span></div>
              <div className="u">都清干净了，测试全绿。</div>
            </div>
          </div>
        </div>
        <div className="frow rev rv">
          <div className="ftext">
            <span className="tag">全后端</span>
            <h3>你的模型你做主，自带 key 开箱即用</h3>
            <p>不绑定任何一家模型商。接 Claude 追求最强推理，接国产模型图省钱合规，接本地 vLLM / Ollama 让数据一步都不出门。一键切换，成本、隐私、合规，全捏在你自己手里。</p>
            <ul>
              <li>Claude / OpenAI / GLM / Kimi / DeepSeek / 豆包 全支持</li>
              <li>本地大模型 vLLM · Ollama，数据不出本机</li>
              <li>自带 key，用多少花多少，成本透明</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">切换后端</span></div>
            <div className="body">
              <div className="d">当前后端</div>
              <div className="u">◉ Claude　<span className="d">最强推理</span></div>
              <div className="g">○ DeepSeek　<span className="d">省钱 · 合规</span></div>
              <div className="g">○ Ollama（本地）　<span className="d">数据不出门</span></div>
              <div className="d">　</div>
              <div className="ok">✓ 一键切换，会话无缝继续</div>
            </div>
          </div>
        </div>
        <div className="frow rv">
          <div className="ftext">
            <span className="tag">长任务</span>
            <h3>几十步的大活，交给它也不崩</h3>
            <p>上下文快满了？它自动压缩，记住该记的。多个任务并行？会话各自持久化，随时切回。花了多少 token、干到哪一步，全程清清楚楚。大任务不再半路失忆。</p>
            <ul>
              <li>上下文自动压缩，长对话不断线</li>
              <li>多会话持久化，关掉再开接着干</li>
              <li>token 用量实时可见，花销心里有数</li>
            </ul>
          </div>
          <div className="mock">
            <div className="bar"><i style={{background:"#e0645a"}}></i><i style={{background:"#e2b34a"}}></i><i style={{background:"#5fb87a"}}></i><span className="t">长任务 · 进行中</span></div>
            <div className="body">
              <div className="g">任务：重构支付模块（步骤 18 / 24）</div>
              <div className="d">──────────────</div>
              <div className="u">▸ 上下文 78% → <span className="ok">自动压缩至 32%</span></div>
              <div className="u">▸ 会话已持久化，可随时切回</div>
              <div className="u">▸ 本次用量：142k tokens</div>
              <div className="ok">✓ 稳定运行 26 分钟，无中断</div>
            </div>
          </div>
        </div>
      </div></section>
      <section className="sec" id="how"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">How it works</div>
          <div className="h2">三步，从<span className="zhu">一念</span>到<span className="zhu">事成</span></div>
          <p className="lead">无为把复杂留给自己，把简单留给你。你要做的，只有第一步。</p>
        </div>
        <div className="steps">
          <div className="step rv"><div className="num">一</div><h4>起念</h4><p>用大白话说出你想要什么——一句话，一个念头。不用学指令，不用记语法。</p></div>
          <div className="step rv"><div className="num">二</div><h4>无为执行</h4><p>它拆解、动手：读写文件、跑命令、查资料，关键处请你确认，一步步把活做完。</p></div>
          <div className="step rv"><div className="num">三</div><h4>事成</h4><p>结果直接落到你的文件、你的项目里。你只管验收，把执行彻底交出去。</p></div>
        </div>
      </div></section>
      <section className="sec tint"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Scenarios</div>
          <div className="h2">谁在用无为，<span className="zhu">用它做什么</span></div>
          <p className="lead">不只是程序员的工具。任何"想得到、却懒得动手"的活，都可以交给它。</p>
        </div>
        <div className="scenes">
          <div className="scene rv"><div className="ic">⌨️</div><h4>开发者</h4><p>改 bug、写功能、重构、跑测试、读陌生代码库——多了一双替你敲键盘的手。</p></div>
          <div className="scene rv"><div className="ic">📄</div><h4>知识工作者</h4><p>批量整理文档、改格式、抽数据、写报告初稿，重复的活它包了。</p></div>
          <div className="scene rv"><div className="ic">📊</div><h4>做数据的人</h4><p>清洗、转换、跑脚本、出图，说清要什么，它一路跑到结果。</p></div>
          <div className="scene rv"><div className="ic">🚀</div><h4>创始人 / 一人公司</h4><p>没有团队？无为就是你的执行团队，把想法当天变成东西。</p></div>
        </div>
      </div></section>
      <section className="sec why"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">The difference</div>
          <div className="h2">和那些<span className="zhu">极客工具</span>，不一样</div>
          <p className="lead">Claude Code、Codex 很强，但那是给程序员的。无为要做的，是把同样的能力，交到每个普通人手里。</p>
        </div>
        <div className="cmp">
          <div className="col them rv"><h4>Claude Code · Codex 等专业工具</h4>
            <ul>
              <li>面向程序员，先得会命令行</li>
              <li>装环境、配 API key 才跑得起来</li>
              <li>多数要翻墙，国内用不顺</li>
              <li>按 token 计费，越用越贵</li>
              <li>功能强，可普通人望而却步</li>
            </ul>
          </div>
          <div className="col us rv"><h4>无为 · Wuwei</h4>
            <ul>
              <li>面向所有人，说人话就能用</li>
              <li>下载打开即用，零配置</li>
              <li>国内直连，丝滑不折腾</li>
              <li>免费开始，成本透明不肉疼</li>
              <li>一样能干活，还干得漂亮</li>
            </ul>
          </div>
        </div>
      </div></section>
      <section className="sec story" id="story"><div className="wrap">
        <WuMark className="ens rv" stroke={8} dot={7} />
        <div className="line rv">圆有缺，故能容；念既动，则事成。<br/><span className="zhu">你只管起念，其圆自成。</span></div>
        <div className="para rv">
          我们把一个两千年的东方智慧，画成了一个符号。<br/><br/>
          一个几乎合拢的圆，是「圆相」——一笔呵成的宇宙。它<b>故意留了一道缺口</b>：因为《道德经》说"大成若缺"——真正的圆满，从不把自己填满，留一口气、留一道门，才能生长、才能容纳万物。<br/><br/>
          缺口上，有<b>一点朱红</b>。那是"一念"，是火种，是这寂静玄黑里唯一的暖。<br/><br/>
          <b>一念既出，圆自合拢。</b>你不必事必躬亲地把每一笔描满——你只需点亮那一念，剩下的，交给无为。<br/><br/>
          这，就是 AI 该有的样子：<b>你起念，它成事。无为，而无不为。</b>
        </div>
        <div className="sig rv">— 无为 · 让每个人都能「无为而无不为」</div>
      </div></section>
      <section className="sec tint" id="price"><div className="wrap">
        <div className="sec-head rv">
          <div className="eyebrow">Pricing</div>
          <div className="h2">免费开始，<span className="zhu">用顺了再说</span></div>
          <p className="lead">下载即用，先免费体验它怎么替你干活。用出感觉、额度不够了，再登录升级——一步都不勉强。</p>
        </div>
        <PriceCards plans={plans} hasRelease={hasRelease} />
      </div></section>
      <section className="sec final"><div className="wrap">
        <h2 className="rv">一念既出，<span className="spark">万事自成</span>。</h2>
        <p className="rv">把执行交出去，把时间还给自己。现在就开始，免费。</p>
        <div className="btns rv">
          <a className="btn btn-p" href="#price">▼ 免费下载无为</a>
          <a className="btn btn-g" href="#how">看它如何工作</a>
        </div>
        <div className="plat">macOS · Windows · Linux　|　自带 key，开箱即用</div>
      </div></section>
      <footer className="land-footer"><div className="wrap">
        <div className="frow2">
          <div className="fbrand"><WuMark stroke={12} dot={10} />无为 · WUWEI</div>
          <div className="fmenu">
            <a href="#feature">功能</a>
            <a href="#how">怎么用</a>
            <a href="#story">无为·道</a>
            <a href="#price">定价</a>
            <a href="#download">下载</a>
          </div>
        </div>
        <div className="copy">一念既出，万事自成 · One intention. Everything done. · © 2026 无为 Wuwei</div>
      </div></footer>
    </div>
  );
}
