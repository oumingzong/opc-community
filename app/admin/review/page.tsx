"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useKeyboardNav } from "@/app/_hooks/use-keyboard-nav";

// ── Types ──────────────────────────────────────────────

type ContentStatus = "draft" | "published" | "rejected" | "archived";

interface ReviewItem {
  id: number;
  source_id: number;
  type: string;
  source_name: string;
  slug: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  published_at: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at?: string;
}

interface ReviewResponse {
  items: ReviewItem[];
  page: number;
  pageSize: number;
  filters: {
    status: string;
    sourceId: number | null;
    type: string | null;
  };
}

const STATUS_TABS: { value: ContentStatus; label: string; color: string }[] = [
  { value: "draft", label: "待审核", color: "bg-amber-100 text-amber-800" },
  { value: "published", label: "已发布", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "已拒绝", color: "bg-red-100 text-red-800" },
  { value: "archived", label: "已归档", color: "bg-gray-100 text-gray-600" },
];

const CONTENT_TYPES = [
  { value: "", label: "全部类型" },
  { value: "news", label: "AI 资讯" },
  { value: "tech-resource", label: "技术资源" },
  { value: "collaboration", label: "协作" },
  { value: "offline-event", label: "线下活动" },
];

// ── Confirm Dialog ──────────────────────────────────────

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${confirmColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Component ───────────────────────────────────────────

export default function AdminReviewPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [contentType, setContentType] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // 批量选择
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  // 确认对话框
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    confirmColor: string;
    onConfirm: () => void;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status,
        page: String(page),
        pageSize: "20",
      });
      if (contentType) params.set("type", contentType);

      const resp = await fetch(`/api/admin/review?${params.toString()}`);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const json = (await resp.json()) as ReviewResponse;
      setData(json);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [status, contentType, page]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // 键盘导航
  const items = useMemo(() => data?.items ?? [], [data]);
  const { focusedIndex } = useKeyboardNav(items.length, (index) => {
    const item = items[index];
    if (item) {
      router.push(`/admin/content/edit/${item.id}`);
    }
  });

  const showConfirm = (
    title: string,
    message: string,
    confirmLabel: string,
    confirmColor: string,
    onConfirm: () => void
  ) => {
    setConfirmState({ title, message, confirmLabel, confirmColor, onConfirm });
  };

  const executeAction = async (id: number, action: "publish" | "reject" | "archive") => {
    setActionFeedback(null);
    try {
      const resp = await fetch(`/api/admin/review?id=${id}&action=${action}`, {
        method: "POST",
      });
      const result = await resp.json();
      if (!resp.ok) {
        throw new Error((result as { error?: string }).error ?? `HTTP ${resp.status}`);
      }
      setActionFeedback(
        (result as { changed: boolean }).changed
          ? `✅ #${id} 已${action === "publish" ? "发布" : action === "reject" ? "拒绝" : "归档"}`
          : `ℹ️ #${id} 状态未变化`
      );
      await fetchData();
    } catch (err) {
      setActionFeedback(`❌ ${err instanceof Error ? err.message : "操作失败"}`);
    }
  };

  const executeBatchAction = async (ids: number[], action: "publish" | "reject" | "archive") => {
    setActionFeedback(null);
    let successCount = 0;
    let failCount = 0;

    for (const id of ids) {
      try {
        const resp = await fetch(`/api/admin/review?id=${id}&action=${action}`, {
          method: "POST",
        });
        if (resp.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setActionFeedback(
      failCount > 0
        ? `✅ ${successCount} 条成功, ❌ ${failCount} 条失败`
        : `✅ 成功操作 ${successCount} 条内容`
    );
    await fetchData();
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedIds.size === data.items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.items.map((i) => i.id)));
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusBadge = (s: ContentStatus) => {
    const tab = STATUS_TABS.find((t) => t.value === s);
    return tab ? tab.color : "bg-gray-100 text-gray-600";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        📋 内容审核后台
      </h1>

      {/* Status Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === tab.value
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={contentType}
          onChange={(e) => {
            setContentType(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          {CONTENT_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {ct.label}
            </option>
          ))}
        </select>

        {/* 批量操作 */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              已选 {selectedIds.size} 条
            </span>
            <button
              type="button"
              onClick={() =>
                showConfirm(
                  "批量发布",
                  `确定要发布选中的 ${selectedIds.size} 条内容吗？`,
                  "批量发布",
                  "bg-green-600 hover:bg-green-700",
                  () => {
                    void executeBatchAction(Array.from(selectedIds), "publish");
                    setConfirmState(null);
                  }
                )
              }
              className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
            >
              批量发布
            </button>
            <button
              type="button"
              onClick={() =>
                showConfirm(
                  "批量拒绝",
                  `确定要拒绝选中的 ${selectedIds.size} 条内容吗？`,
                  "批量拒绝",
                  "bg-red-500 hover:bg-red-600",
                  () => {
                    void executeBatchAction(Array.from(selectedIds), "reject");
                    setConfirmState(null);
                  }
                )
              }
              className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
            >
              批量拒绝
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setPage(1);
            void fetchData();
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          🔄 刷新
        </button>

        {actionFeedback && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {actionFeedback}
          </span>
        )}
      </div>

      {/* 键盘导航提示 */}
      <div className="mb-3 text-xs text-gray-400">
        💡 提示: ↑↓ 切换行, Enter 编辑, Shift+点击 多选
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          加载失败: {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-12 text-center text-gray-500">加载中...</div>
      )}

      {/* Table */}
      {!loading && data && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={data.items.length > 0 && selectedIds.size === data.items.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    标题
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    类型
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    来源
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    创建时间
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  data.items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer ${
                        focusedIndex === idx ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      onClick={() => router.push(`/admin/content/edit/${item.id}`)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500">#{item.id}</td>
                      <td className="max-w-xs px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        {item.summary && (
                          <div className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                            {item.summary}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {item.source_name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(item.status)}`}
                        >
                          {STATUS_TABS.find((t) => t.value === item.status)?.label ?? item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {item.status === "draft" && (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                showConfirm(
                                  "发布内容",
                                  `确定要发布「${item.title}」吗？`,
                                  "发布",
                                  "bg-green-600 hover:bg-green-700",
                                  () => {
                                    void executeAction(item.id, "publish");
                                    setConfirmState(null);
                                  }
                                )
                              }
                              className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              发布
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                showConfirm(
                                  "拒绝内容",
                                  `确定要拒绝「${item.title}」吗？`,
                                  "拒绝",
                                  "bg-red-500 hover:bg-red-600",
                                  () => {
                                    void executeAction(item.id, "reject");
                                    setConfirmState(null);
                                  }
                                )
                              }
                              className="rounded bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600"
                            >
                              拒绝
                            </button>
                          </div>
                        )}
                        {item.status === "published" && (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                showConfirm(
                                  "归档内容",
                                  `确定要将「${item.title}」归档吗？`,
                                  "归档",
                                  "bg-gray-500 hover:bg-gray-600",
                                  () => {
                                    void executeAction(item.id, "archive");
                                    setConfirmState(null);
                                  }
                                )
                              }
                              className="rounded bg-gray-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-600"
                            >
                              归档
                            </button>
                          </div>
                        )}
                        {(item.status === "rejected" || item.status === "archived") && (
                          <button
                            type="button"
                            onClick={() => void executeAction(item.id, "publish")}
                            className="rounded bg-blue-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-600"
                          >
                            重新发布
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.items.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                第 {data.page} 页
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-30"
                >
                  ← 上一页
                </button>
                <button
                  type="button"
                  disabled={data.items.length < 20}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-30"
                >
                  下一页 →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Dialog */}
      {confirmState && (
        <ConfirmDialog
          open={true}
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          confirmColor={confirmState.confirmColor}
          onConfirm={() => {
            confirmState.onConfirm();
            setConfirmState(null);
          }}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}