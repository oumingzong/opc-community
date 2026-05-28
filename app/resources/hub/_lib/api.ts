import { FALLBACK_LIST } from "./fallback";
import type { PublicDetailResponse, PublicListParams, PublicListResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_CONTENT_API_BASE ||
  process.env.REACT_APP_CONTENT_API_BASE ||
  "https://opc-content-hub.2086206051.workers.dev";

const LIST_TTL_MS = 60_000;

let listCache: { key: string; expiresAt: number; value: PublicListResponse } | null = null;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

function listCacheKey(params: Required<Pick<PublicListParams, "page" | "pageSize">> & Pick<PublicListParams, "sourceId" | "q">): string {
  return JSON.stringify(params);
}

export async function fetchPublicList(params: PublicListParams = {}): Promise<{ data: PublicListResponse; fromFallback: boolean }> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const timeoutMs = params.timeoutMs ?? 8000;

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (params.sourceId) query.set("sourceId", String(params.sourceId));
  if (params.q) query.set("q", params.q);

  const cacheKey = listCacheKey({ page, pageSize, sourceId: params.sourceId, q: params.q });
  if (listCache && listCache.key === cacheKey && Date.now() < listCache.expiresAt) {
    return { data: listCache.value, fromFallback: false };
  }

  const url = `${API_BASE}/api/public/contents?${query.toString()}`;

  try {
    const resp = await withTimeout(fetch(url), timeoutMs);
    if (!resp.ok) {
      throw new ApiError(`List API failed: ${resp.status}`, resp.status);
    }

    const data = (await resp.json()) as PublicListResponse;
    listCache = {
      key: cacheKey,
      value: data,
      expiresAt: Date.now() + LIST_TTL_MS,
    };

    return { data, fromFallback: false };
  } catch {
    return { data: FALLBACK_LIST, fromFallback: true };
  }
}

export async function fetchPublicDetail(slug: string, timeoutMs = 8000): Promise<PublicDetailResponse> {
  const url = `${API_BASE}/api/public/contents/${encodeURIComponent(slug)}`;
  const resp = await withTimeout(fetch(url), timeoutMs);

  if (resp.status === 404) {
    throw new ApiError("Not Found", 404);
  }
  if (!resp.ok) {
    throw new ApiError(`Detail API failed: ${resp.status}`, resp.status);
  }

  return (await resp.json()) as PublicDetailResponse;
}
