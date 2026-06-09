import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, ExternalLink, MapPin, RefreshCw } from "lucide-react";

import { getOfflineEventList } from "@/lib/offline-events-service";

const sourceLabel = {
  default: "当前为默认内置数据",
  api: "当前为后端实时数据",
  fallback: "后端不可用，已回退到默认数据",
} as const;

function toHumanDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCoverImage(item: { slug: string; coverImage?: string }): string {
  return item.coverImage?.trim() || `https://picsum.photos/seed/opc-offline-events-${item.slug}/1200/720`;
}

function getCoverAlt(item: { title: string; coverImageAlt?: string }): string {
  return item.coverImageAlt?.trim() || `${item.title} 预览图`;
}

export default async function OfflineEventsPage() {
  const events = await getOfflineEventList({ page: 1, pageSize: 12 });

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          返回资源中心
        </Link>

        <div className="mt-5 rounded-3xl border border-cyan-100 bg-white px-6 py-8 sm:px-10 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-3">
            <Calendar className="h-3.5 w-3.5" />
            线下活动沙龙
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">把线下活动组织成持续发生的技术连接</h1>
          <p className="text-slate-600 max-w-3xl">
            聚合社区沙龙、专题分享与活动回顾，支持统一发布和详情展示。后续可接管理端实现活动全生命周期运营。
          </p>
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <p>共 {events.total} 场活动</p>
            <p className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {sourceLabel[events.dataSource]}
            </p>
            <p>列表接口：/api/offline-events</p>
            <p>详情接口：/api/offline-events/:slug</p>
            <p>管理端预留：POST/PATCH/DELETE /api/admin/offline-events</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.items.map((item) => (
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
              </div>

              <Link
                href={`/resources/offline-events/${item.slug}`}
                className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700"
              >
                {item.title}
              </Link>

              <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.summary}</p>

              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <p className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {toHumanDateTime(item.startAt)}
                </p>
                <p className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.venue}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">主办：{item.organizer}</span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/resources/offline-events/${item.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                  >
                    详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    来源
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
