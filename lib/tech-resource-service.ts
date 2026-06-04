import {
  getDefaultTechResourceBySlug,
  queryDefaultTechResources,
  type TechResourceItem,
  type TechResourceListResponse,
  type TechResourceQuery,
} from "@/app/data/tech-resources";
import { parseContentHubDetailPayload, parseContentHubListPayload } from "@/lib/content-hub-adapter";

export type TechResourceDataSource = "default" | "api" | "fallback";

export type TechResourceListResult = TechResourceListResponse & {
  dataSource: TechResourceDataSource;
};

export type TechResourceDetailResult = {
  item: TechResourceItem;
  dataSource: TechResourceDataSource;
};

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_REVALIDATE_SECONDS = 1800;
const FALLBACK_ENABLED = process.env.TECH_RESOURCE_FALLBACK_ENABLED !== "false";

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
    apiUrl: process.env.TECH_RESOURCE_API_URL?.trim() ?? "",
    contentType: process.env.TECH_RESOURCE_CONTENT_TYPE?.trim() || "tech-resource",
    timeoutMs: parsePositiveInt(process.env.TECH_RESOURCE_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.TECH_RESOURCE_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: TechResourceQuery, contentType: string): string {
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

function isTechResourceListResponse(value: unknown): value is TechResourceListResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as TechResourceListResponse;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.total === "number" &&
    typeof candidate.page === "number" &&
    typeof candidate.pageSize === "number"
  );
}

function isTechResourceItem(value: unknown): value is TechResourceItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as TechResourceItem;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.publishedAt === "string" &&
    typeof candidate.provider === "string" &&
    typeof candidate.format === "string" &&
    typeof candidate.level === "string" &&
    typeof candidate.sourceUrl === "string" &&
    Array.isArray(candidate.tags)
  );
}

function mapContentHubItemToTechResourceItem(item: {
  id: number | string;
  slug: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  published_at?: string | null;
  source_name?: string;
  source_url?: string | null;
  type?: string;
}): TechResourceItem {
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    summary: item.summary?.trim() || "暂无摘要",
    content: item.content?.trim() || item.summary?.trim() || "暂无正文",
    publishedAt: item.published_at || new Date().toISOString(),
    provider: item.source_name?.trim() || "OPC Content Hub",
    format: "技术文章",
    level: "入门",
    sourceUrl: item.source_url?.trim() || "https://opc-content-hub.2086206051.workers.dev",
    tags: item.type ? [item.type] : ["资源"],
  };
}

async function fetchListFromApi(query: TechResourceQuery, apiUrl: string, contentType: string, timeoutMs: number, revalidateSeconds: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query, contentType), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`Tech resource API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (isTechResourceListResponse(payload)) {
      return payload;
    }

    const contentHub = parseContentHubListPayload(payload);
    if (contentHub) {
      return {
        items: contentHub.items.map(mapContentHubItemToTechResourceItem),
        total: contentHub.total ?? contentHub.items.length,
        page: contentHub.page ?? query.page ?? 1,
        pageSize: contentHub.pageSize ?? query.pageSize ?? contentHub.items.length,
      };
    }

    throw new Error("Tech resource API response shape is invalid");

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
      throw new Error(`Tech resource detail API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (isTechResourceItem(payload)) {
      return payload;
    }

    const contentHub = parseContentHubDetailPayload(payload);
    if (contentHub) {
      return mapContentHubItemToTechResourceItem(contentHub.item);
    }

    throw new Error("Tech resource detail API response shape is invalid");

  } finally {
    clearTimeout(timer);
  }
}

export async function getTechResourceList(query: TechResourceQuery = {}): Promise<TechResourceListResult> {
  const { apiUrl, contentType, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    return {
      ...queryDefaultTechResources(query),
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
      throw new Error("Tech resource API is unavailable and fallback is disabled");
    }

    return {
      ...queryDefaultTechResources(query),
      dataSource: "fallback",
    };
  }
}

export async function getTechResourceDetail(slug: string): Promise<TechResourceDetailResult | undefined> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    const local = getDefaultTechResourceBySlug(slug);
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
      throw new Error("Tech resource detail API is unavailable and fallback is disabled");
    }

    const local = getDefaultTechResourceBySlug(slug);
    if (!local) {
      return undefined;
    }

    return {
      item: local,
      dataSource: "fallback",
    };
  }
}
