import {
  getDefaultTechResourceBySlug,
  queryDefaultTechResources,
  type TechResourceItem,
  type TechResourceListResponse,
  type TechResourceQuery,
} from "@/app/data/tech-resources";

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
    timeoutMs: parsePositiveInt(process.env.TECH_RESOURCE_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.TECH_RESOURCE_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: TechResourceQuery): string {
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

async function fetchListFromApi(query: TechResourceQuery, apiUrl: string, timeoutMs: number, revalidateSeconds: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`Tech resource API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isTechResourceListResponse(payload)) {
      throw new Error("Tech resource API response shape is invalid");
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
      throw new Error(`Tech resource detail API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isTechResourceItem(payload)) {
      throw new Error("Tech resource detail API response shape is invalid");
    }

    return payload;
  } finally {
    clearTimeout(timer);
  }
}

export async function getTechResourceList(query: TechResourceQuery = {}): Promise<TechResourceListResult> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    return {
      ...queryDefaultTechResources(query),
      dataSource: "default",
    };
  }

  try {
    const fromApi = await fetchListFromApi(query, apiUrl, timeoutMs, revalidateSeconds);
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
