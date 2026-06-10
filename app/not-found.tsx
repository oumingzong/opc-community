import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold bg-linear-to-r from-blue-500 to-sky-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          页面未找到
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          抱歉，您访问的页面不存在或已被移除。请检查链接是否正确，或返回首页继续浏览。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
          >
            <Home className="h-4 w-4" />
            返回首页
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Search className="h-4 w-4" />
            浏览资源
          </Link>
        </div>
      </div>
    </main>
  );
}
