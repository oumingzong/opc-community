export type AdminContentStatus = "draft" | "published" | "rejected" | "archived";

export type AdminReviewItem = {
  id: number;
  source_id: number;
  type: string;
  source_name: string;
  slug: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  published_at: string | null;
  status: AdminContentStatus;
  created_at: string;
  updated_at?: string;
};

export type AdminReviewResponse = {
  items: AdminReviewItem[];
  page: number;
  pageSize: number;
  filters: {
    status: string;
    sourceId: number | null;
    type: string | null;
  };
};

export type AdminStatItem = {
  label: string;
  value: number;
  color?: string;
};

export type DashboardStats = {
  totalContents: number;
  draftCount: number;
  publishedCount: number;
  rejectedCount: number;
  archivedCount: number;
  byType: Record<string, number>;
  recentActivity: Array<{
    action: string;
    timestamp: string;
    detail: string;
  }>;
};