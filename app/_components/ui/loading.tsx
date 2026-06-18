import { cn } from "@/lib/utils";

/**
 * 基础骨架块
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200", className)}
      {...props}
    />
  );
}

/**
 * 卡片加载骨架
 */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <Skeleton className="mb-4 aspect-[16/9] w-full rounded-xl" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="mb-3 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

/**
 * 表格加载骨架
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {Array.from({ length: 6 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: 6 }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  <Skeleton className={cn("h-4", colIdx === 1 ? "w-3/4" : "w-16")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 整页加载状态
 */
export function PageLoading({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}