"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CommunityMapError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="mt-5 rounded-3xl border border-red-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">社区地图加载失败</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
            地图点位或载体数据暂时无法加载，请稍后重试。若问题持续出现，可先返回首页浏览其他内容。
          </p>

          {error.message && (
            <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-slate-50 px-4 py-3 text-left text-xs leading-6 text-slate-500">
              错误信息：{error.message}
            </p>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
            >
              <RefreshCw className="h-4 w-4" />
              重新加载
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              返回首页
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}