"use client";

import { useState, useEffect, useTransition } from "react";
import { saveSummary } from "@/app/admin/actions";

export interface AdminPost {
  guid: string;
  title: string | null;
  publishedAt: string;
  summary: string | null;
}

export function AdminPostList({ posts }: { posts: AdminPost[] }) {
  const [openGuid, setOpenGuid] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSummary, setDraftSummary] = useState("");
  const [saved, setSaved] = useState<Record<string, { title: string | null; summary: string | null }>>(
    Object.fromEntries(posts.map((p) => [p.guid, { title: p.title, summary: p.summary }]))
  );
  const [message, setMessage] = useState<{ guid: string; type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = openGuid ? saved[openGuid] : null;
  const hasUnsaved =
    openGuid !== null &&
    (draftTitle !== (current?.title ?? "") || draftSummary !== (current?.summary ?? ""));

  useEffect(() => {
    if (!hasUnsaved) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsaved]);

  function tryOpen(guid: string) {
    if (openGuid === guid) return;
    if (hasUnsaved && !confirm("有未儲存的變更，確定要離開嗎？")) return;
    const s = saved[guid];
    setOpenGuid(guid);
    setDraftTitle(s?.title ?? "");
    setDraftSummary(s?.summary ?? "");
    setMessage(null);
  }

  function handleCancel() {
    if (hasUnsaved && !confirm("有未儲存的變更，確定要取消嗎？")) return;
    setOpenGuid(null);
    setMessage(null);
  }

  function handleSave() {
    if (!openGuid) return;
    startTransition(async () => {
      const result = await saveSummary(openGuid, draftTitle, draftSummary);
      if (result.error) {
        setMessage({ guid: openGuid, type: "error", text: result.error });
      } else {
        setSaved((prev) => ({
          ...prev,
          [openGuid]: { title: draftTitle || (prev[openGuid]?.title ?? null), summary: draftSummary || null },
        }));
        setMessage({ guid: openGuid, type: "ok", text: "已儲存" });
        setOpenGuid(null);
      }
    });
  }

  return (
    <div className="divide-y rounded-xl border overflow-hidden">
      {posts.map((post) => {
        const isOpen = openGuid === post.guid;
        const s = saved[post.guid];
        const hasSummary = !!s?.summary;
        const lastMsg = message?.guid === post.guid ? message : null;

        return (
          <div key={post.guid}>
            <button
              onClick={() => tryOpen(post.guid)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              <img
                src={`https://i.ytimg.com/vi/${post.guid}/mqdefault.jpg`}
                alt=""
                className="w-16 h-9 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s?.title ?? post.guid}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(post.publishedAt).toLocaleDateString("zh-TW")}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                hasSummary
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}>
                {hasSummary ? "已有筆記" : "未填寫"}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 bg-muted/30 space-y-3">
                {/* Title input */}
                <div className="space-y-1.5 pt-3">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">標題</label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="輸入自訂標題..."
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Summary textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">筆記內容</label>
                  <textarea
                    value={draftSummary}
                    onChange={(e) => setDraftSummary(e.target.value)}
                    placeholder="從 NotebookLM 複製摘要貼在這裡..."
                    rows={10}
                    autoFocus
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                  />
                </div>

                {lastMsg && (
                  <p className={`text-xs ${lastMsg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {lastMsg.text}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isPending || !hasUnsaved}
                    className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isPending ? "儲存中..." : "儲存"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
