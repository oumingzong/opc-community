import {
  getDefaultCollaborationBySlug,
  queryDefaultCollaborations,
  type CollaborationItem,
  type CollaborationListResponse,
  type CollaborationQuery,
} from "@/app/data/collaboration";
import { parseContentHubDetailPayload, parseContentHubListPayload } from "@/lib/content-hub-adapter";

export type CollaborationDataSource = "default" | "api" | "fallback";

export type CollaborationListResult = CollaborationListResponse & {
  dataSource: CollaborationDataSource;
};

export type CollaborationDetailResult = {
  item: CollaborationItem;
  dataSource: CollaborationDataSource;
};

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_REVALIDATE_SECONDS = 1800;
const FALLBACK_ENABLED = process.env.COLLAB_FALLBACK_ENABLED !== "false";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getConfig() {
  return {
    apiUrl: process.env.COLLAB_API_URL?.trim() ?? "",
    contentType: process.env.COLLAB_CONTENT_TYPE?.trim() || "collaboration",
    timeoutMs: parsePositiveInt(process.env.COLLAB_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.COLLAB_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: CollaborationQuery, contentType: string): string {
  const target = new URL(url);
  if (query.page) {
    target.searchParams.set("page", String(query.page));
  }
  if (query.pageSize) {
    target.searchParams.set("pageSize", String(query.pageSize));
  }
  if (query.tag) {
    target.searchParams.set("tag", query.tag);
  }
  if (query.q) {
    target.searchParams.set("q", query.q);
  }
  if (contentType) {
    target.searchParams.set("type", contentType);
  }
  return target.toString();
}

function isCollaborationListResponse(value: unknown): value is CollaborationListResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as CollaborationListResponse;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.total === "number" &&
    typeof candidate.page === "number" &&
    typeof candidate.pageSize === "number"
  );
}

function isCollaborationItem(value: unknown): value is CollaborationItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as CollaborationItem;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.publishedAt === "string" &&
    typeof candidate.organizer === "string" &&
    typeof candidate.location === "string" &&
    typeof candidate.sourceUrl === "string" &&
    Array.isArray(candidate.tags)
  );
}

function mapContentHubItemToCollaborationItem(item: {
  id: number | string;
  slug: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  published_at?: string | null;
  source_name?: string;
  source_url?: string | null;
  type?: string;
}): CollaborationItem {
  const organizer = item.source_name?.trim() || "OPC Content Hub";

  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    summary: item.summary?.trim() || "暂无摘要",
    content: item.content?.trim() || item.summary?.trim() || "暂无正文",
    publishedAt: item.published_at || new Date().toISOString(),
    organizer,
    location: "线上/待定",
    sourceUrl: item.source_url?.trim() || "https://opc-content-hub.2086206051.workers.dev",
    tags: item.type ? [item.type] : ["协作"],
    contact: undefined,
  };
}

async function fetchListFromApi(
  query: CollaborationQuery,
  apiUrl: string,
  contentType: string,
  timeoutMs: number,
  revalidateSeconds: number,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query, contentType), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`Collaboration API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (isCollaborationListResponse(payload)) {
      return payload;
    }

    const contentHub = parseContentHubListPayload(payload);
    if (contentHub) {
      return {
        items: contentHub.items.map(mapContentHubItemToCollaborationItem),
        total: contentHub.total ?? contentHub.items.length,
        page: contentHub.page ?? query.page ?? 1,
        pageSize: contentHub.pageSize ?? query.pageSize ?? contentHub.items.length,
      };
    }

    throw new Error("Collaboration API response shape is invalid");

  } finally {
    clearTimeout(timer);
  }
}

async function fetchDetailFromApi(slug: string, apiUrl: string, timeoutMs: number, revalidateSeconds: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const detailUrl = `${apiUrl.replace(/\/$/, "")}/${encodeURIComponent(slug)}`;
    const response = await fetch(detailUrl, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Collaboration detail API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (isCollaborationItem(payload)) {
      return payload;
    }

    const contentHub = parseContentHubDetailPayload(payload);
    if (contentHub) {
      return mapContentHubItemToCollaborationItem(contentHub.item);
    }

    throw new Error("Collaboration detail API response shape is invalid");

  } finally {
    clearTimeout(timer);
  }
}

export async function getCollaborationList(query: CollaborationQuery = {}): Promise<CollaborationListResult> {
  const { apiUrl, contentType, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    return {
      ...queryDefaultCollaborations(query),
      dataSource: "default",
    };
  }

  try {
    const fromApi = await fetchListFromApi(query, apiUrl, contentType, timeoutMs, revalidateSeconds);
    return {
      ...fromApi,
      dataSource: "api",
    };
  } catch {
    if (!FALLBACK_ENABLED) {
      throw new Error("Collaboration API is unavailable and fallback is disabled");
    }

    return {
      ...queryDefaultCollaborations(query),
      dataSource: "fallback",
    };
  }
}

export async function getCollaborationDetail(slug: string): Promise<CollaborationDetailResult | undefined> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    const local = getDefaultCollaborationBySlug(slug);
    if (!local) {
      return undefined;
    }

    return {
      item: local,
      dataSource: "default",
    };
  }

  try {
    const fromApi = await fetchDetailFromApi(slug, apiUrl, timeoutMs, revalidateSeconds);
    if (!fromApi) {
      return undefined;
    }

    return {
      item: fromApi,
      dataSource: "api",
    };
  } catch {
    if (!FALLBACK_ENABLED) {
      throw new Error("Collaboration detail API is unavailable and fallback is disabled");
    }

    const local = getDefaultCollaborationBySlug(slug);
    if (!local) {
      return undefined;
    }

    return {
      item: local,
      dataSource: "fallback",
    };
  }
}
