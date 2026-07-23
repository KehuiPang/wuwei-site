// 三产品详情页内容（中英）。文案来源：品牌中心「产品中心/落地页文案/homepages/*」，
// 由小码搬运落地，非机翻。产品页 = hero + 5 卖点 + 收尾 + 次级对标链接。
import type { Locale } from "./site";

export type Feature = { t: string; d: string };
export type ProductContent = {
  meta: { title: string; description: string };
  hero: { opening?: string[]; h1: string; sub: string };
  cta: string; // 主 CTA 文案（朱色）
  secondary?: { label: string; href: string };
  features: Feature[];
  closing: string;
};

// key → locale → content（目前只有 zh/en 内容，用 Partial 兼容扩展 Locale）
export const PRODUCT_CONTENT: Record<
  "wuwei" | "nian" | "shot",
  Partial<Record<Locale, ProductContent>> & { zh: ProductContent; en: ProductContent }
> = {
  wuwei: {
    zh: {
      meta: {
        title: "无为 — 一念既出，万事自成 | 免费、本地、开源的 AI Agent",
        description:
          "无为是人人可用的 AI 提效客户端。你说一句话，它替你把事做成。免费、开箱即用、本地优先、开源可审计、不锁生态。",
      },
      hero: {
        h1: "一念既出，万事自成",
        sub: "无为，是一个替你把事做成的 AI Agent。你只管发念，余下交给它——代码留在你自己电脑，开源、免费、开箱即用。",
      },
      cta: "免费下载无为",
      secondary: { label: "看看它和 Claude Code 差在哪", href: "/vs/wuwei-vs-claude-code" },
      features: [
        { t: "一句话，把活干成", d: "通用 + 编程一体的 AI Agent。查、改、跑、连一整套工作流，一个念头就接住。" },
        { t: "真免费，不是试用", d: "开箱即用，不用订阅、不用信用卡，也不是「软件免费、API 自付」。免费是我们的价值观，不是限时噱头。" },
        { t: "代码留在你自己手里", d: "本地优先，项目和数据不出你电脑。开源可审计，它做了什么你逐行看得见——没有你看不见的地方。" },
        { t: "模型自由，随时能走", d: "接 Claude、任意 OpenAI 兼容端点、国产模型都行。不锁生态、不绑账号。你随时能走，所以你可以安心留下。" },
        { t: "省力，是它唯一的执念", d: "删繁就简，不炫技。好工具让你少做、不做，而事自成。" },
      ],
      closing:
        "你，就是那一点朱；无为，替你把圆画完。把执行交给它，把创造、判断、生活，交回你自己。这，就是无为。",
    },
    en: {
      meta: {
        title: "Wuwei — One intention. Everything done. | A free, local, open AI agent",
        description:
          "Wuwei is an AI agent that gets things done for you. Say what you want, and it does the work. Free, local-first, open source, and never locked to one platform.",
      },
      hero: {
        h1: "One intention. Everything done.",
        sub: "Wuwei is an AI agent that gets the work done for you. You set the intent, it handles the rest. Your code stays on your machine. Open source, free, ready out of the box.",
      },
      cta: "Download Wuwei — Free",
      secondary: { label: "See how it compares to Claude Code", href: "/vs/wuwei-vs-claude-code" },
      features: [
        { t: "Say it once, it gets done", d: "A general-purpose agent that also codes. Search, edit, run, connect — one workflow, one intent." },
        { t: "Free, not a trial", d: "Works out of the box. No subscription, no credit card, no “free app, pay-your-own-API” catch. Free is how we think it should be." },
        { t: "Your code stays yours", d: "Local-first. Your projects and data never leave your machine. Open source, so you can read exactly what it does." },
        { t: "Bring any model, leave anytime", d: "Claude, any OpenAI-compatible endpoint, or a local model. No lock-in, no tied account. You can walk away whenever, which is why it's safe to stay." },
        { t: "Effortless is the whole point", d: "No clutter, no showing off. A good tool lets you do less while more gets done." },
      ],
      closing:
        "You are the single spark of intent. Wuwei completes the circle. Hand it the execution, and keep the creating, the judgment, the living for yourself. That's Wuwei.",
    },
  },

  nian: {
    zh: {
      meta: {
        title: "无为念 — 让表达，追上思考 | AI 时代的语音输入",
        description:
          "打字让我们迁就了机器几十年。无为念把它翻过来：你只管开口，话实时落成文字、自动润色，进你正在打字的地方。免费、跨平台、中文友好、数据本地。",
      },
      hero: {
        opening: [
          "打字这件事，我们做了几十年，做到以为它天经地义。",
          "可它从来不自然——是人在迁就机器，把心里那句已经成型的话，拆成一颗颗按键，一个字母一个字母敲出来。",
          "现在，反过来了。你只管开口，话自己落成字。",
        ],
        h1: "让表达，追上思考",
        sub: "无为念，是 AI 时代的语音输入。按住说话，它实时转成文字、顺手把口误和标点理好，落进你正打字的地方。你什么都没多做，字已成——这是「无为」，也是表达本该有的样子：回到说话，回到不费力。",
      },
      cta: "免费下载无为念",
      secondary: { label: "对比 Wispr Flow，为什么免费还更顺手", href: "/vs/wispr-flow-free-alternative" },
      features: [
        { t: "按住说，松手成文", d: "微信、文档、浏览器，光标在哪，字就落在哪。不切窗口、不复制粘贴——说完就在那儿了。" },
        { t: "AI 替你把话说圆", d: "不是生硬的听写。口误、重复、缺的标点，它顺手补齐，落下来就是能直接发出去的一段话。" },
        { t: "中文越用越懂你", d: "中文识别准，中英混、术语、人名都接得住。自带私人记忆库，你常用的词它记得住，越用越贴。" },
        { t: "免费，且跨平台", d: "开箱即用，不收月费；Windows 上托盘常驻，随叫随到。免费，是我们的立场，不是限时的饵。" },
        { t: "你说的话，留在本地", d: "语音在你自己机器上处理，用完即散，不送去别处。" },
      ],
      closing:
        "我们迁就键盘太久了。语音，是人最早学会的表达，现在它也成了最快的那个。你只管开口——一念既出，落字自成。",
    },
    en: {
      meta: {
        title: "Wuwei Voice — Let your words keep up with your mind | Voice input for the AI era",
        description:
          "We bent to the keyboard for decades. Wuwei Voice turns it around: just speak, and your words land as text in real time, cleaned up, right where you're typing. Free, cross-platform, local.",
      },
      hero: {
        opening: [
          "We've typed for so long we call it natural.",
          "It never was. Typing is us bending to the machine, breaking a thought that's already whole into keystrokes, one slow letter at a time.",
          "Now it turns around. You speak, and the words find their place.",
        ],
        h1: "Your mind moves fast. Now your words can too.",
        sub: "Wuwei Voice is voice input for the AI era. Hold to speak, and it transcribes in real time, smooths the slips and punctuation, and drops the text right where you're already typing. You did nothing extra, yet it's written. That's wu wei — the way expression was always meant to feel.",
      },
      cta: "Download Wuwei Voice — Free",
      secondary: { label: "See why it beats a $15/mo tool", href: "/vs/wispr-flow-free-alternative" },
      features: [
        { t: "Hold, speak, and it's written", d: "Chat apps, docs, the browser — the words land wherever your cursor is. No switching, no paste. You stop talking, and it's already there." },
        { t: "AI rounds out what you said", d: "Not raw dictation. It fixes the slips, trims the repeats, adds the punctuation you skipped, so what lands is a passage you can send as is." },
        { t: "It learns your words", d: "Accurate with Chinese, fine with mixed English, jargon, and names. A private memory holds your common terms, so it fits you better the more you talk." },
        { t: "Free, and cross-platform", d: "Works out of the box, no monthly fee. Lives in the Windows tray, ready when you are. Free is where we stand, not bait with a timer." },
        { t: "What you say stays local", d: "Your voice is processed on your own machine. Used once, then gone. Nothing shipped off." },
      ],
      closing:
        "We bent to the keyboard for too long. Speaking is the first language we ever learned — now it's the fastest one too. Just speak, and the words settle into place.",
    },
  },

  shot: {
    zh: {
      meta: {
        title: "无为截 — 截图，会思考了 | 框住屏幕，AI 直接读懂",
        description:
          "过去截图只是复制一堆像素。无为截让你框住屏幕上任何东西，AI 直接读懂：翻译、识别、追问、变成下一步。一按即截，还带标注。免费、轻量。",
      },
      hero: {
        opening: [
          "截图这个动作，几十年没变过：框一块屏幕，复制一堆像素。",
          "它一直很笨——你截下的是画面，不是意思；看得懂的，只有你自己。",
          "现在不一样了。你框住的东西，它读得懂。",
        ],
        h1: "截图，会思考了",
        sub: "无为截，框住屏幕上任何东西——一段外文、一条报错、一张图表。它不再只是复制像素，而是读懂你框住的意图：一步翻译、识别、直接追问 AI。截图，从「复制画面」变成「复制意图」。轻，快，免费。",
      },
      cta: "免费下载无为截",
      secondary: { label: "配上无为本尊，截完直接让 AI 干活", href: "/wuwei" },
      features: [
        { t: "一按即截，顺手即得", d: "Alt+A 拖框、✓ 确认，截图自动进剪贴板，随处 Ctrl+V。不打断你手上的事。" },
        { t: "框住，它就读懂", d: "外文一框就译，文字一框就提，图表一框就解。你要的是里面的意思，不是那张图——它给你意思。" },
        { t: "截完，直接问", d: "不用另存再上传。截完就能问无为 AI：这是什么、怎么改、帮我写。所见，即可问。" },
        { t: "标注够用就好", d: "箭头、文字、马赛克，该圈的圈、该遮的遮。克制，不堆一屏用不上的按钮。" },
        { t: "轻到你忘了它在", d: "跨平台、体积小、常驻不占地方。道法自然，交互如呼吸。" },
      ],
      closing:
        "过去你截下一张图，得自己看懂它。现在，你框住的是意图，读懂它的事，交给无为。所见，即得。",
    },
    en: {
      meta: {
        title: "Wuwei Shot — Screenshots that think | Frame it, and AI reads it",
        description:
          "Screenshots used to copy a block of pixels. Wuwei Shot lets you frame anything on your screen and have AI read it: translate, extract, ask, act. One hotkey to capture, annotate if you need. Free and light.",
      },
      hero: {
        opening: [
          "Screenshots haven't changed in decades: frame a piece of your screen, copy a block of pixels.",
          "They've always been dumb — you capture the picture, not the meaning, and only you can read it.",
          "That's over. Now whatever you frame, it understands.",
        ],
        h1: "Screenshots that think",
        sub: "Wuwei Shot lets you frame anything on your screen — a line of foreign text, an error, a chart. It no longer just copies pixels; it reads the intent behind what you framed: translate it, extract it, ask AI about it in one step. From copying pixels to copying intent. Light, fast, free.",
      },
      cta: "Download Wuwei Shot — Free",
      secondary: { label: "Pair it with Wuwei and put AI to work", href: "/en" },
      features: [
        { t: "Snap, and it's ready", d: "Alt+A to drag, ✓ to confirm, and the shot is in your clipboard for Ctrl+V anywhere. It stays out of your flow." },
        { t: "Frame it, and it gets it", d: "Frame foreign text and it translates. Frame words and it extracts them. Frame a chart and it explains. You wanted the meaning, not the image — it gives you the meaning." },
        { t: "Snap, then ask", d: "No saving and re-uploading. Snap, then ask Wuwei: what is this, how do I fix it, write this for me. See it, ask it." },
        { t: "Just enough annotation", d: "Arrows, text, mosaic. Circle what matters, hide what shouldn't show. No wall of buttons you'll never touch." },
        { t: "Light enough to forget", d: "Cross-platform, small, quietly there. The interaction feels like breathing." },
      ],
      closing:
        "You used to capture an image and make sense of it yourself. Now you frame the intent, and reading it is Wuwei's job. What you see is what you get.",
    },
  },
};
