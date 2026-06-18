import type {
  AdminReviewResponse,
  AdminContentStatus,
  DashboardStats,
} from "@/lib/admin-types";

const CONTENT_HUB_BASE =
  process.env.NEXT_PUBLIC_CONTENT_API_BASE?.replace(/\/+$/, "") ??
  "http://127.0.0.1:8787";

const ADMIN_TOKEN = process.env.CONTENT_HUB_ADMIN_TOKEN ?? "";

function forwardHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (ADMIN_TOKEN) {
    headers["Authorization"] = `Bearer ${ADMIN_TOKEN}`;
  }
  return headers;
}

/**
 * 获取内容审核列表
 */
export async function fetchReviewList(params: {
  status?: AdminContentStatus;
  type?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminReviewResponse> {
  const query = new URLSearchParams();
  query.set("status", params.status ?? "draft");
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? 20));
  if (params.type) query.set("type", params.type);

  const url = `${CONTENT_HUB_BASE}/internal/review/contents?${query.toString()}`;
  const resp = await fetch(url, { headers: forwardHeaders() });

  if (!resp.ok) {
    throw new Error(`获取审核列表失败: HTTP ${resp.status}`);
  }

  return resp.json() as Promise<AdminReviewResponse>;
}

/**
 * 对内容执行发布/拒绝/归档操作
 */
export async function performContentAction(
  id: number,
  action: "publish" | "reject" | "archive"
): Promise<{ ok: boolean; changed: boolean }> {
  const url = `${CONTENT_HUB_BASE}/internal/contents/${id}/${action}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: forwardHeaders(),
  });

  if (!resp.ok) {
    const body = (await resp.json()) as { error?: string };
    throw new Error(body.error ?? `操作失败: HTTP ${resp.status}`);
  }

  return resp.json() as Promise<{ ok: boolean; changed: boolean }>;
}

/**
 * 获取统计仪表盘数据
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // 获取待审核列表
  const drafts = await fetchReviewList({
    status: "draft",
    page: 1,
    pageSize: 1,
  });
  const published = await fetchReviewList({
    status: "published",
    page: 1,
    pageSize: 1,
  });
  const rejected = await fetchReviewList({
    status: "rejected",
    page: 1,
    pageSize: 1,
  });
  const archived = await fetchReviewList({
    status: "archived",
    page: 1,
    pageSize: 1,
  });

  // 通过 filters 获取总数（实际取 total）
  const draftTotal = drafts.filters ? drafts.items.length : 0;
  const pubTotal = published.filters ? published.items.length : 0;
  const rejTotal = rejected.filters ? rejected.items.length : 0;
  const archTotal = archived.filters ? archived.items.length : 0;

  // 获取各类型分布（尝试获取 published 的完整列表）
  let byType: Record<string, number> = {};
  try {
    const allPublished = await fetchReviewList({
      status: "published",
      page: 1,
      pageSize: 100,
    });
    byType = (allPublished.items ?? []).reduce<Record<string, number>>(
      (acc, item) => {
        const t = item.type || "unknown";
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      },
      {}
    );
  } catch {
    // 静默失败，类型分布留空
  }

  const totalContents = draftTotal + pubTotal + rejTotal + archTotal;

  return {
    totalContents,
    draftCount: draftTotal,
    publishedCount: pubTotal,
    rejectedCount: rejTotal,
    archivedCount: archTotal,
    byType,
    recentActivity: [
      {
        action: "统计更新",
        timestamp: new Date().toISOString(),
        detail: `总计 ${totalContents} 条内容`,
      },
    ],
  };
}

/**
 * 更新内容（标题/摘要/正文/状态）
 */
export async function updateContent(
  id: number,
  data: Partial<{
    title: string;
    summary: string;
    content: string;
    status: AdminContentStatus;
  }>
): Promise<{ ok: boolean }> {
  const url = `${CONTENT_HUB_BASE}/internal/contents/${id}`;
  const resp = await fetch(url, {
    method: "PATCH",
    headers: forwardHeaders(),
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    const body = (await resp.json()) as { error?: string };
    throw new Error(body.error ?? `更新失败: HTTP ${resp.status}`);
  }

  return resp.json() as Promise<{ ok: boolean }>;
}