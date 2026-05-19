import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, ExternalLink, MapPin, RefreshCw, Users } from "lucide-react";
import { notFound } from "next/navigation";

import { getOfflineEventDetail } from "@/lib/offline-events-service";

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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OfflineEventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getOfflineEventDetail(slug);

  if (!result) {
    notFound();
  }

  const { item, dataSource } = result;

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/resources/offline-events"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          返回线下活动沙龙
        </Link>

        <header className="mt-5 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={getCoverImage(item)}
                alt={getCoverAlt(item)}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">{item.title}</h1>

          <div className="mt-4 text-sm text-slate-500 space-y-1">
            <p className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              开始时间：{toHumanDateTime(item.startAt)}
            </p>
            {item.endAt ? (
              <p className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                结束时间：{toHumanDateTime(item.endAt)}
              </p>
            ) : null}
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              地点：{item.venue}
            </p>
            <p className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              主办：{item.organizer}
            </p>
            {item.capacity ? <p>规模：{item.capacity} 人</p> : null}
            <p className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {sourceLabel[dataSource]}
            </p>
            <p>详情接口：/api/offline-events/{item.slug}</p>
          </div>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            查看外部来源
            <ExternalLink className="h-4 w-4" />
          </a>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-3">活动介绍</h2>
          <p className="text-slate-700 leading-8">{item.content}</p>

          <div className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
            <h3 className="text-sm font-bold text-cyan-800">后端对接预留（管理端）</h3>
            <ul className="mt-2 space-y-1 text-sm text-cyan-900">
              <li>POST /api/admin/offline-events：新增活动</li>
              <li>PATCH /api/admin/offline-events/:slug：更新活动</li>
              <li>DELETE /api/admin/offline-events/:slug：删除活动</li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
