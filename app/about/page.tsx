import { Brain, GitBranch, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-400 pt-16 pb-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">关于我们</h1>
        <p className="text-gray-300 max-w-3xl leading-relaxed mb-10">
          广州人工智能 OPC 社区汇聚广州 AI 开发者与爱好者，专注开放、协作、共享。
          我们通过技术分享、线下活动和资源共建，帮助成员持续成长并推动 AI 在本地生态落地。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-sky-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-base">广州人工智能OPC社区</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              汇聚广州 AI 开发者与爱好者，共建开放、协作、共享的人工智能生态圈。
            </p>
            <div className="flex gap-3 mt-6">
              {[GitBranch, Mail].map((Icon, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-white mb-4 text-sm">社区方向</h2>
            <ul className="space-y-2 text-sm">
              <li>技术分享</li>
              <li>资源共建</li>
              <li>活动交流</li>
              <li>项目协作</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-white mb-4 text-sm">联系我们</h2>
            <ul className="space-y-2 text-sm">
              <li>广州市南沙区</li>
              <li>oujimmy9527@gmail.com</li>
              <li>微信公众号：GZOPC_AI</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
