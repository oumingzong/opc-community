import Image from "next/image";
import { Brain, Compass, Handshake, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 pt-16 pb-16 text-slate-700">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-4">
            <Brain className="h-3.5 w-3.5" />
            OPC Community
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">关于我们</h1>
          <p className="leading-8 text-slate-600">
            广州人工智能 OPC 社区由开发者、产品经理、研究人员和 AI 爱好者共同发起，
            目标是打造一个长期、开放、可持续的本地 AI 协作网络。
            我们相信，真正有生命力的社区不只是做活动，而是持续连接人、问题与实践。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">我们在做什么</h2>
            <p className="leading-8 text-slate-600 mb-4">
              社区以真实场景为起点，围绕 AI Agent、RAG、模型评测、工程化落地等主题，
              组织持续性的线下沙龙、读书会、共创工作坊与项目协作活动。
            </p>
            <p className="leading-8 text-slate-600">
              从入门同学到有实战经验的团队，都可以在这里找到适合自己的学习路径与协作机会，
              并通过公开分享把经验沉淀为可复用的社区资产。
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
              alt="社区成员围绕白板进行协作讨论"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="relative order-2 lg:order-1 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80"
              alt="社区活动现场与技术分享演讲"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">我们的价值与方向</h2>
            <div className="space-y-4">
              <p className="inline-flex items-start gap-2 leading-7 text-slate-600">
                <Compass className="h-4 w-4 mt-1 text-cyan-700" />
                聚焦“从概念到落地”的真实路径，减少信息噪声，强化可执行的方法论。
              </p>
              <p className="inline-flex items-start gap-2 leading-7 text-slate-600">
                <Handshake className="h-4 w-4 mt-1 text-cyan-700" />
                连接高校、企业与独立开发者，推动跨团队协作与本地创新项目孵化。
              </p>
              <p className="inline-flex items-start gap-2 leading-7 text-slate-600">
                <Mail className="h-4 w-4 mt-1 text-cyan-700" />
                联系方式：oujimmy9527@gmail.com｜微信公众号：GZOPC_AI
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
