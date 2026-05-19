import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, RefreshCw } from "lucide-react";

import { getCollaborationList } from "@/lib/collaboration-service";
import { getOfflineEventList } from "@/lib/offline-events-service";

const sourceLabel = {
  default: "当前为默认内置数据",
  api: "当前为后端实时数据",
  fallback: "后端不可用，已回退到默认数据",
} as const;

type CommunityNewsCard = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  detailHref: string;
  typeLabel: "线下活动" | "协作交流";
};

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
  return item.coverImage?.trim() || `https://picsum.photos/seed/opc-community-news-${item.slug}/1200/720`;
}

function getCoverAlt(item: { title: string; coverImageAlt?: string }): string {
  return item.coverImageAlt?.trim() || `${item.title} 预览图`;
}

export default async function NewsPage() {
  const [events, collaborations] = await Promise.all([
    getOfflineEventList({ page: 1, pageSize: 6 }),
    getCollaborationList({ page: 1, pageSize: 6 }),
  ]);

  const communityNews: CommunityNewsCard[] = [
    ...events.items.map((item) => ({
      id: `event-${item.id}`,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      date: item.startAt,
      sourceName: item.organizer,
      sourceUrl: item.sourceUrl,
      tags: item.tags,
      coverImage: item.coverImage,
      coverImageAlt: item.coverImageAlt,
      detailHref: `/resources/offline-events/${item.slug}`,
      typeLabel: "线下活动" as const,
    })),
    ...collaborations.items.map((item) => ({
      id: `collaboration-${item.id}`,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      date: item.publishedAt,
      sourceName: item.organizer,
      sourceUrl: item.sourceUrl,
      tags: item.tags,
      coverImage: item.coverImage,
      coverImageAlt: item.coverImageAlt,
      detailHref: `/resources/collaboration/${item.slug}`,
      typeLabel: "协作交流" as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 9);

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-blue-50/30 py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">社区动态</h1>
            <p className="text-gray-500">聚焦本社区线下活动与协作交流动态</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
            持续更新 <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        <div className="mb-10 rounded-2xl border border-blue-100 bg-white px-5 py-4 text-xs text-slate-600 shadow-sm sm:px-6">
          <p>共 {communityNews.length} 条动态</p>
          <p className="mt-1 inline-flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            活动：{sourceLabel[events.dataSource]}；协作：{sourceLabel[collaborations.dataSource]}
          </p>
          <p className="mt-1">列表接口：/api/offline-events、/api/collaboration</p>
          <p className="mt-1">管理端预留：POST/PATCH/DELETE /api/admin/offline-events、/api/admin/collaboration</p>
          <p className="mt-1">图片字段预留：coverImage、coverImageAlt</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {communityNews.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all bg-white"
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

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                    {item.tags[0] ?? "社区动态"}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {item.typeLabel}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{toHumanDateTime(item.date)}</span>
              </div>

              <Link href={item.detailHref} className="block font-bold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                {item.title}
              </Link>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.summary}</p>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">主办：{item.sourceName}</span>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <Link href={item.detailHref} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">
                    详情
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                  >
                    原文
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
