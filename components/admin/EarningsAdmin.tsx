"use client";

import { useState, useTransition } from "react";
import {
  addWatchedStock,
  deleteWatchedStock,
  fetchEarningsFromMops,
  saveEarningsSummary,
  addEarningsCallManually,
} from "@/app/admin/earnings/actions";

interface WatchedStock {
  id: string;
  stockCode: string;
  stockName: string;
}

interface EarningsCall {
  id: string;
  stockCode: string;
  stockName: string;
  callDate: string;
  callTime: string | null;
  location: string | null;
  officialUrl: string | null;
  pdfUrl: string | null;
  status: string;
  summary: string | null;
}

interface Props {
  stocks: WatchedStock[];
  calls: EarningsCall[];
}

export function EarningsAdmin({ stocks: initialStocks, calls: initialCalls }: Props) {
  const [stocks, setStocks] = useState(initialStocks);
  const [calls, setCalls] = useState(initialCalls);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // Add stock form
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");

  // Fetch status
  const [fetchMsg, setFetchMsg] = useState<string | null>(null);

  // Summary editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftSummary, setDraftSummary] = useState("");
  const [summaryMsg, setSummaryMsg] = useState<{ id: string; type: "ok" | "error"; text: string } | null>(null);

  // Manual add call form
  const [showAddCall, setShowAddCall] = useState(false);
  const [callForm, setCallForm] = useState({ stockCode: "", stockName: "", callDate: "", callTime: "", location: "", officialUrl: "" });

  function showMsg(type: "ok" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function handleAddStock() {
    if (!newCode.trim() || !newName.trim()) return;
    startTransition(async () => {
      const res = await addWatchedStock(newCode, newName);
      if (res.error) {
        showMsg("error", res.error);
      } else {
        setStocks((prev) => [...prev, { id: Date.now().toString(), stockCode: newCode.trim(), stockName: newName.trim() }]);
        setNewCode("");
        setNewName("");
        showMsg("ok", "已新增");
      }
    });
  }

  function handleDeleteStock(id: string) {
    if (!confirm("確定要移除這支股票嗎？")) return;
    startTransition(async () => {
      await deleteWatchedStock(id);
      setStocks((prev) => prev.filter((s) => s.id !== id));
    });
  }

  function handleFetchMops() {
    setFetchMsg("抓取中...");
    startTransition(async () => {
      try {
        const res = await fetchEarningsFromMops();
        if (res.ok) {
          setFetchMsg(`完成！新增 ${res.inserted ?? 0} 筆，請重新整理頁面查看最新資料`);
        } else {
          setFetchMsg("抓取失敗，請稍後再試");
        }
      } catch {
        setFetchMsg("抓取失敗，請稍後再試");
      }
    });
  }

  function openEdit(call: EarningsCall) {
    setEditingId(call.id);
    setDraftSummary(call.summary ?? "");
    setSummaryMsg(null);
  }

  function handleSaveSummary(id: string) {
    startTransition(async () => {
      const res = await saveEarningsSummary(id, draftSummary);
      if (res.error) {
        setSummaryMsg({ id, type: "error", text: res.error });
      } else {
        setCalls((prev) =>
          prev.map((c) => c.id === id ? { ...c, summary: draftSummary.trim() || null, status: "completed" } : c)
        );
        setSummaryMsg({ id, type: "ok", text: "已儲存" });
        setEditingId(null);
      }
    });
  }

  function handleAddCallManually() {
    if (!callForm.stockCode || !callForm.stockName || !callForm.callDate) return;
    startTransition(async () => {
      const res = await addEarningsCallManually(
        callForm.stockCode, callForm.stockName, callForm.callDate,
        callForm.callTime, callForm.location, callForm.officialUrl
      );
      if (res.error) {
        showMsg("error", res.error);
      } else {
        setShowAddCall(false);
        setCallForm({ stockCode: "", stockName: "", callDate: "", callTime: "", location: "", officialUrl: "" });
        showMsg("ok", "已新增法說會，請重新整理頁面查看");
      }
    });
  }

  return (
    <div className="space-y-10">
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-sm shadow z-50 ${
          message.type === "ok" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
        }`}>
          {message.text}
        </div>
      )}

      {/* Section 1: Watched Stocks */}
      <section>
        <h2 className="text-lg font-semibold mb-4">追蹤股票</h2>

        {stocks.length > 0 && (
          <div className="rounded-xl border divide-y mb-4">
            {stocks.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="font-medium">{s.stockName}</span>
                  <span className="text-sm text-muted-foreground ml-2">{s.stockCode}</span>
                </div>
                <button
                  onClick={() => handleDeleteStock(s.id)}
                  disabled={isPending}
                  className="text-xs text-destructive hover:underline disabled:opacity-40"
                >
                  移除
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="股票代號（如 2330）"
            className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-40"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="公司名稱（如 台積電）"
            className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring flex-1"
          />
          <button
            onClick={handleAddStock}
            disabled={isPending || !newCode.trim() || !newName.trim()}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            新增
          </button>
        </div>
      </section>

      {/* Section 2: MOPS Fetch */}
      <section>
        <h2 className="text-lg font-semibold mb-2">法說會行事曆</h2>
        <p className="text-sm text-muted-foreground mb-4">從公開資訊觀測站（MOPS）抓取當月及下個月的法說會資訊</p>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleFetchMops}
            disabled={isPending || stocks.length === 0}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "抓取中..." : "從 MOPS 抓取"}
          </button>
          <button
            onClick={() => setShowAddCall((v) => !v)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            手動新增
          </button>
          {fetchMsg && <p className="text-sm text-muted-foreground">{fetchMsg}</p>}
        </div>

        {showAddCall && (
          <div className="mt-4 rounded-xl border p-4 space-y-3">
            <h3 className="text-sm font-medium">手動新增法說會</h3>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={callForm.stockCode} onChange={(e) => setCallForm((f) => ({ ...f, stockCode: e.target.value }))}
                placeholder="股票代號*" className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" value={callForm.stockName} onChange={(e) => setCallForm((f) => ({ ...f, stockName: e.target.value }))}
                placeholder="公司名稱*" className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="date" value={callForm.callDate} onChange={(e) => setCallForm((f) => ({ ...f, callDate: e.target.value }))}
                className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" value={callForm.callTime} onChange={(e) => setCallForm((f) => ({ ...f, callTime: e.target.value }))}
                placeholder="時間（如 14:00）" className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" value={callForm.location} onChange={(e) => setCallForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="地點" className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" value={callForm.officialUrl} onChange={(e) => setCallForm((f) => ({ ...f, officialUrl: e.target.value }))}
                placeholder="官方連結" className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddCallManually} disabled={isPending}
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40">
                新增
              </button>
              <button onClick={() => setShowAddCall(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                取消
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Section 3: Earnings Calls List */}
      <section>
        <h2 className="text-lg font-semibold mb-4">法說會記錄</h2>

        {calls.length === 0 ? (
          <p className="text-sm text-muted-foreground">目前沒有法說會記錄，請先從 MOPS 抓取或手動新增。</p>
        ) : (
          <div className="rounded-xl border divide-y overflow-hidden">
            {calls.map((call) => {
              const isEditing = editingId === call.id;
              const msg = summaryMsg?.id === call.id ? summaryMsg : null;

              return (
                <div key={call.id}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{call.stockName}</span>
                        <span className="text-xs text-muted-foreground">{call.stockCode}</span>
                        <span className="text-xs text-muted-foreground">{call.callDate}</span>
                        {call.callTime && <span className="text-xs text-muted-foreground">{call.callTime}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          call.status === "completed"
                            ? call.summary
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        }`}>
                          {call.status === "completed" ? (call.summary ? "已有摘要" : "待填摘要") : "即將舉行"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditing) {
                          setEditingId(null);
                        } else {
                          openEdit(call);
                        }
                      }}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-md border hover:bg-muted transition-colors"
                    >
                      {isEditing ? "收起" : "編輯摘要"}
                    </button>
                  </div>

                  {isEditing && (
                    <div className="px-4 pb-4 bg-muted/30 space-y-3">
                      <textarea
                        value={draftSummary}
                        onChange={(e) => setDraftSummary(e.target.value)}
                        placeholder="貼上聽完法說會後的文字摘要..."
                        rows={12}
                        autoFocus
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                      />
                      {msg && (
                        <p className={`text-xs ${msg.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {msg.text}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveSummary(call.id)}
                          disabled={isPending}
                          className="flex-1 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-40"
                        >
                          {isPending ? "儲存中..." : "儲存"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
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
        )}
      </section>
    </div>
  );
}
