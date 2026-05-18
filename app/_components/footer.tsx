import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800 text-slate-300">
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-cyan-400 via-blue-500 to-sky-300 opacity-80" />
      <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-white">广州人工智能OPC社区</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
              汇聚广州 AI 开发者与爱好者，共建开放、协作、共享的人工智能生态圈。
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">快捷导航</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="transition-colors hover:text-cyan-200">社区动态</Link></li>
              <li><Link href="/resources" className="transition-colors hover:text-cyan-200">资源中心</Link></li>
              <li><Link href="/resources/offline-events" className="transition-colors hover:text-cyan-200">活动日历</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-cyan-200">关于我们</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">联系我们</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 广州市南沙区</li>
              <li>📧 oujimmy9527@gmail.com</li>
              <li>💬 微信公众号：GZOPC_AI</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 广州人工智能OPC社区. 保留所有权利。</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-cyan-200">隐私政策</Link>
            <Link href="/terms" className="transition-colors hover:text-cyan-200">使用条款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}