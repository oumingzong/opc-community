import {
  getDefaultAiNewsBySlug,
  queryDefaultAiNews,
  type AiNewsItem,
  type AiNewsListResponse,
  type AiNewsQuery,
} from "@/app/data/ai-news";

export type AiNewsDataSource = "default" | "api" | "fallback";

export type AiNewsListResult = AiNewsListResponse & {
  dataSource: AiNewsDataSource;
};

export type AiNewsDetailResult = {
  item: AiNewsItem;
  dataSource: AiNewsDataSource;
};

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_REVALIDATE_SECONDS = 1800;
const FALLBACK_ENABLED = process.env.AI_NEWS_FALLBACK_ENABLED !== "false";

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
    apiUrl: process.env.AI_NEWS_API_URL?.trim() ?? "",
    timeoutMs: parsePositiveInt(process.env.AI_NEWS_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.AI_NEWS_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: AiNewsQuery): string {
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
  return target.toString();
}

function isAiNewsListResponse(value: unknown): value is AiNewsListResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AiNewsListResponse;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.total === "number" &&
    typeof candidate.page === "number" &&
    typeof candidate.pageSize === "number"
  );
}

function isAiNewsItem(value: unknown): value is AiNewsItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AiNewsItem;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.publishedAt === "string" &&
    typeof candidate.sourceName === "string" &&
    typeof candidate.sourceUrl === "string" &&
    Array.isArray(candidate.tags)
  );
}

async function fetchFromApi(query: AiNewsQuery, apiUrl: string, timeoutMs: number, revalidateSeconds: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`AI news API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isAiNewsListResponse(payload)) {
      throw new Error("AI news API response shape is invalid");
    }

    return payload;
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
      throw new Error(`AI news detail API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isAiNewsItem(payload)) {
      throw new Error("AI news detail API response shape is invalid");
    }

    return payload;
  } finally {
    clearTimeout(timer);
  }
}

export async function getAiNewsList(query: AiNewsQuery = {}): Promise<AiNewsListResult> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    return {
      ...queryDefaultAiNews(query),
      dataSource: "default",
    };
  }

  try {
    const fromApi = await fetchFromApi(query, apiUrl, timeoutMs, revalidateSeconds);
    return {
      ...fromApi,
      dataSource: "api",
    };
  } catch {
    if (!FALLBACK_ENABLED) {
      throw new Error("AI news API is unavailable and fallback is disabled");
    }

    return {
      ...queryDefaultAiNews(query),
      dataSource: "fallback",
    };
  }
}

export async function getAiNewsDetail(slug: string): Promise<AiNewsDetailResult | undefined> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    const local = getDefaultAiNewsBySlug(slug);
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
      throw new Error("AI news detail API is unavailable and fallback is disabled");
    }

    const local = getDefaultAiNewsBySlug(slug);
    if (!local) {
      return undefined;
    }

    return {
      item: local,
      dataSource: "fallback",
    };
  }
}
