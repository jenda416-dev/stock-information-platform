"use client";

import { useState, useEffect, useTransition } from "react";
import { saveSummary, generateCardsAction, generateAudioAction } from "@/app/admin/actions";
import type { SectionCard } from "@/types/kol";

export interface AdminPost {
  guid: string;
  title: string | null;
  publishedAt: string;
  summary: string | null;
  tags: string[] | null;
  sectionCards: SectionCard[] | null;
  audioUrl?: string | null;
}

const MAX_TAGS = 5;

const emptyCard = (): SectionCard => ({
  title: "", stocks: [], logic: "", adviceKeyword: "", advice: "",
});

export function AdminPostList({ posts }: { posts: AdminPost[] }) {
  const [openGuid, setOpenGuid] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSummary, setDraftSummary] = useState("");
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [draftCards, setDraftCards] = useState<SectionCard[]>([]);
  const [saved, setSaved] = useState<Record<string, { title: string | null; summary: string | null; tags: string[] | null; sectionCards: SectionCard[] | null; audioUrl?: string | null }>>(
    Object.fromEntries(posts.map((p) => [p.guid, { title: p.title, summary: p.summary, tags: p.tags, sectionCards: p.sectionCards, audioUrl: p.audioUrl }]))
  );
  const [aiLoading, setAiLoading] = useState<Record<string, "cards" | "audio" | null>>({});
  const [message, setMessage] = useState<{ guid: string; type: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = openGuid ? saved[openGuid] : null;
  const hasUnsaved =
    openGuid !== null &&
    (draftTitle !== (current?.title ?? "") ||
      draftSummary !== (current?.summary ?? "") ||
      JSON.stringify(draftTags) !== JSON.stringify(current?.tags ?? []) ||
      JSON.stringify(draftCards) !== JSON.stringify(current?.sectionCards ?? []));

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
    setDraftTags(s?.tags ?? []);
    setDraftCards(s?.sectionCards ?? []);
    setMessage(null);
  }

  function handleCancel() {
    if (hasUnsaved && !confirm("有未儲存的變更，確定要取消嗎？")) return;
    setOpenGuid(null);
    setMessage(null);
  }

  function handleTagChange(index: number, value: string) {
    setDraftTags((prev) => { const next = [...prev]; next[index] = value; return next; });
  }
  function handleAddTag() {
    if (draftTags.length >= MAX_TAGS) return;
    setDraftTags((prev) => [...prev, ""]);
  }
  function handleRemoveTag(index: number) {
    setDraftTags((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCard(i: number, patch: Partial<SectionCard>) {
    setDraftCards((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  }
  function updateCardStocks(i: number, raw: string) {
    updateCard(i, { stocks: raw.split("、").map((s) => s.trim()).filter(Boolean) });
  }
  function addCard() { setDraftCards((prev) => [...prev, emptyCard()]); }
  function removeCard(i: number) { setDraftCards((prev) => prev.filter((_, idx) => idx !== i)); }

  async function handleGenerateCards() {
    if (!openGuid || !draftSummary.trim()) return;
    setAiLoading((prev) => ({ ...prev, [openGuid]: "cards" }));
    const result = await generateCardsAction(openGuid, draftSummary, draftTitle);
    setAiLoading((prev) => ({ ...prev, [openGuid]: null }));
    if ("error" in result) {
      setMessage({ guid: openGuid, type: "error", text: result.error ?? "未知錯誤" });
    } else {
      setDraftCards(result.cards ?? []);
      setMessage({ guid: openGuid, type: "ok", text: `AI 生成 ${result.cards?.length ?? 0} 張卡片，記得儲存` });
    }
  }

  async function handleGenerateAudio() {
    if (!openGuid || !draftSummary.trim()) return;
    setAiLoading((prev) => ({ ...prev, [openGuid]: "audio" }));
    const result = await generateAudioAction(openGuid, draftSummary);
    setAiLoading((prev) => ({ ...prev, [openGuid]: null }));
    if ("error" in result) {
      setMessage({ guid: openGuid, type: "error", text: result.error ?? "未知錯誤" });
    } else {
      setSaved((prev) => ({ ...prev, [openGuid]: { ...prev[openGuid], audioUrl: result.audioUrl } }));
      setMessage({ guid: openGuid, type: "ok", text: "語音已生成並儲存" });
    }
  }

  function handleSave() {
    if (!openGuid) return;
    startTransition(async () => {
      const result = await saveSummary(openGuid, draftTitle, draftSummary, draftTags, draftCards);
      if (result.error) {
        setMessage({ guid: openGuid, type: "error", text: result.error });
      } else {
        const cleanCards = draftCards.filter((c) => c.title.trim());
        setSaved((prev) => ({
          ...prev,
          [openGuid]: {
            title: draftTitle || (prev[openGuid]?.title ?? null),
            summary: draftSummary || null,
            tags: draftTags.filter(Boolean),
            sectionCards: cleanCards.length > 0 ? cleanCards : null,
          },
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
              <img src={`https://i.ytimg.com/vi/${post.guid}/mqdefault.jpg`} alt="" className="w-16 h-9 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s?.title ?? post.guid}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(post.publishedAt).toLocaleDateString("zh-TW")}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                hasSummary ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-muted text-muted-foreground"
              }`}>
                {hasSummary ? "已有筆記" : "未填寫"}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 bg-muted/30 space-y-4">
                {/* 標題 */}
                <div className="space-y-1.5 pt-3">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">標題</label>
                  <input type="text" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="輸入自訂標題..." className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                {/* 標籤 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">標籤（最多 {MAX_TAGS} 個）</label>
                    {draftTags.length < MAX_TAGS && (
                      <button type="button" onClick={handleAddTag} className="text-xs text-primary hover:underline">+ 新增標籤</button>
                    )}
                  </div>
                  {draftTags.length === 0 ? (
                    <button type="button" onClick={handleAddTag} className="text-xs text-muted-foreground hover:text-foreground border border-dashed rounded-md px-3 py-2 w-full text-center transition-colors">點擊新增標籤</button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {draftTags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <input type="text" value={tag} onChange={(e) => handleTagChange(i, e.target.value)} placeholder="輸入標籤..." className="rounded-full border bg-background px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring w-28" />
                          <button type="button" onClick={() => handleRemoveTag(i)} className="text-muted-foreground hover:text-foreground text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 筆記內容 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">筆記內容</label>
                    <div className="flex items-center gap-2">
                      {saved[openGuid]?.audioUrl && (
                        <span className="text-xs text-green-600 dark:text-green-400">已有語音</span>
                      )}
                      <button
                        type="button"
                        onClick={handleGenerateAudio}
                        disabled={!draftSummary.trim() || aiLoading[openGuid] === "audio"}
                        className="text-xs text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {aiLoading[openGuid] === "audio" ? "生成中..." : "AI 自動生成語音"}
                      </button>
                    </div>
                  </div>
                  <textarea value={draftSummary} onChange={(e) => setDraftSummary(e.target.value)} placeholder="從 NotebookLM 複製摘要貼在這裡..." rows={10} autoFocus className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
                </div>

                {/* 板塊分析卡片 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">板塊分析卡片</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleGenerateCards}
                        disabled={!draftSummary.trim() || aiLoading[openGuid] === "cards"}
                        className="text-xs text-primary hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {aiLoading[openGuid] === "cards" ? "生成中..." : "AI 自動生成"}
                      </button>
                      <button type="button" onClick={addCard} className="text-xs text-muted-foreground hover:text-foreground">+ 手動新增</button>
                    </div>
                  </div>

                  {draftCards.length === 0 ? (
                    <button type="button" onClick={addCard} className="text-xs text-muted-foreground hover:text-foreground border border-dashed rounded-md px-3 py-2 w-full text-center transition-colors">點擊新增板塊卡片</button>
                  ) : (
                    <div className="space-y-3">
                      {draftCards.map((card, i) => (
                        <div key={i} className="rounded-lg border bg-background p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">卡片 {i + 1}</span>
                            <button type="button" onClick={() => removeCard(i)} className="text-xs text-red-500 hover:text-red-600">移除</button>
                          </div>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => updateCard(i, { title: e.target.value })}
                            placeholder="板塊標題（例：廠務與 CPO 測試）"
                            className="w-full rounded border bg-muted px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <input
                            type="text"
                            value={card.stocks.join("、")}
                            onChange={(e) => updateCardStocks(i, e.target.value)}
                            placeholder="盤點標的，用頓號分隔（例：漢唐、萬潤、致茂）"
                            className="w-full rounded border bg-muted px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <textarea
                            value={card.logic}
                            onChange={(e) => updateCard(i, { logic: e.target.value })}
                            placeholder="主委點評邏輯..."
                            rows={3}
                            className="w-full rounded border bg-muted px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-y"
                          />
                          <select
                            value={card.adviceKeyword}
                            onChange={(e) => updateCard(i, { adviceKeyword: e.target.value })}
                            className="w-full rounded border bg-muted px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="">選擇操作方向</option>
                            <option value="買進">買進</option>
                            <option value="加碼">加碼</option>
                            <option value="觀察">觀察</option>
                            <option value="減碼">減碼</option>
                            <option value="避開">避開</option>
                          </select>
                          <textarea
                            value={card.advice}
                            onChange={(e) => updateCard(i, { advice: e.target.value })}
                            placeholder="操作建議（具體 1-2 句）..."
                            rows={2}
                            className="w-full rounded border bg-muted px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-y"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {lastMsg && (
                  <p className={`text-xs ${lastMsg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{lastMsg.text}</p>
                )}

                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={isPending || !hasUnsaved} className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {isPending ? "儲存中..." : "儲存"}
                  </button>
                  <button onClick={handleCancel} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">取消</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
