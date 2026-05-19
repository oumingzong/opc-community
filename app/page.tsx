import {
  Brain,
  Users,
  BookOpen,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
  Globe,
  MessageSquare,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { getPolicyPreview } from "./data/policies";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--opc-gradient-hero)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600 rounded-full opacity-20 blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          广州最活跃的人工智能开发者社区
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          探索 AI{" "}
          <span className="bg-linear-to-r from-blue-300 to-sky-300 bg-clip-text text-transparent">
            无限可能
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          汇聚广州本地 AI 爱好者、开发者与研究者，共享前沿资讯、深度资源与线下交流，共建开放协作的人工智能生态。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/community-map"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            广州OPC载体 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-bold text-base hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/30"
          >
            加入社区 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            了解更多
          </Link>
        </div>
      </div>

    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI 前沿资讯",
    desc: "第一时间获取国内外最新 AI 技术进展、论文解读与产品动态，保持技术敏锐度。",
    color: "from-blue-500 to-blue-500",
    bg: "bg-blue-50",
    href: "/resources/ai-news",
  },
  {
    icon: Users,
    title: "开放协作交流",
    desc: "与广州本地的 AI 开发者、创业者面对面交流，碰撞创意，共同解决技术难题。",
    color: "from-sky-500 to-teal-500",
    bg: "bg-sky-50",
    href: "/resources/collaboration",
  },
  {
    icon: BookOpen,
    title: "技术资源共享",
    desc: "汇集优质教程、开源项目、数据集与工具，免费共享，加速你的 AI 学习与开发之旅。",
    color: "from-indigo-500 to-sky-500",
    bg: "bg-indigo-50",
    href: "/resources/tech-resources",
  },
  {
    icon: Calendar,
    title: "线下活动沙龙",
    desc: "定期举办技术讲座、黑客松、读书会等线下活动，与志同道合的人共同成长。",
    color: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
    href: "/resources/offline-events",
  },
];

function Features() {
  return (
    <section id="resources" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            社区能为你带来什么？
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            我们致力于为每位成员提供最有价值的 AI 学习与交流体验。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            const Card = f.href ? Link : "div";
            return (
              <Card
                key={f.title}
                href={f.href}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                  <div
                    className={`w-6 h-6 bg-linear-to-br ${f.color} rounded-md flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { icon: Users, value: "1,000+", label: "社区成员" },
  { icon: MessageSquare, value: "500+", label: "技术话题" },
  { icon: BookOpen, value: "200+", label: "学习资源" },
  { icon: Calendar, value: "50+", label: "线下活动" },
];

function Stats() {
  return (
    <section className="py-20" style={{ background: "var(--opc-gradient)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-extrabold text-white">{s.value}</p>
                <p className="text-blue-200 text-sm font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── News ─────────────────────────────────────────────────────────────────────
const news = [
  {
    tag: "技术分享",
    date: "2026年4月20日",
    title: "深度解析：GPT-5 多模态能力与本地部署实践",
    desc: "本次分享深入探讨了 GPT-5 的多模态新特性，以及如何在本地服务器高效部署推理服务。",
  },
  {
    tag: "社区活动",
    date: "2026年4月15日",
    title: "OPC 第 12 届 AI 黑客松圆满落幕",
    desc: "来自广州各高校和企业的 200+ 开发者参与，共产出 36 个创新 AI 项目原型。",
  },
  {
    tag: "资源推荐",
    date: "2026年4月10日",
    title: "2026 年必读：AI Agent 开发精选资料合集",
    desc: "社区成员共同整理，涵盖 LangGraph、AutoGen、OpenAI Assistants 等主流 Agent 框架的学习路径。",
  },
];

const policyPreview = getPolicyPreview(3);

function News() {
  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">社区动态</h2>
            <p className="text-gray-500">了解社区最新技术分享与活动资讯</p>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:gap-2 transition-all"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n) => (
            <article
              key={n.title}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                  {n.tag}
                </span>
                <span className="text-xs text-gray-400">{n.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                {n.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Policy Preview ──────────────────────────────────────────────────────────
function PolicyPreview() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-white border border-blue-100 rounded-full px-3 py-1 mb-3">
              <FileText className="w-4 h-4" />
              政策预览
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">相关政策</h2>
            <p className="text-gray-500">聚合广州人工智能相关政策，帮助你快速掌握最新方向。</p>
          </div>
          <Link
            href="/policy"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            查看全部政策 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policyPreview.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-gray-900 leading-snug">{item.title}</h3>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p>{item.issuer}</p>
                <p>{item.date}</p>
              </div>
              <Link
                href="/policy"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                查看政策详情 <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="sm:hidden mt-8">
          <Link
            href="/policy"
            className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-linear-to-r from-blue-500 to-sky-600 text-white px-5 py-3 font-semibold"
          >
            查看全部政策 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section id="join" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="bg-linear-to-br from-blue-600 to-sky-600 rounded-3xl px-8 py-14 shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <Globe className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            加入广州 AI 开发者大家庭
          </h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            与 1000+ 成员一起学习成长，第一时间获取 AI 前沿资讯和线下活动通知。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Users className="w-4 h-4" /> 立即加入社区
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" /> 浏览资源
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Stats />
      <News />
      <PolicyPreview />
      <CTABanner />
    </main>
  );
}
