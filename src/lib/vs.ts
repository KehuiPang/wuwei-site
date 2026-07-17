// 对标/SEO 落地页内容矩阵（程序化 /vs/[slug]）。
// 文案来源：品牌中心「产品中心/落地页文案/*.md」，由小码忠实转录落地，非机翻、未改事实。
// ⚠️ wuwei-vs-claude-code 涉法律/品牌风险：源文档要求「CEO 逐句终检后方可上线」，
//    故本页 noindex + 不进 sitemap，待 CEO 终检后再放开索引（见 blocks 中 facts 均附来源）。
import type { Locale } from "./site";

export type VsBlock =
  | { kind: "prose"; text: string }
  | { kind: "points"; h?: string; items: { t: string; d: string }[] }
  | { kind: "table"; h?: string; headers: string[]; rows: string[][]; note?: string }
  | { kind: "facts"; h?: string; note?: string; items: { text: string; source: string }[] };

export type VsPage = {
  slug: string;
  locale: Locale;
  product: "wuwei" | "nian"; // JSON-LD 产品名
  noindex?: boolean;
  hasEn?: boolean; // 该中文主页在 /en/vs/[slug] 有英文对标页（用于互标 hreflang）
  meta: { title: string; description: string };
  h1: string;
  subhead: string;
  cta: { text: string; href: string };
  secondary?: { label: string; href: string }[];
  blocks: VsBlock[];
};

export const VS_PAGES: Record<string, VsPage> = {
  // ————————————————————————————————————————————————
  "claude-code-alternative": {
    slug: "claude-code-alternative",
    locale: "en",
    product: "wuwei",
    meta: {
      title: "Looking for a Claude Code alternative? Meet Wuwei — free, local, open, yours.",
      description:
        "Wuwei is a free AI coding agent that runs on your own machine. No subscription, no API-key hassle, no hidden region tagging. Bring any model and own your workflow.",
    },
    h1: "Looking for a Claude Code alternative? Meet Wuwei — free, local, open, yours.",
    subhead:
      "You don't need another cloud account that might lock you out one day. You need something that runs where you are and stays out of your way.",
    cta: { text: "Download Wuwei — Free", href: "/en#download" },
    secondary: [
      { label: "Got banned already? First aid →", href: "/vs/claude-code-account-banned" },
      { label: "The reported facts & sources →", href: "/vs/wuwei-vs-claude-code" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "Most people looking for a Claude Code alternative want the same thing: get the work done without babysitting the tool. Wuwei does that. You say what you want, it does the work, and your code never leaves your machine.",
      },
      {
        kind: "points",
        items: [
          { t: "Free, for real", d: "No subscription, no API-key juggling. Wuwei works out of the box. Free is how we think a good tool should start, not a limited-time hook." },
          { t: "Runs locally", d: "Your code stays on your computer. Nothing gets shipped off somewhere you can't see." },
          { t: "Open and auditable", d: "The code is open source (MIT). You can read exactly what it does. No hidden region tagging, no surprise bans." },
          { t: "Model-agnostic", d: "Bring Claude, any OpenAI-compatible endpoint, or a local model. You can leave anytime, which is the whole reason it's safe to stay." },
        ],
      },
      {
        kind: "table",
        h: "How they compare",
        headers: ["What you care about", "Wuwei", "Claude Code"],
        rows: [
          ["Price", "Free, out of the box", "Subscription"],
          ["Region bans", "Runs locally, no region tagging", "Region checks reported in the press"],
          ["Where your code lives", "On your own machine", "In the cloud"],
          ["Open source", "Yes (MIT)", "No"],
          ["Locked to one platform", "No — bring any model", "Tied to its own platform"],
        ],
        note: "For the reported facts and sources behind the region-tagging story, see the comparison page.",
      },
      {
        kind: "prose",
        text:
          "Moving over is quick. Coming from Claude Code, you don't start from scratch — import your existing project context and config, and you're back to work in a few minutes.",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "claude-code-free-alternative": {
    slug: "claude-code-free-alternative",
    locale: "zh",
    product: "wuwei",
    hasEn: true,
    meta: {
      title: "想给 Claude Code 找个免费平替？无为，一念既出，万事自成",
      description:
        "无为是通用 + 编程一体的 AI Agent CLI，真免费、开箱即用、开源可审计、本地优先、不锁生态。给 Claude Code 找免费平替，看这一个就够。",
    },
    h1: "想给 Claude Code 找个免费平替？无为——一念既出，万事自成",
    subhead: "不是「能凑合用」的那种平替。是一个你会想一直用下去的 AI 编程 Agent。",
    cta: { text: "免费下载无为", href: "/#download" },
    secondary: [
      { label: "账号已经被封了？先看急救 →", href: "/vs/claude-code-account-banned" },
      { label: "英文页 English →", href: "/vs/claude-code-alternative" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "找平替的人，其实都在找同一样东西：少折腾，把活干成。无为把这件事做到底——你说一句话、一个念头，它替你把事做成。你不必事必躬亲地敲每一步，只需点亮那一念。",
      },
      {
        kind: "points",
        items: [
          { t: "通用 + 编程一体的 AI Agent CLI", d: "不只是写代码。查、改、跑、连一整套工作流，一个 Agent 接住，能力对标主流。" },
          { t: "真免费", d: "不是「软件免费但要你自付 API」那种。无为开箱即用，不用订阅、不用信用卡。免费是我们的价值观，不是限时噱头。" },
          { t: "开源可审计 · 本地优先 · 无隐蔽后门", d: "代码开源，逻辑你能逐行看；项目和数据留在你自己电脑，不在你看不见的地方替你做决定。" },
          { t: "不锁生态", d: "模型自由（接 Claude / OpenAI 兼容端点 / 国产模型）、数据自由、迁走自由。你随时能走，所以你可以安心留下。" },
        ],
      },
      {
        kind: "table",
        h: "横向对比",
        headers: ["维度", "无为 / Wuwei", "Claude Code", "Cursor"],
        rows: [
          ["价格", "免费，开箱即用", "订阅制", "订阅制（约 $20/月）"],
          ["是否会因地区被封", "本地运行，不做地域标记", "据公开报道有地区检测先例", "—"],
          ["数据是否本地", "本地优先，留在你电脑", "依赖云端", "依赖云端"],
          ["是否开源", "开源（MIT）", "闭源", "闭源"],
          ["是否锁生态", "模型自由、可迁走", "绑定自有平台", "绑定自有平台"],
        ],
        note: "Claude Code 相关事件事实与来源，见「无为 vs Claude Code」对比页。",
      },
      {
        kind: "prose",
        text:
          "迁移无成本。从 Claude Code 过来，不用从头搭——导入你现有的项目上下文与配置，几分钟就接上原来的活。你只管发念，余下交给无为。",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "wuwei-vs-claude-code": {
    slug: "wuwei-vs-claude-code",
    locale: "zh",
    product: "wuwei",
    noindex: true, // ⚠️ 法律/品牌风险门禁：待 CEO 逐句终检后再放开索引
    hasEn: true,
    meta: {
      title: "无为 vs Claude Code：你的代码该留在谁手里？",
      description:
        "一个本地运行、开源可审计、免费的 AI 编程 Agent。据公开报道，Claude Code 曾被指内置对中国地区的隐蔽检测标记。无为选择把代码留在你自己手里。",
    },
    h1: "无为 vs Claude Code：你的代码，该留在谁手里？",
    subhead: "这不是一场谁更强的比拼。是一个更朴素的问题——你写下的每一行代码，你希望它留在你手里，还是交出去。",
    cta: { text: "把代码握回自己手里 · 免费下载无为", href: "/#download" },
    secondary: [
      { label: "Claude Code 被封了？三步接回工作流 →", href: "/vs/claude-code-account-banned" },
      { label: "想找免费平替？→", href: "/vs/claude-code-free-alternative" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "工具好不好用，各有偏好。但有一件事没有偏好之分：你的代码，是你的。我们不打算说谁「吊打」谁。下面只摆两样东西——已被公开报道的事实，和无为在同样问题上做了什么选择。看完，你自己判断。",
      },
      {
        kind: "facts",
        h: "事实区（据公开报道整理，措辞客观，判断留给读者）",
        items: [
          {
            text: "据 Tom's Hardware 报道，Claude Code 自 v2.1.91（2026-04-02）起，被指内置了针对中国时区 / 代理环境的检测与隐写标记逻辑。",
            source: "https://www.tomshardware.com/tech-industry/artificial-intelligence/alibaba-bans-anthropics-claude-code-after-an-alleged-hidden-china-detection-backdoor-is-uncovered-employees-told-to-switch-to-qoder-as-the-rift-between-the-firms-widens",
          },
          {
            text: "据观察者网 2026-07-03 报道，Anthropic 承认在产品中植入了隐蔽标记。",
            source: "https://www.guancha.cn/economy/2026_07_03_822485.shtml",
          },
          {
            text: "据 BigGo 报道，2026-07-10 阿里巴巴将其列为高风险并在内部全员禁用。",
            source: "https://finance.biggo.com/news/a401b1c7-07f5-44e1-9291-cbbd71da342c",
          },
        ],
        note: "我们不对上述事件做任何情绪化定性。事实已在这里，结论请你自己下。",
      },
      {
        kind: "table",
        h: "横向对比",
        headers: ["维度", "无为 / Wuwei", "Claude Code"],
        rows: [
          ["代码 / 数据在哪", "本地优先，代码留在你自己的电脑", "依赖云端服务"],
          ["是否开源可审计", "开源（MIT），逻辑可逐行审查", "闭源，据公开报道曾含未披露的检测标记"],
          ["是否有封号风险", "本地运行，不做地域标记，你的号是你的", "据公开报道存在地区检测与禁用先例"],
          ["是否绑定平台生态", "模型自由，可接 Claude / OpenAI 兼容端点 / 国产模型", "绑定其自有平台与账号体系"],
          ["价格", "免费，开箱即用，无需订阅、无需信用卡", "订阅制"],
        ],
        note: "表中「无为」各项，不是营销话术，是产品从第一行代码起就做的选择。",
      },
      {
        kind: "prose",
        text:
          "无为为什么选本地优先、选开源、选不做任何地域标记？不是为了在这张表里赢谁。是因为我们相信一件更老的道理——上善若水，利万物而不争。好工具应当坦荡：你能看见它做了什么，它不在你看不见的地方替你做决定。你写代码，它替你成事；但你始终握着那支笔。一念既出，万事自成——而「万事」里，从不包括把你的东西悄悄拿走。这就是无为：把执行交给 AI，把代码、把选择、把主动权，交回你自己手里。",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "wispr-flow-free-alternative": {
    slug: "wispr-flow-free-alternative",
    locale: "zh",
    product: "nian",
    hasEn: true,
    meta: {
      title: "Wispr Flow 要 $15/月？无为念：免费，且跨平台",
      description:
        "无为念是免费的 AI 语音输入——按住说话，实时转文字并自动润色，落进当前光标处。对比 Wispr Flow 的订阅费，它免费、支持 Windows、中文友好、数据本地。",
    },
    h1: "Wispr Flow 要 $15/月？无为念：免费，且跨平台",
    subhead: "语音输入本该像呼吸一样自然——说出来，字就落好了。这件事，不该按月收你费。",
    cta: { text: "免费下载无为念", href: "/nian" },
    secondary: [{ label: "想让 AI 直接替你干活？试试无为本尊 →", href: "/vs/claude-code-free-alternative" }],
    blocks: [
      {
        kind: "prose",
        text:
          "好的语音输入，你几乎感觉不到它的存在：按住、开口、松手，字已经落在光标处，还顺手帮你把口误和标点理好了。无为念就是这样。而且它免费——不是试用期免费，是本该如此的免费。",
      },
      {
        kind: "points",
        items: [
          { t: "免费", d: "对着 Wispr Flow 每月 $15 的订阅，无为念开箱即用，不收月费。上善若水，好用的东西不该设障。" },
          { t: "支持 Windows", d: "这是对手的弱项。无为念在 Windows 上托盘常驻，随叫随到。" },
          { t: "中文友好", d: "中文识别准，混着英文、术语、人名也能接住。还带私人记忆库——越用越懂你的词。" },
          { t: "AI 自动润色", d: "不是生硬的语音转文字。说完自动纠错、补标点、理顺句子，落下来就是能用的文字。" },
          { t: "数据本地 · 隐私", d: "你说的话，处理完就好，不拿去别处。" },
        ],
      },
      {
        kind: "table",
        h: "横向对比",
        headers: ["维度", "无为念 / Wuwei Voice", "Wispr Flow", "superwhisper"],
        rows: [
          ["价格", "免费", "约 $15/月", "订阅 / 付费"],
          ["平台", "Windows（并向跨平台扩展）", "Mac / Windows", "仅 Mac"],
          ["离线 / 本地", "数据本地处理", "依赖云端", "本地为主"],
          ["中文", "中文友好，带私人记忆库", "中文一般", "中文一般"],
          ["AI 润色", "自动纠错 + 补标点 + 理句", "有", "有"],
        ],
      },
      {
        kind: "prose",
        text:
          "用顺了无为念，你会发现它和无为本尊是一套人：一个替你把话落成字，一个替你把念头做成事。都免费，都在本地，都不折腾。",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "claude-code-account-banned": {
    slug: "claude-code-account-banned",
    locale: "zh",
    product: "wuwei",
    hasEn: true,
    meta: {
      title: "Claude Code 账号被封了？先别慌，三步恢复 + 一个不会被封的备选",
      description:
        "Claude Code 被封、不能用了？这里有立刻可做的三步，以及无为——本地运行、不做地域标记、免费的 AI 编程 Agent，几分钟接回你的工作流。",
    },
    h1: "Claude Code 账号被封了？先别慌——三步恢复工作，再给你一个不会被封的备选",
    subhead: "被封的当下最急的不是想明白为什么，是手上的活得继续。先把工作接回来。",
    cta: { text: "免费下载无为，几分钟接回你的工作流", href: "/#download" },
    secondary: [{ label: "想看无为和 Claude Code 到底差在哪？→", href: "/vs/wuwei-vs-claude-code" }],
    blocks: [
      {
        kind: "prose",
        text:
          "一觉醒来账号没了，手上的项目卡在半路——这种时候，任何「史上最强替代」的吆喝都帮不上你。你要的很简单：让活儿先转起来。下面三步，照着做。",
      },
      {
        kind: "points",
        h: "三步恢复工作",
        items: [
          { t: "第一步 · 确认状态，别急着申诉群发", d: "先看清是账号封禁、地区限制，还是临时风控。截图保留证据，官方申诉走一次即可——但别把希望全押在申诉上，恢复周期不由你控制。" },
          { t: "第二步 · 把手上的项目上下文导出来", d: "把当前项目的配置、上下文、常用提示词整理到本地。这是你的资产，和用哪个工具无关。带着它，你换任何工具都能几分钟接上。" },
          { t: "第三步 · 换一个不会因地区被封的工具，先把活干完", d: "你需要的不是又一个可能哪天再把你封掉的云端账号，而是一个跑在你自己电脑上、不看你在哪、不给你打标记的 Agent。" },
        ],
      },
      {
        kind: "points",
        h: "那个不会被封的备选：无为",
        items: [
          { t: "不会因地区被封", d: "无为本地运行，不做地域标记。你的号是你的，不看你在哪、用什么网络。" },
          { t: "数据不出你电脑", d: "项目和代码留在本地，不回传。你能看见它做了什么。" },
          { t: "免费", d: "上善若水，开箱即用。不用订阅、不用信用卡，也不是「软件免费但要你自付 API」。" },
          { t: "迁移零成本", d: "支持导入现有项目上下文与配置，几分钟接回原来的活，不用从头搭。" },
        ],
      },
      {
        kind: "table",
        h: "一眼对比",
        headers: ["你在意的", "无为 / Wuwei", "Claude Code"],
        rows: [
          ["会不会因地区被封", "本地运行，不做地域标记", "据公开报道有地区检测与禁用先例"],
          ["代码 / 数据在哪", "留在你自己的电脑", "依赖云端"],
          ["价格", "免费，无需订阅", "订阅制"],
          ["换过来要多久", "导入现有配置，几分钟", "—"],
        ],
        note: "事件事实与来源，见「无为 vs Claude Code」对比页。",
      },
    ],
  },
};

// 进 sitemap / 被索引的 slug（排除 noindex 门禁页）
export const INDEXABLE_VS_SLUGS = Object.values(VS_PAGES)
  .filter((p) => !p.noindex)
  .map((p) => p.slug);

// ═══════════════════════════════════════════════════════════════════
// 英文对标页矩阵（/en/vs/[slug]）—— 面向 overseas devs 的地道英文，
// 非中文直译。每篇与 /vs/[slug] 中文页互标 hreflang。
// claude-code-alternative 本身已是英文页（在 /vs），故不在此重复，避免重复内容。
// ═══════════════════════════════════════════════════════════════════
export const VS_PAGES_EN: Record<string, VsPage> = {
  // ————————————————————————————————————————————————
  "claude-code-free-alternative": {
    slug: "claude-code-free-alternative",
    locale: "en",
    product: "wuwei",
    meta: {
      title: "The best free Claude Code alternative — Wuwei: local, open, yours",
      description:
        "Want a genuinely free Claude Code alternative? Wuwei is a free, open-source AI coding agent that runs on your own machine. No subscription, no metered API bill, no vendor lock-in. Bring any model.",
    },
    h1: "The best free Claude Code alternative is the one you actually own",
    subhead:
      "Not a stripped-down free tier that nags you to upgrade. A real AI coding agent that's free because that's how a good tool should start.",
    cta: { text: "Download Wuwei — Free", href: "/en#download" },
    secondary: [
      { label: "Got banned already? First aid →", href: "/en/vs/claude-code-account-banned" },
      { label: "中文版 →", href: "/vs/claude-code-free-alternative" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "Most \"free\" alternatives aren't. The app is free, but you still pay per token, wrestle with API keys, or hit a paywall the moment the work gets real. Wuwei is free the whole way through: download it, open it, and start shipping.",
      },
      {
        kind: "points",
        items: [
          { t: "Actually free", d: "No subscription, no credit card, no \"free app, you pay the API\" catch. Wuwei runs out of the box. Free is the starting point, not a trial timer." },
          { t: "Runs locally", d: "Your code and your project stay on your own machine. Nothing is shipped off to a place you can't see." },
          { t: "Open source (MIT)", d: "Read exactly what it does, line by line. No hidden telemetry, no region tagging, no surprises." },
          { t: "Bring any model", d: "Claude, any OpenAI-compatible endpoint, or a local model via vLLM / Ollama. You can walk away anytime — which is exactly why it's safe to stay." },
        ],
      },
      {
        kind: "table",
        h: "How they compare",
        headers: ["What you care about", "Wuwei", "Claude Code", "Cursor"],
        rows: [
          ["Price", "Free, out of the box", "Subscription", "Subscription (~$20/mo)"],
          ["Region bans", "Runs locally, no region tagging", "Region checks reported in the press", "—"],
          ["Where your code lives", "On your own machine", "In the cloud", "In the cloud"],
          ["Open source", "Yes (MIT)", "No", "No"],
          ["Locked to one platform", "No — bring any model", "Tied to its own platform", "Tied to its own platform"],
        ],
        note: "For the reported facts and sources behind the region story, see the comparison page.",
      },
      {
        kind: "prose",
        text:
          "Switching is quick. Coming from Claude Code, you don't start over — import your existing project context and config, and you're back to work in a few minutes.",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "wispr-flow-free-alternative": {
    slug: "wispr-flow-free-alternative",
    locale: "en",
    product: "nian",
    meta: {
      title: "Wispr Flow costs $15/mo. Wuwei Voice is free — and works on Windows",
      description:
        "Looking for a free Wispr Flow alternative? Wuwei Voice is free push-to-talk dictation: hold to speak, get clean auto-punctuated text at your cursor. Works on Windows, keeps your data local.",
    },
    h1: "Wispr Flow wants $15 a month. Wuwei Voice is free — and it runs on Windows",
    subhead:
      "Voice input should feel like breathing: you speak, the words land. That shouldn't cost you a subscription.",
    cta: { text: "Download Wuwei Voice — Free", href: "/nian" },
    secondary: [
      { label: "Want AI that does the work too? Meet Wuwei →", href: "/en/vs/claude-code-free-alternative" },
      { label: "中文版 →", href: "/vs/wispr-flow-free-alternative" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "Good dictation gets out of your way: hold the key, talk, let go — the text is already at your cursor, punctuation and slips cleaned up for you. That's Wuwei Voice. And it's free — not free-for-14-days, just free.",
      },
      {
        kind: "points",
        items: [
          { t: "Free", d: "Against Wispr Flow's $15/month, Wuwei Voice works out of the box with no monthly fee. A tool this basic shouldn't be behind a paywall." },
          { t: "Works on Windows", d: "This is where the competition falls short. Wuwei Voice lives in your Windows tray, ready the moment you press to talk." },
          { t: "Handles mixed speech", d: "Accurate on natural speech, including code terms, product names, and English mixed in. A personal dictionary learns the words you actually use." },
          { t: "AI polish, not raw transcript", d: "It fixes slips, adds punctuation, and tidies the sentence, so what lands is text you can actually use." },
          { t: "Local & private", d: "What you say is processed and gone. It isn't shipped somewhere else." },
        ],
      },
      {
        kind: "table",
        h: "How they compare",
        headers: ["What you care about", "Wuwei Voice", "Wispr Flow", "superwhisper"],
        rows: [
          ["Price", "Free", "~$15/mo", "Subscription / paid"],
          ["Platform", "Windows (more coming)", "Mac / Windows", "Mac only"],
          ["Local processing", "Processed locally", "Cloud-based", "Mostly local"],
          ["AI polish", "Auto-fix + punctuation + cleanup", "Yes", "Yes"],
          ["Personal dictionary", "Yes — learns your words", "Limited", "Limited"],
        ],
      },
      {
        kind: "prose",
        text:
          "Once Wuwei Voice clicks, you'll notice it and Wuwei are cut from the same cloth: one turns your speech into text, the other turns your intent into done work. Both free, both local, both stay out of your way.",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "claude-code-account-banned": {
    slug: "claude-code-account-banned",
    locale: "en",
    product: "wuwei",
    meta: {
      title: "Claude Code account banned? 3 steps to recover + a backup that won't ban you",
      description:
        "Claude Code account banned or cut off? Here are three things to do right now, plus Wuwei — a free, local AI coding agent with no region tagging that gets you back to work in minutes.",
    },
    h1: "Claude Code account banned? Don't panic — 3 steps to get working again, and a backup that can't lock you out",
    subhead:
      "When you're locked out, the urgent thing isn't figuring out why. It's getting the work moving again. Start there.",
    cta: { text: "Download Wuwei — back to work in minutes", href: "/en#download" },
    secondary: [
      { label: "How does Wuwei actually differ from Claude Code? →", href: "/en/vs/wuwei-vs-claude-code" },
      { label: "中文版 →", href: "/vs/claude-code-account-banned" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "You wake up, the account is gone, and a project is stuck halfway. No \"most powerful alternative ever\" pitch helps you here. You need one thing: get the work turning again. Here are three steps — just follow them.",
      },
      {
        kind: "points",
        h: "Three steps to get working again",
        items: [
          { t: "1 · Confirm the status before mass-appealing", d: "Figure out whether it's a ban, a regional block, or a temporary flag. Screenshot the evidence and file one official appeal — but don't stake everything on it. The recovery timeline isn't yours to control." },
          { t: "2 · Export your project context now", d: "Pull your current config, context, and go-to prompts into local files. That's your asset, independent of any tool. With it, you can be productive again in minutes on whatever comes next." },
          { t: "3 · Move to a tool that can't be region-banned", d: "You don't need another cloud account that might lock you out again. You need an agent that runs on your own machine — one that doesn't check where you are or tag you." },
        ],
      },
      {
        kind: "points",
        h: "The backup that can't ban you: Wuwei",
        items: [
          { t: "Can't be region-banned", d: "Wuwei runs locally with no region tagging. Your setup is yours, whatever your location or network." },
          { t: "Your data stays put", d: "Project and code live on your machine and aren't sent back. You can see exactly what it does." },
          { t: "Free", d: "Out of the box, no subscription, no credit card — and no \"free app, you pay the API\" catch." },
          { t: "Zero-cost migration", d: "Import your existing project context and config, and pick up where you left off in minutes. No rebuild." },
        ],
      },
      {
        kind: "table",
        h: "At a glance",
        headers: ["What you care about", "Wuwei", "Claude Code"],
        rows: [
          ["Region-ban risk", "Runs locally, no region tagging", "Region checks & bans reported in the press"],
          ["Where your code lives", "On your own machine", "In the cloud"],
          ["Price", "Free, no subscription", "Subscription"],
          ["Time to switch", "Import config — a few minutes", "—"],
        ],
        note: "For the reported facts and sources, see the Wuwei vs Claude Code comparison page.",
      },
    ],
  },

  // ————————————————————————————————————————————————
  "wuwei-vs-claude-code": {
    slug: "wuwei-vs-claude-code",
    locale: "en",
    product: "wuwei",
    noindex: true, // ⚠️ 同中文门禁页：涉法律/品牌风险，待 CEO 逐句终检后再放开索引
    meta: {
      title: "Wuwei vs Claude Code: whose hands should your code stay in?",
      description:
        "A local, open-source, free AI coding agent. Claude Code has been reported to embed hidden region-detection markers. Wuwei chooses to keep your code in your own hands.",
    },
    h1: "Wuwei vs Claude Code: whose hands should your code stay in?",
    subhead:
      "This isn't a contest over which is stronger. It's a plainer question — every line you write, do you want it to stay with you, or be handed off?",
    cta: { text: "Keep your code in your own hands · Download Wuwei free", href: "/en#download" },
    secondary: [
      { label: "Locked out already? 3 steps back →", href: "/en/vs/claude-code-account-banned" },
      { label: "Just want a free alternative? →", href: "/en/vs/claude-code-free-alternative" },
      { label: "中文版 →", href: "/vs/wuwei-vs-claude-code" },
    ],
    blocks: [
      {
        kind: "prose",
        text:
          "Whether a tool suits you is a matter of taste. But one thing isn't up for debate: your code is yours. We're not here to claim anyone \"crushes\" anyone. We'll lay out two things — facts already reported in public, and the choices Wuwei made on the same questions. You decide.",
      },
      {
        kind: "facts",
        h: "The facts (compiled from public reporting; wording kept neutral, judgment left to you)",
        items: [
          {
            text: "Tom's Hardware reported that, starting from v2.1.91 (2026-04-02), Claude Code was alleged to embed detection and watermarking logic targeting China time zones / proxy environments.",
            source: "https://www.tomshardware.com/tech-industry/artificial-intelligence/alibaba-bans-anthropics-claude-code-after-an-alleged-hidden-china-detection-backdoor-is-uncovered-employees-told-to-switch-to-qoder-as-the-rift-between-the-firms-widens",
          },
          {
            text: "Guancha reported on 2026-07-03 that Anthropic acknowledged embedding hidden markers in the product.",
            source: "https://www.guancha.cn/economy/2026_07_03_822485.shtml",
          },
          {
            text: "BigGo reported that on 2026-07-10 Alibaba flagged it as high-risk and banned it internally company-wide.",
            source: "https://finance.biggo.com/news/a401b1c7-07f5-44e1-9291-cbbd71da342c",
          },
        ],
        note: "We add no emotional spin to any of this. The facts are here; the conclusion is yours to draw.",
      },
      {
        kind: "table",
        h: "Side by side",
        headers: ["Dimension", "Wuwei", "Claude Code"],
        rows: [
          ["Where code / data lives", "Local-first, code stays on your own machine", "Relies on cloud services"],
          ["Open & auditable", "Open source (MIT), reviewable line by line", "Closed; reported to have carried undisclosed detection markers"],
          ["Ban risk", "Runs locally, no region tagging — your account is yours", "Region checks and bans reported in public"],
          ["Platform lock-in", "Model-agnostic: Claude / OpenAI-compatible / local models", "Tied to its own platform and account system"],
          ["Price", "Free, out of the box, no subscription or card", "Subscription"],
        ],
        note: "The \"Wuwei\" column isn't marketing copy — it's the choice the product made from its first line of code.",
      },
      {
        kind: "prose",
        text:
          "Why does Wuwei choose local-first, open source, and no region tagging of any kind? Not to win a row in this table. It's because we believe an older idea: the highest good is like water — it benefits all things and contends with none. A good tool should be open: you can see what it does, and it doesn't make decisions for you where you can't watch. You write the code; it gets the work done — but the pen stays in your hand. One intention, everything done — and \"everything\" never includes quietly taking your things away. That's Wuwei: hand execution to the AI, and keep the code, the choices, and the control in your own hands.",
      },
    ],
  },
};

// 英文页进 sitemap 的 slug（排除 noindex 门禁页）
export const INDEXABLE_VS_SLUGS_EN = Object.values(VS_PAGES_EN)
  .filter((p) => !p.noindex)
  .map((p) => p.slug);
