const fs = require('fs');

const layout = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "广州人工智能OPC社区",
  description: "广州人工智能OPC社区 - 探索AI无限可能，汇聚本地AI爱好者、开发者与研究者，共建开放协作的人工智能生态",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={\`\${geistSans.variable} \${geistMono.variable} h-full antialiased\`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
`;

const page = `"use client";

import {
  Brain,
  Users,
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkles,
  Globe,
  MessageSquare,
  GitBranch,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { label: "社区动态", href: "#news" },
    { label: "资源中心", href: "#resources" },
    { label: "关于我们", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base text-gray-900">
              广州人工智能
              <span className="bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                OPC社区
              </span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#join"
              className="text-sm px-4 py-2 rounded-full text-white font-semibold bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-opacity shadow-md shadow-indigo-200"
            >
              立即加入
            </a>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-indigo-50"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-indigo-50 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-gray-700 hover:text-indigo-600 font-medium py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setOpen(false)}
            className="block w-full text-center text-sm px-4 py-2 rounded-full text-white font-semibold bg-linear-to-r from-indigo-500 to-purple-600"
          >
            立即加入
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
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
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-200 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          广州最活跃的人工智能开发者社区
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          探索 AI{" "}
          <span className="bg-linear-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            无限可能
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          汇聚广州本地 AI 爱好者、开发者与研究者，共享前沿资讯、深度资源与线下交流，共建开放协作的人工智能生态。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#join"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-indigo-700 font-bold text-base hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30"
          >
            加入社区 <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#resources"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            浏览资源
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80H1440V40C1200 0 960 80 720 40C480 0 240 80 0 40V80Z" fill="#f8fafc" />
        </svg>
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
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
  },
  {
    icon: Users,
    title: "开放协作交流",
    desc: "与广州本地的 AI 开发者、创业者面对面交流，碰撞创意，共同解决技术难题。",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
  },
  {
    icon: BookOpen,
    title: "技术资源共享",
    desc: "汇集优质教程、开源项目、数据集与工具，免费共享，加速你的 AI 学习与开发之旅。",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
  },
  {
    icon: Calendar,
    title: "线下活动沙龙",
    desc: "定期举办技术讲座、黑客松、读书会等线下活动，与志同道合的人共同成长。",
    color: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
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
            return (
              <div
                key={f.title}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className={\`inline-flex p-3 rounded-xl \${f.bg} mb-4\`}>
                  <div
                    className={\`w-6 h-6 bg-linear-to-br \${f.color} rounded-md flex items-center justify-center\`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div
                  className={\`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r \${f.color} opacity-0 group-hover:opacity-100 transition-opacity\`}
                />
              </div>
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
                <p className="text-indigo-200 text-sm font-medium">{s.label}</p>
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

function News() {
  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">社区动态</h2>
            <p className="text-gray-500">了解社区最新技术分享与活动资讯</p>
          </div>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:gap-2 transition-all"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n) => (
            <article
              key={n.title}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {n.tag}
                </span>
                <span className="text-xs text-gray-400">{n.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
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

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section id="join" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl px-8 py-14 shadow-2xl shadow-indigo-200 relative overflow-hidden">
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
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            与 1000+ 成员一起学习成长，第一时间获取 AI 前沿资讯和线下活动通知。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              <Users className="w-4 h-4" /> 立即加入社区
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" /> 订阅周刊
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="about" className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-base">广州人工智能OPC社区</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              汇聚广州 AI 开发者与爱好者，共建开放、协作、共享的人工智能生态圈。
            </p>
            <div className="flex gap-3 mt-6">
              {[GitBranch, X, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">快捷导航</h4>
            <ul className="space-y-2 text-sm">
              {["社区动态", "资源中心", "活动日历", "关于我们"].map((t) => (
                <li key={t}>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">联系我们</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 广州市天河区</li>
              <li>📧 hello@opc-ai.com</li>
              <li>💬 微信公众号：GZOPC_AI</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© 2026 广州人工智能OPC社区. 保留所有权利。</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-gray-400 transition-colors">使用条款</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <News />
      <CTABanner />
      <Footer />
    </main>
  );
}
`;

fs.writeFileSync('app/layout.tsx', Buffer.from(layout, 'utf-8'));
fs.writeFileSync('app/page.tsx', Buffer.from(page, 'utf-8'));
console.log('Files created with proper UTF-8 encoding!');