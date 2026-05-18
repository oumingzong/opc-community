import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, RefreshCw } from "lucide-react";

import { getTechResourceList } from "@/lib/tech-resource-service";

const sourceLabel = {
  default: "当前为默认内置数据",
  api: "当前为后端实时数据",
  fallback: "后端不可用，已回退到默认数据",
} as const;

function toHumanDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function TechResourcesPage() {
  const resources = await getTechResourceList({ page: 1, pageSize: 12 });

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-indigo-50/30 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          返回资源中心
        </Link>

        <div className="mt-5 rounded-3xl border border-indigo-100 bg-white px-6 py-8 sm:px-10 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            技术资源共享
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">把零散资料沉淀为可复用知识资产</h1>
          <p className="text-slate-600 max-w-3xl">
            聚合教程、架构指南与实战手册，支持按标签检索与详情阅读。后续接入管理端后，可持续更新资源并保持前端结构稳定。
          </p>
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <p>共 {resources.total} 条资源</p>
            <p className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {sourceLabel[resources.dataSource]}
            </p>
            <p>列表接口：/api/tech-resources</p>
            <p>详情接口：/api/tech-resources/:slug</p>
            <p>管理端预留：POST/PATCH/DELETE /api/admin/tech-resources</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.items.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">{toHumanDate(item.publishedAt)}</span>
              </div>

              <Link
                href={`/resources/tech-resources/${item.slug}`}
                className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700"
              >
                {item.title}
              </Link>

              <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.summary}</p>

              <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 px-2 py-1">{item.format}</span>
                <span className="rounded-full border border-slate-200 px-2 py-1">{item.level}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">来源：{item.provider}</span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/resources/tech-resources/${item.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-800"
                  >
                    查看详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    原文
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-indigo-300 via-blue-500 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
