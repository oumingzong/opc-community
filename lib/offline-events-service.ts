import {
  getDefaultOfflineEventBySlug,
  queryDefaultOfflineEvents,
  type OfflineEventItem,
  type OfflineEventListResponse,
  type OfflineEventQuery,
} from "@/app/data/offline-events";
import { parseContentHubDetailPayload, parseContentHubListPayload } from "@/lib/content-hub-adapter";

export type OfflineEventDataSource = "default" | "api" | "fallback";

export type OfflineEventListResult = OfflineEventListResponse & {
  dataSource: OfflineEventDataSource;
};

export type OfflineEventDetailResult = {
  item: OfflineEventItem;
  dataSource: OfflineEventDataSource;
};

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_REVALIDATE_SECONDS = 1800;
const FALLBACK_ENABLED = process.env.OFFLINE_EVENT_FALLBACK_ENABLED !== "false";

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
    apiUrl: process.env.OFFLINE_EVENT_API_URL?.trim() ?? "",
    contentType: process.env.OFFLINE_EVENT_CONTENT_TYPE?.trim() || "offline-event",
    timeoutMs: parsePositiveInt(process.env.OFFLINE_EVENT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.OFFLINE_EVENT_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: OfflineEventQuery, contentType: string): string {
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

function isOfflineEventListResponse(value: unknown): value is OfflineEventListResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as OfflineEventListResponse;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.total === "number" &&
    typeof candidate.page === "number" &&
    typeof candidate.pageSize === "number"
  );
}

function isOfflineEventItem(value: unknown): value is OfflineEventItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as OfflineEventItem;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.startAt === "string" &&
    typeof candidate.organizer === "string" &&
    typeof candidate.venue === "string" &&
    typeof candidate.sourceUrl === "string" &&
    Array.isArray(candidate.tags)
  );
}

function mapContentHubItemToOfflineEventItem(item: {
  id: number | string;
  slug: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  published_at?: string | null;
  source_name?: string;
  source_url?: string | null;
  type?: string;
}): OfflineEventItem {
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    summary: item.summary?.trim() || "暂无摘要",
    content: item.content?.trim() || item.summary?.trim() || "暂无正文",
    startAt: item.published_at || new Date().toISOString(),
    organizer: item.source_name?.trim() || "OPC Content Hub",
    venue: "线上/待定",
    sourceUrl: item.source_url?.trim() || "https://opc-content-hub.2086206051.workers.dev",
    tags: item.type ? [item.type] : ["活动"],
  };
}

async function fetchListFromApi(query: OfflineEventQuery, apiUrl: string, contentType: string, timeoutMs: number, revalidateSeconds: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query, contentType), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`Offline event API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (isOfflineEventListResponse(payload)) {
      return payload;
    }

    const contentHub = parseContentHubListPayload(payload);
    if (contentHub) {
      return {
        items: contentHub.items.map(mapContentHubItemToOfflineEventItem),
        total: contentHub.total ?? contentHub.items.length,
        page: contentHub.page ?? query.page ?? 1,
        pageSize: contentHub.pageSize ?? query.pageSize ?? contentHub.items.length,
      };
    }

    throw new Error("Offline event API response shape is invalid");

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
      throw new Error(`Offline event detail API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (isOfflineEventItem(payload)) {
      return payload;
    }

    const contentHub = parseContentHubDetailPayload(payload);
    if (contentHub) {
      return mapContentHubItemToOfflineEventItem(contentHub.item);
    }

    throw new Error("Offline event detail API response shape is invalid");

  } finally {
    clearTimeout(timer);
  }
}

export async function getOfflineEventList(query: OfflineEventQuery = {}): Promise<OfflineEventListResult> {
  const { apiUrl, contentType, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    return {
      ...queryDefaultOfflineEvents(query),
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
      throw new Error("Offline event API is unavailable and fallback is disabled");
    }

    return {
      ...queryDefaultOfflineEvents(query),
      dataSource: "fallback",
    };
  }
}

export async function getOfflineEventDetail(slug: string): Promise<OfflineEventDetailResult | undefined> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    const local = getDefaultOfflineEventBySlug(slug);
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
      throw new Error("Offline event detail API is unavailable and fallback is disabled");
    }

    const local = getDefaultOfflineEventBySlug(slug);
    if (!local) {
      return undefined;
    }

    return {
      item: local,
      dataSource: "fallback",
    };
  }
}
