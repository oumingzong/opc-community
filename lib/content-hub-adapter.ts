type JsonRecord = Record<string, unknown>;

export type ContentHubListItem = {
  id: number | string;
  source_id?: number;
  source_name?: string;
  type?: string;
  slug: string;
  title: string;
  summary?: string | null;
  source_url?: string | null;
  published_at?: string | null;
};

export type ContentHubDetailItem = ContentHubListItem & {
  content?: string | null;
};

export type ContentHubListPayload = {
  items: ContentHubListItem[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export type ContentHubDetailPayload = {
  item: ContentHubDetailItem;
};

function isObject(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object";
}

function isContentHubListItem(value: unknown): value is ContentHubListItem {
  if (!isObject(value)) {
    return false;
  }

  const candidate = value as ContentHubListItem;
  const hasNumericOrStringId = typeof candidate.id === "number" || typeof candidate.id === "string";

  return hasNumericOrStringId && typeof candidate.slug === "string" && typeof candidate.title === "string";
}

function isContentHubDetailItem(value: unknown): value is ContentHubDetailItem {
  return isContentHubListItem(value);
}

export function parseContentHubListPayload(value: unknown): ContentHubListPayload | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const candidate = value as ContentHubListPayload;
  if (!Array.isArray(candidate.items)) {
    return undefined;
  }

  if (!candidate.items.every(isContentHubListItem)) {
    return undefined;
  }

  if (candidate.total !== undefined && typeof candidate.total !== "number") {
    return undefined;
  }

  if (candidate.page !== undefined && typeof candidate.page !== "number") {
    return undefined;
  }

  if (candidate.pageSize !== undefined && typeof candidate.pageSize !== "number") {
    return undefined;
  }

  return candidate;
}

export function parseContentHubDetailPayload(value: unknown): ContentHubDetailPayload | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const candidate = value as ContentHubDetailPayload;
  if (!isContentHubDetailItem(candidate.item)) {
    return undefined;
  }

  return candidate;
}
