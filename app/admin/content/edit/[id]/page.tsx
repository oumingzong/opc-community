"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageLoading } from "@/app/_components/ui/loading";
import { performContentAction } from "@/lib/admin-api";

const CONTENT_HUB_BASE =
  process.env.NEXT_PUBLIC_CONTENT_API_BASE?.replace(/\/+$/, "") ??
  "http://127.0.0.1:8787";

const ADMIN_TOKEN = process.env.CONTENT_HUB_ADMIN_TOKEN ?? "";

function forwardHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (ADMIN_TOKEN) headers["Authorization"] = `Bearer ${ADMIN_TOKEN}`;
  return headers;
}

function fetchContent(id: number) {
  const url = `${CONTENT_HUB_BASE}/api/contents/status`;
  return fetch(`${CONTENT_HUB_BASE}/api/contents/${id}`, {
    headers: forwardHeaders(),
  }).then((r) => (r.ok ? r.json() : null));
}

export default function ContentEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const contentId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string>("draft");

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContent(contentId);
      if (data?.item) {
        setTitle(data.item.title ?? "");
        setSummary(data.item.summary ?? "");
        setContent(data.item.content ?? "");
        setStatus(data.item.status ?? "draft");
      } else {
        setError("内容未找到");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const handleSave = async (nextStatus?: string) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch(
        `${CONTENT_HUB_BASE}/internal/contents/${contentId}`,
        {
          method: "PATCH",
          headers: forwardHeaders(),
          body: JSON.stringify({
            title: title.trim(),
            summary: summary.trim(),
            content: content.trim(),
            ...(nextStatus ? { status: nextStatus } : {}),
          }),
        }
      );

      if (!resp.ok) {
        const body = await resp.json();
        throw new Error((body as { error?: string }).error ?? `HTTP ${resp.status}`);
      }

      setSuccess("✅ 保存成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const action = status === "published" ? "archive" : "publish";
      const result = await performContentAction(contentId, action);
      if (result.ok) {
        setStatus(action === "publish" ? "published" : "archived");
        setSuccess(`✅ 已${action === "publish" ? "发布" : "归档"}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoading text="加载内容中..." />;

  if (error && !title) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">✏️ 编辑内容</h1>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
        <button
          type="button"
          onClick={() => router.push("/admin/review")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          返回审核列表
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">✏️ 编辑内容 #{contentId}</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/review")}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← 返回审核列表
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>
      )}

      <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">摘要</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">正文</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-blue-300 focus:ring"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">状态：</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === "published"
                ? "bg-green-100 text-green-700"
                : status === "draft"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {status === "published" ? "已发布" : status === "draft" ? "待审核" : status}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "保存中..." : "💾 保存"}
          </button>
          <button
            type="button"
            onClick={() => void handleSave(status === "published" ? "published" : "draft")}
            disabled={saving}
            className="rounded-xl border px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            📝 保存并续编
          </button>
          <button
            type="button"
            onClick={() => void handlePublishToggle()}
            disabled={saving}
            className={`rounded-xl px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
              status === "published"
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {status === "published" ? "📦 归档" : "🚀 发布"}
          </button>
        </div>
      </div>
    </div>
  );
}