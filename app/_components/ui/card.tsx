import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardVariant = "cyan" | "rose" | "indigo" | "orange" | "default";

const variantStyles: Record<
  CardVariant,
  {
    border: string;
    tagBg: string;
    tagText: string;
    linkColor: string;
    hoverLinkColor: string;
    gradient: string;
  }
> = {
  cyan: {
    border: "border-cyan-100",
    tagBg: "bg-cyan-50",
    tagText: "text-cyan-700",
    linkColor: "text-cyan-700",
    hoverLinkColor: "group-hover:text-cyan-700",
    gradient: "from-cyan-300 via-blue-500 to-sky-400",
  },
  rose: {
    border: "border-rose-100",
    tagBg: "bg-rose-50",
    tagText: "text-rose-700",
    linkColor: "text-rose-700",
    hoverLinkColor: "group-hover:text-rose-700",
    gradient: "from-rose-300 via-orange-500 to-amber-400",
  },
  indigo: {
    border: "border-indigo-100",
    tagBg: "bg-indigo-50",
    tagText: "text-indigo-700",
    linkColor: "text-indigo-700",
    hoverLinkColor: "group-hover:text-indigo-700",
    gradient: "from-indigo-300 via-blue-500 to-sky-400",
  },
  orange: {
    border: "border-orange-100",
    tagBg: "bg-orange-50",
    tagText: "text-orange-700",
    linkColor: "text-orange-700",
    hoverLinkColor: "group-hover:text-orange-700",
    gradient: "from-orange-300 via-amber-500 to-yellow-400",
  },
  default: {
    border: "border-slate-100",
    tagBg: "bg-slate-50",
    tagText: "text-slate-700",
    linkColor: "text-blue-600",
    hoverLinkColor: "group-hover:text-blue-600",
    gradient: "from-blue-300 via-blue-500 to-sky-400",
  },
};

export function ResourceCard({
  variant = "default",
  coverImage,
  coverAlt,
  imagePriority = false,
  tags,
  date,
  title,
  summary,
  href,
  meta,
  footer,
  actions,
  children,
}: {
  variant?: CardVariant;
  coverImage?: string;
  coverAlt?: string;
  imagePriority?: boolean;
  tags?: string[];
  date?: string;
  title: string;
  summary?: string;
  href?: string;
  meta?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const s = variantStyles[variant];

  const titleClassName = cn(
    "mb-3 block text-lg font-bold leading-snug text-slate-900 transition-colors",
    href ? s.hoverLinkColor : ""
  );

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        s.border
      )}
    >
      {coverImage && (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={coverImage}
              alt={coverAlt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={imagePriority}
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        {tags && tags.length > 0 ? (
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
        ) : (
          <span />
        )}
        {date && <span className="shrink-0 text-xs text-slate-400">{date}</span>}
      </div>

      {href ? (
        <Link href={href} className={titleClassName}>
          {title}
        </Link>
      ) : (
        <h3 className={titleClassName}>{title}</h3>
      )}

      {summary && <p className="mb-4 text-sm leading-relaxed text-slate-600">{summary}</p>}

      {meta && <div className="mb-4 text-xs text-slate-500">{meta}</div>}

      {children}

      {(footer || actions) && (
        <div className="flex items-center justify-between gap-3">
          {footer ? <div className="min-w-0 text-xs text-slate-500">{footer}</div> : <span />}
          {actions && <div className="flex flex-nowrap items-center gap-3 whitespace-nowrap">{actions}</div>}
        </div>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r opacity-0 transition-opacity group-hover:opacity-100",
          s.gradient
        )}
      />
    </article>
  );
}

export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>;
}