import { Brain, Users, BookOpen, Calendar } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI 前沿资讯",
    desc: "第一时间获取国内外最新 AI 技术进展、论文解读与产品动态，保持技术敏锐度。",
    color: "from-blue-500 to-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Users,
    title: "开放协作交流",
    desc: "与广州本地的 AI 开发者、创业者面对面交流，碰撞创意，共同解决技术难题。",
    color: "from-sky-500 to-teal-500",
    bg: "bg-sky-50",
  },
  {
    icon: BookOpen,
    title: "技术资源共享",
    desc: "汇集优质教程、开源项目、数据集与工具，免费共享，加速你的 AI 学习与开发之旅。",
    color: "from-indigo-500 to-sky-500",
    bg: "bg-indigo-50",
  },
  {
    icon: Calendar,
    title: "线下活动沙龙",
    desc: "定期举办技术讲座、黑客松、读书会等线下活动，与志同道合的人共同成长。",
    color: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">资源中心</h1>
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
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                  <div
                    className={`w-6 h-6 bg-linear-to-br ${f.color} rounded-md flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
