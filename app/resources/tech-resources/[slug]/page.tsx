import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, RefreshCw } from "lucide-react";
import { notFound } from "next/navigation";

import { getTechResourceDetail } from "@/lib/tech-resource-service";

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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TechResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getTechResourceDetail(slug);

  if (!result) {
    notFound();
  }

  const { item, dataSource } = result;

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-indigo-50/30 py-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/resources/tech-resources"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          返回技术资源共享
        </Link>

        <header className="mt-5 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">{item.title}</h1>

          <div className="mt-4 text-sm text-slate-500 space-y-1">
            <p>发布时间：{toHumanDate(item.publishedAt)}</p>
            <p>提供方：{item.provider}</p>
            <p className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              类型：{item.format} · 难度：{item.level}
            </p>
            <p className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {sourceLabel[dataSource]}
            </p>
            <p>详情接口：/api/tech-resources/{item.slug}</p>
          </div>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            查看官方原文
            <ExternalLink className="h-4 w-4" />
          </a>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-3">资源解读</h2>
          <p className="text-slate-700 leading-8">{item.content}</p>

          <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <h3 className="text-sm font-bold text-indigo-800">后端对接预留（管理端）</h3>
            <ul className="mt-2 space-y-1 text-sm text-indigo-900">
              <li>POST /api/admin/tech-resources：新增资源</li>
              <li>PATCH /api/admin/tech-resources/:slug：更新资源</li>
              <li>DELETE /api/admin/tech-resources/:slug：删除资源</li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
