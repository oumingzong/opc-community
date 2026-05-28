'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { fetchPublicList } from "../_lib/api";
import type { PublicContentItem } from "../_lib/types";

export function ContentListPage() {
  const [items, setItems] = useState<PublicContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromFallback, setFromFallback] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sourceId, setSourceId] = useState<number | undefined>(undefined);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPublicList({ page, pageSize, sourceId, q: q || undefined });
        if (!cancelled) {
          setItems(res.data.items);
          setFromFallback(res.fromFallback);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "请求失败");
        }
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
  }, [page, pageSize, sourceId, q]);

  const empty = useMemo(() => !loading && items.length === 0 && !error, [loading, items.length, error]);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1>内容列表</h1>

      <section style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="搜索标题/摘要"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <select
          value={sourceId ?? ""}
          onChange={(e) => {
            setPage(1);
            setSourceId(e.target.value ? Number(e.target.value) : undefined);
          }}
        >
          <option value="">全部来源</option>
          <option value="1">Hacker News</option>
          <option value="2">Cloudflare Blog RSS</option>
          <option value="3">GitHub Changelog RSS</option>
        </select>
      </section>

      {fromFallback ? (
        <p style={{ color: "#9c6500", background: "#fff4ce", padding: 8 }}>当前为备用数据</p>
      ) : null}

      {loading ? <p>加载中...</p> : null}
      {error ? <p style={{ color: "#d13438" }}>{error}</p> : null}
      {empty ? <p>暂无内容</p> : null}

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {items.map((item) => (
          <li key={item.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <Link href={`/resources/hub/${item.slug}`} style={{ fontWeight: 600, fontSize: 18, textDecoration: "none" }}>
              {item.title}
            </Link>
            <p style={{ margin: "8px 0" }}>{item.summary || "暂无摘要"}</p>
            <small>
              来源：{item.source_name} | 发布时间：{item.published_at || "未知"}
            </small>
          </li>
        ))}
      </ul>

      <section style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
          上一页
        </button>
        <button onClick={() => setPage((value) => value + 1)}>下一页</button>
      </section>
    </main>
  );
}
