"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, ExternalLink, Newspaper } from "lucide-react";

interface LatestItem {
  slug: string;
  title: string;
  summary?: string | null;
  source_name?: string;
  published_at?: string | null;
  type?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_CONTENT_API_BASE?.replace(/\/+$/, "") ?? "";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return new Date(dateStr).toLocaleDateString("zh-CN");
}

export default function LatestUpdates() {
  const [items, setItems] = useState<LatestItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!API_BASE) {
      setLoaded(true);
      return;
    }
    const controller = new AbortController();
    fetch(`${API_BASE}/api/public/contents?status=published&pageSize=3`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.items)) {
          setItems(data.items.slice(0, 3));
        }
      })
      .catch(() => { /* silent fallback */ })
      .finally(() => setLoaded(true));
    return () => controller.abort();
  }, []);

  if (!loaded || items.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-3">
              <Newspaper className="h-3.5 w-3.5" />
              最新动态
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              社区最新内容
            </h2>
          </div>
          <Link
            href="/resources/hub"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/resources/hub/${item.slug}`}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-100"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <Clock className="h-3 w-3" />
                {item.published_at ? timeAgo(item.published_at) : "近期"}
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {item.summary.replace(/<[^>]+>/g, "").substring(0, 100)}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="rounded-full bg-gray-100 px-2 py-0.5">
                  {item.source_name ?? "OPC Content Hub"}
                </span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/resources/hub"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
