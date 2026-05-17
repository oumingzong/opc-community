import Link from "next/link";
import { Users, Mail } from "lucide-react";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="bg-linear-to-br from-blue-600 to-sky-600 rounded-3xl px-8 py-14 shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 relative">
            立即加入
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto relative">
            与 1000+ 成员一起学习成长，第一时间获取 AI 前沿资讯和线下活动通知。
          </p>
          <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:oujimmy9527@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Users className="w-4 h-4" /> 立即加入社区
            </a>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" /> 浏览资源
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
