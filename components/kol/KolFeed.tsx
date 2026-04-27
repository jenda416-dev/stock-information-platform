"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { KolPostCard } from "./KolPostCard";
import type { KolPost } from "@/types/kol";

interface Props {
  initialPosts: KolPost[];
  initialCursor: string | null; // ISO timestamp of last post, null if no more
  slug?: string;
}

export function KolFeed({ initialPosts, initialCursor, slug }: Props) {
  const [posts, setPosts] = useState<KolPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("cursor", cursor);
      if (slug) params.set("slug", slug);
      const res = await fetch(`/api/kol?${params}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.cursor ?? null);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore]);

  useEffect(() => {
    setPosts(initialPosts);
    setCursor(initialCursor);
  }, [slug, initialPosts, initialCursor]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>尚無資料。請先執行資料抓取。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <KolPostCard key={post.id} post={post} />
      ))}
      <div ref={loaderRef} className="h-4" />
      {loading && (
        <p className="text-center text-sm text-muted-foreground py-4">載入中...</p>
      )}
    </div>
  );
}
