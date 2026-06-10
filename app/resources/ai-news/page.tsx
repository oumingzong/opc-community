import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, RefreshCw, Sparkles } from "lucide-react";

import { getAiNewsList } from "@/lib/ai-news-service";

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

function getCoverImage(item: { slug: string; coverImage?: string }): string {
  return item.coverImage?.trim() || `https://picsum.photos/seed/opc-ai-news-${item.slug}/1200/720`;
}

function getCoverAlt(item: { title: string; coverImageAlt?: string }): string {
  return item.coverImageAlt?.trim() || `${item.title} 预览图`;
}

export default async function AiNewsCenterPage() {
  const news = await getAiNewsList({ page: 1, pageSize: 12 });

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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">可持续更新的 AI 内容页面</h1>
          <p className="text-slate-600 max-w-3xl">
            该页面使用统一数据契约，现已预置真实来源资讯。后续可直接切换为管理端维护的数据，无需改动卡片结构和详情页逻辑。
          </p>
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <p>共 {news.total} 条资讯</p>
            <p className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {sourceLabel[news.dataSource]}
            </p>
            <p>列表接口：/api/ai-news</p>
            <p>详情接口：/api/ai-news/:slug</p>
            <p>管理端预留：POST/PATCH/DELETE /api/admin/ai-news</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {news.items.map((item, idx) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={getCoverImage(item)}
                    alt={getCoverAlt(item)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={idx === 0}
                  />
                </div>
              </div>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {(item.tags ?? []).slice(0, 3).map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">{toHumanDate(item.publishedAt)}</span>
              </div>

              <Link
                href={`/resources/ai-news/${item.slug}`}
                className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700"
              >
                {item.title}
              </Link>

              <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.summary}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">来源：{item.sourceName}</span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/resources/ai-news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
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

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-cyan-300 via-blue-500 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
