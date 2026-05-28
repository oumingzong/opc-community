'use client';

import { useEffect, useState } from "react";

import { ApiError, fetchPublicDetail } from "../_lib/api";
import type { PublicContentItem } from "../_lib/types";

interface Props {
  slug: string;
}

export function ContentDetailPage({ slug }: Props) {
  const [item, setItem] = useState<PublicContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const resp = await fetchPublicDetail(slug);
        if (!cancelled) {
          setItem(resp.item);
        }
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          setItem(null);
          return;
        }

        setError(err instanceof Error ? err.message : "详情加载失败");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <p>加载中...</p>;
  if (notFound) return <p>内容不存在</p>;
  if (error) return <p style={{ color: "#d13438" }}>{error}</p>;
  if (!item) return <p>暂无内容</p>;

  return (
    <article style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h1>{item.title}</h1>
      <p style={{ color: "#666" }}>
        来源：{item.source_name} | 发布时间：{item.published_at || "未知"}
      </p>
      {item.summary ? <p>{item.summary}</p> : null}
      {item.source_url ? (
        <p>
          <a href={item.source_url} target="_blank" rel="noreferrer">
            查看原文
          </a>
        </p>
      ) : null}
    </article>
  );
}
