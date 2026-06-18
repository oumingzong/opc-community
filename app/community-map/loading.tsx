import Link from "next/link";
import { ArrowLeft, Building2, Sparkles } from "lucide-react";

import { Skeleton } from "@/app/_components/ui/loading";

export default function CommunityMapLoading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
            <Skeleton className="h-full w-full rounded-none" />
            <div className="absolute left-6 top-6 rounded-2xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white backdrop-blur-sm sm:left-8 sm:top-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                广州 OPC 社区地图
              </div>
              <Skeleton className="h-8 w-72 bg-white/30" />
              <Skeleton className="mt-3 h-4 w-80 bg-white/25" />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-4">
            <Building2 className="h-3.5 w-3.5" />
            载体介绍
          </div>
          <Skeleton className="h-9 w-64" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full max-w-3xl" />
            <Skeleton className="h-4 w-2/3 max-w-2xl" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <Skeleton className="aspect-[4/3] rounded-none" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-5/6" />
                  <Skeleton className="mt-4 h-4 w-2/3" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}