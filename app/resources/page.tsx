import Link from "next/link";
import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import type { ReactNode } from "react";

import { CardGrid, ResourceCard } from "@/app/_components/ui/card";
import { getAiNewsList } from "@/lib/ai-news-service";
import { getCollaborationList } from "@/lib/collaboration-service";
import { getOfflineEventList } from "@/lib/offline-events-service";
import { getTechResourceList } from "@/lib/tech-resource-service";

type SectionVariant = "cyan" | "rose" | "indigo" | "orange";

type ResourceSectionProps<T> = {
  title: string;
  href: string;
  desktopCta: string;
  mobileCta: string;
  variant: SectionVariant;
  items: T[];
  renderItem: (item: T) => ReactNode;
};

const sectionStyles: Record<
  SectionVariant,
  {
    section: string;
    title: string;
    desktopLink: string;
    mobileButton: string;
  }
> = {
  cyan: {
    section: "from-cyan-50 via-blue-50 to-white",
    title: "from-cyan-700 to-blue-700",
    desktopLink: "text-blue-600 hover:text-blue-700",
    mobileButton: "from-cyan-500 to-blue-600",
  },
  rose: {
    section: "from-rose-50 via-orange-50 to-white",
    title: "from-rose-700 to-orange-700",
    desktopLink: "text-rose-700 hover:text-rose-800",
    mobileButton: "from-rose-500 to-orange-600",
  },
  indigo: {
    section: "from-indigo-50 via-purple-50 to-white",
    title: "from-indigo-700 to-purple-700",
    desktopLink: "text-indigo-700 hover:text-indigo-800",
    mobileButton: "from-indigo-500 to-blue-600",
  },
  orange: {
    section: "from-orange-50 via-amber-50 to-white",
    title: "from-orange-700 to-amber-700",
    desktopLink: "text-orange-700 hover:text-orange-800",
    mobileButton: "from-orange-500 to-amber-600",
  },
};

function toHumanDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getCoverImage(item: { slug: string; coverImage?: string }, category: string): string {
  return item.coverImage?.trim() || `https://picsum.photos/seed/opc-${category}-${item.slug}/1200/720`;
}

function getCoverAlt(item: { title: string; coverImageAlt?: string }): string {
  return item.coverImageAlt?.trim() || `${item.title} 预览图`;
}

function SectionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function ResourceSection<T>({
  title,
  href,
  desktopCta,
  mobileCta,
  variant,
  items,
  renderItem,
}: ResourceSectionProps<T>) {
  const styles = sectionStyles[variant];

  return (
    <section
      className={`mb-12 -mx-4 bg-linear-to-b px-0 py-10 sm:-mx-6 sm:rounded-3xl lg:-mx-8 ${styles.section}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className={`bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent ${styles.title}`}>
            {title}
          </h2>
          <SectionLink
            href={href}
            className={`hidden items-center gap-1 whitespace-nowrap text-sm font-semibold sm:inline-flex ${styles.desktopLink}`}
          >
            {desktopCta}
          </SectionLink>
        </div>

        <CardGrid>{items.map((item) => renderItem(item))}</CardGrid>

        <div className="mt-8 sm:hidden">
          <SectionLink
            href={href}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r px-5 py-3 text-sm font-semibold text-white ${styles.mobileButton}`}
          >
            {mobileCta}
          </SectionLink>
        </div>
      </div>
    </section>
  );
}

export default async function ResourcesPage() {
  const news = await getAiNewsList({ page: 1, pageSize: 3 });
  const collaborations = await getCollaborationList({ page: 1, pageSize: 3 });
  const techResources = await getTechResourceList({ page: 1, pageSize: 3 });
  const offlineEvents = await getOfflineEventList({ page: 1, pageSize: 3 });

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50 to-cyan-50/30 py-20">
      <section className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              内容服务联调入口已上线，可直接验证列表、详情、404 与 fallback。
            </p>
            <Link
              href="/resources/hub"
              className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              进入联调 Hub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ResourceSection
        title="AI 前沿资讯"
        href="/resources/ai-news"
        desktopCta="查看完整资讯中心"
        mobileCta="查看完整资讯中心"
        variant="cyan"
        items={news.items}
        renderItem={(item) => (
          <ResourceCard
            key={item.id}
            variant="cyan"
            coverImage={getCoverImage(item, "ai-news")}
            coverAlt={getCoverAlt(item)}
            tags={item.tags}
            date={toHumanDate(item.publishedAt)}
            title={item.title}
            summary={item.summary}
            href={`/resources/ai-news/${item.slug}`}
            footer={`来源：${item.sourceName}`}
            actions={
              <>
                <Link
                  href={`/resources/ai-news/${item.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                >
                  详情
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  原文
                  <ExternalLink className="h-4 w-4" />
                </a>
              </>
            }
          />
        )}
      />

      <ResourceSection
        title="开放协作交流"
        href="/resources/collaboration"
        desktopCta="查看完整协作页"
        mobileCta="查看完整协作页"
        variant="rose"
        items={collaborations.items}
        renderItem={(item) => (
          <ResourceCard
            key={item.id}
            variant="rose"
            coverImage={getCoverImage(item, "collaboration")}
            coverAlt={getCoverAlt(item)}
            tags={item.tags}
            date={toHumanDate(item.publishedAt)}
            title={item.title}
            summary={item.summary}
            href={`/resources/collaboration/${item.slug}`}
            meta={
              <p className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {item.location}
              </p>
            }
            footer={`主办：${item.organizer}`}
            actions={
              <Link
                href={`/resources/collaboration/${item.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-rose-700 transition-colors hover:text-rose-800"
              >
                详情
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        )}
      />

      <ResourceSection
        title="技术资源共享"
        href="/resources/tech-resources"
        desktopCta="查看完整资源页"
        mobileCta="查看完整资源页"
        variant="indigo"
        items={techResources.items}
        renderItem={(item) => (
          <ResourceCard
            key={item.id}
            variant="indigo"
            coverImage={getCoverImage(item, "tech-resources")}
            coverAlt={getCoverAlt(item)}
            tags={item.tags}
            date={toHumanDate(item.publishedAt)}
            title={item.title}
            summary={item.summary}
            href={`/resources/tech-resources/${item.slug}`}
            footer={`来源：${item.provider}`}
            actions={
              <Link
                href={`/resources/tech-resources/${item.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-800"
              >
                详情
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        )}
      />

      <ResourceSection
        title="线下活动沙龙"
        href="/resources/offline-events"
        desktopCta="查看完整活动页"
        mobileCta="查看完整活动页"
        variant="orange"
        items={offlineEvents.items}
        renderItem={(item) => (
          <ResourceCard
            key={item.id}
            variant="orange"
            coverImage={getCoverImage(item, "offline-events")}
            coverAlt={getCoverAlt(item)}
            tags={item.tags}
            date={toHumanDate(item.startAt)}
            title={item.title}
            summary={item.summary}
            href={`/resources/offline-events/${item.slug}`}
            meta={
              <p className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {item.venue}
              </p>
            }
            footer={`主办：${item.organizer}`}
            actions={
              <Link
                href={`/resources/offline-events/${item.slug}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 transition-colors hover:text-orange-800"
              >
                详情
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        )}
      />
    </main>
  );
}