import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="rounded-full bg-slate-50 p-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}