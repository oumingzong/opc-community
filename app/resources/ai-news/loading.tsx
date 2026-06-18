import Link from "next/link";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";

import { CardSkeleton, Skeleton } from "@/app/_components/ui/loading";

export default function AiNewsCenterLoading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/40 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          返回资源中心
        </Link>

        <div className="mt-5 rounded-3xl border border-cyan-100 bg-white/90 px-6 py-8 sm:px-10 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            AI 前沿资讯中心
          </span>
          <Skeleton className="mb-3 h-10 w-full max-w-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-3xl" />
            <Skeleton className="h-4 w-2/3 max-w-2xl" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              正在加载资讯数据...
            </p>
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}