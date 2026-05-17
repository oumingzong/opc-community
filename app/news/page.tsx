import { ArrowRight } from "lucide-react";

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

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">社区动态</h1>
            <p className="text-gray-500">了解社区最新技术分享与活动资讯</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
            持续更新 <ArrowRight className="w-4 h-4" />
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n) => (
            <article
              key={n.title}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                  {n.tag}
                </span>
                <span className="text-xs text-gray-400">{n.date}</span>
              </div>
              <h2 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                {n.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
