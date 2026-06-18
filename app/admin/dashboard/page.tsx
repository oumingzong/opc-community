"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchDashboardStats, fetchReviewList } from "@/lib/admin-api";
import { PageLoading } from "@/app/_components/ui/loading";
import { EmptyState } from "@/app/_components/ui/empty-state";
import type { DashboardStats } from "@/lib/admin-types";

const STATUS_CONFIG = [
  { key: "draftCount" as const, label: "待审核", color: "bg-amber-500", textColor: "text-amber-700" },
  { key: "publishedCount" as const, label: "已发布", color: "bg-green-500", textColor: "text-green-700" },
  { key: "rejectedCount" as const, label: "已拒绝", color: "bg-red-500", textColor: "text-red-700" },
  { key: "archivedCount" as const, label: "已归档", color: "bg-gray-500", textColor: "text-gray-600" },
];

const TYPE_LABELS: Record<string, string> = {
  news: "AI 资讯",
  "tech-resource": "技术资源",
  collaboration: "协作",
  "offline-event": "线下活动",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleManualIngest = async () => {
    setIngesting(true);
    setIngestResult(null);
    try {
      const token = process.env.NEXT_PUBLIC_CONTENT_HUB_ADMIN_TOKEN ?? "";
      const baseUrl =
        process.env.NEXT_PUBLIC_CONTENT_API_BASE?.replace(/\/+$/, "") ??
        "http://127.0.0.1:8787";

      const resp = await fetch(`${baseUrl}/internal/ingest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        setIngestResult(`✅ 抓取完成: 入库 ${data.insertedTotal} 条`);
        void loadStats();
      } else {
        setIngestResult(`❌ 抓取失败: ${data.error ?? "Unknown"}`);
      }
    } catch (err) {
      setIngestResult(`❌ 请求失败: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setIngesting(false);
    }
  };

  if (loading) return <PageLoading text="加载统计中..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">📊 数据统计</h1>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          加载失败: {error}
        </div>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          重新加载
        </button>
      </div>
    );
  }

  if (!stats) return <EmptyState title="暂无统计数据" />;

  const maxCount = Math.max(
    stats.draftCount,
    stats.publishedCount,
    stats.rejectedCount,
    stats.archivedCount,
    1
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">📊 数据统计</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void loadStats()}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            🔄 刷新
          </button>
          <button
            type="button"
            onClick={() => void handleManualIngest()}
            disabled={ingesting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {ingesting ? "抓取中..." : "⚡ 手动抓取"}
          </button>
        </div>
      </div>

      {ingestResult && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {ingestResult}
        </div>
      )}

      {/* 统计卡片 */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-medium text-blue-600">内容总数</p>
          <p className="mt-1 text-3xl font-bold text-blue-900">{stats.totalContents}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-600">待审核</p>
          <p className="mt-1 text-3xl font-bold text-amber-900">{stats.draftCount}</p>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <p className="text-sm font-medium text-green-600">已发布</p>
          <p className="mt-1 text-3xl font-bold text-green-900">{stats.publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <p className="text-sm font-medium text-purple-600">类型</p>
          <p className="mt-1 text-3xl font-bold text-purple-900">{Object.keys(stats.byType).length}</p>
        </div>
      </div>

      {/* 状态分布 */}
      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">内容状态分布</h2>
        <div className="space-y-3">
          {STATUS_CONFIG.map((cfg) => {
            const count = stats[cfg.key];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={cfg.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{cfg.label}</span>
                  <span className={cfg.textColor}>{count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${cfg.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 类型分布 */}
      {Object.keys(stats.byType).length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">内容类型分布</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div
                key={type}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm text-slate-500">
                  {TYPE_LABELS[type] ?? type}
                </p>
                <p className="text-xl font-bold text-slate-900">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}