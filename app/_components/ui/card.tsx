import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "cyan" | "rose" | "indigo" | "orange" | "default";

const variantStyles: Record<CardVariant, {
  border: string;
  tagBg: string;
  tagText: string;
  linkColor: string;
  hoverLinkColor: string;
  gradient: string;
}> = {
  cyan: {
    border: "border-cyan-100",
    tagBg: "bg-cyan-50",
    tagText: "text-cyan-700",
    linkColor: "text-cyan-700",
    hoverLinkColor: "text-cyan-800",
    gradient: "from-cyan-300 via-blue-500 to-sky-400",
  },
  rose: {
    border: "border-rose-100",
    tagBg: "bg-rose-50",
    tagText: "text-rose-700",
    linkColor: "text-rose-700",
    hoverLinkColor: "text-rose-800",
    gradient: "from-rose-300 via-orange-500 to-amber-400",
  },
  indigo: {
    border: "border-indigo-100",
    tagBg: "bg-indigo-50",
    tagText: "text-indigo-700",
    linkColor: "text-indigo-700",
    hoverLinkColor: "text-indigo-800",
    gradient: "from-indigo-300 via-blue-500 to-sky-400",
  },
  orange: {
    border: "border-orange-100",
    tagBg: "bg-orange-50",
    tagText: "text-orange-700",
    linkColor: "text-orange-700",
    hoverLinkColor: "text-orange-800",
    gradient: "from-orange-300 via-amber-500 to-yellow-400",
  },
  default: {
    border: "border-slate-100",
    tagBg: "bg-slate-50",
    tagText: "text-slate-700",
    linkColor: "text-blue-600",
    hoverLinkColor: "text-blue-700",
    gradient: "from-blue-300 via-blue-500 to-sky-400",
  },
};

export function ResourceCard({
  variant = "default",
  coverImage,
  coverAlt,
  tags,
  date,
  title,
  summary,
  href,
  sourceLabel,
  extraLinks,
  children,
}: {
  variant?: CardVariant;
  coverImage?: string;
  coverAlt?: string;
  tags?: string[];
  date?: string;
  title: string;
  summary?: string;
  href?: string;
  sourceLabel?: string;
  extraLinks?: ReactNode;
  children?: ReactNode;
}) {
  const s = variantStyles[variant];
  const Tag = href ? "a" : "div";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        s.border
      )}
    >
      {coverImage && (
        <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={coverImage}
              alt={coverAlt ?? title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium",
                  s.tagBg,
                  s.tagText,
                  s.border
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {date && <span className="text-xs text-slate-400">{date}</span>}
      </div>

      <Tag
        href={href}
        className={cn(
          "mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:",
          href ? s.linkColor : ""
        )}
      >
        {title}
      </Tag>

      {summary && (
        <p className="mb-4 text-sm leading-relaxed text-slate-600">{summary}</p>
      )}

      {children}

      {sourceLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{sourceLabel}</span>
        </div>
      )}

      {extraLinks}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r opacity-0 transition-opacity group-hover:opacity-100",
          s.gradient
        )}
      />
    </article>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}