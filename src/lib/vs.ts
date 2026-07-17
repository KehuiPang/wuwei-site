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
