import {
  getDefaultCollaborationBySlug,
  queryDefaultCollaborations,
  type CollaborationItem,
  type CollaborationListResponse,
  type CollaborationQuery,
} from "@/app/data/collaboration";

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
    timeoutMs: parsePositiveInt(process.env.COLLAB_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.COLLAB_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: CollaborationQuery): string {
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

async function fetchListFromApi(
  query: CollaborationQuery,
  apiUrl: string,
  timeoutMs: number,
  revalidateSeconds: number,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      throw new Error(`Collaboration API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isCollaborationListResponse(payload)) {
      throw new Error("Collaboration API response shape is invalid");
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
      throw new Error(`Collaboration detail API request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isCollaborationItem(payload)) {
      throw new Error("Collaboration detail API response shape is invalid");
    }

    return payload;
  } finally {
    clearTimeout(timer);
  }
}

export async function getCollaborationList(query: CollaborationQuery = {}): Promise<CollaborationListResult> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  if (!apiUrl) {
    return {
      ...queryDefaultCollaborations(query),
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
