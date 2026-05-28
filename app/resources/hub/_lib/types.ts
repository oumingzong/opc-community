export interface PublicContentItem {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  source_name: string;
  published_at: string | null;
  source_url: string | null;
}

export interface PublicListResponse {
  items: PublicContentItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PublicDetailResponse {
  item: PublicContentItem;
}

export interface PublicListParams {
  page?: number;
  pageSize?: number;
  sourceId?: number;
  q?: string;
  timeoutMs?: number;
}
