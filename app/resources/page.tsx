import Link from "next/link";
import { ArrowRight, ExternalLink, MapPin } from "lucide-react";

import { getAiNewsList } from "@/lib/ai-news-service";
import { getCollaborationList } from "@/lib/collaboration-service";
import { getOfflineEventList } from "@/lib/offline-events-service";
import { getTechResourceList } from "@/lib/tech-resource-service";

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

export default async function ResourcesPage() {
  const news = await getAiNewsList({ page: 1, pageSize: 3 });
  const collaborations = await getCollaborationList({ page: 1, pageSize: 3 });
  const techResources = await getTechResourceList({ page: 1, pageSize: 3 });
  const offlineEvents = await getOfflineEventList({ page: 1, pageSize: 3 });

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <section className="bg-linear-to-b from-cyan-50 via-blue-50 to-white py-12 px-0 -mx-4 sm:-mx-6 lg:-mx-8 mb-20 sm:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">AI 前沿资讯</h2>
            <Link href="/resources/ai-news" className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-blue-600 hover:text-blue-700">
              查看完整资讯中心
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {news.items.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={`${item.id}-${tag}`} className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{toHumanDate(item.publishedAt)}</span>
                </div>

                <Link href={`/resources/ai-news/${item.slug}`} className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700">
                  {item.title}
                </Link>

                <p className="mb-5 text-sm leading-relaxed text-slate-600">{item.summary}</p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">来源：{item.sourceName}</span>
                  <div className="flex flex-nowrap items-center gap-3 whitespace-nowrap">
                    <Link href={`/resources/ai-news/${item.slug}`} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800">
                      详情
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700">
                      原文
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-cyan-300 via-blue-500 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/resources/ai-news" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white">
              查看完整资讯中心
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-sky-50 via-cyan-50 to-white py-12 px-0 -mx-4 sm:-mx-6 lg:-mx-8 mb-20 sm:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-sky-700 to-cyan-700 bg-clip-text text-transparent">开放协作交流</h2>
            <Link href="/resources/collaboration" className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-sky-700 hover:text-sky-800">
              查看完整协作页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {collaborations.items.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={`${item.id}-${tag}`} className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{toHumanDate(item.publishedAt)}</span>
                </div>

                <Link href={`/resources/collaboration/${item.slug}`} className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700">
                  {item.title}
                </Link>

                <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.summary}</p>

                <p className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">主办：{item.organizer}</span>
                  <Link href={`/resources/collaboration/${item.slug}`} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800">
                    详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-sky-300 via-blue-500 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/resources/collaboration" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-sky-500 to-cyan-600 px-5 py-3 text-sm font-semibold text-white">
              查看完整协作页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-indigo-50 via-purple-50 to-white py-12 px-0 -mx-4 sm:-mx-6 lg:-mx-8 mb-20 sm:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">技术资源共享</h2>
            <Link href="/resources/tech-resources" className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-indigo-700 hover:text-indigo-800">
              查看完整资源页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {techResources.items.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={`${item.id}-${tag}`} className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{toHumanDate(item.publishedAt)}</span>
                </div>

                <Link href={`/resources/tech-resources/${item.slug}`} className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-700">
                  {item.title}
                </Link>

                <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.summary}</p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">来源：{item.provider}</span>
                  <Link href={`/resources/tech-resources/${item.slug}`} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-800">
                    详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-indigo-300 via-blue-500 to-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/resources/tech-resources" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-indigo-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white">
              查看完整资源页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-orange-50 via-amber-50 to-white py-12 px-0 -mx-4 sm:-mx-6 lg:-mx-8 mb-20 sm:rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold bg-linear-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">线下活动沙龙</h2>
            <Link href="/resources/offline-events" className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-orange-700 hover:text-orange-800">
              查看完整活动页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {offlineEvents.items.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={`${item.id}-${tag}`} className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{toHumanDate(item.startAt)}</span>
                </div>

                <Link href={`/resources/offline-events/${item.slug}`} className="mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-orange-700">
                  {item.title}
                </Link>

                <p className="mb-4 text-sm leading-relaxed text-slate-600">{item.summary}</p>

                <p className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.venue}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">主办：{item.organizer}</span>
                  <Link href={`/resources/offline-events/${item.slug}`} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-orange-700 transition-colors hover:text-orange-800">
                    详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-orange-300 via-amber-500 to-yellow-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/resources/offline-events" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-600 px-5 py-3 text-sm font-semibold text-white">
              查看完整活动页
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
