import { db } from "@/lib/db";
import { newsDigests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NewsBulletPoint } from "@/components/news/NewsBulletPoint";
import { DigestHistory } from "@/components/news/DigestHistory";
import type { BulletPoint } from "@/types/news";

function getTaiwanDateStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });
}

interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const { date } = await searchParams;
  const today = getTaiwanDateStr();
  const targetDate = date ?? today;

  const [digest] = await db
    .select()
    .from(newsDigests)
    .where(eq(newsDigests.digestDate, targetDate));

  const history = await db
    .select({ digestDate: newsDigests.digestDate })
    .from(newsDigests)
    .where(eq(newsDigests.status, "complete"))
    .orderBy(desc(newsDigests.digestDate))
    .limit(7);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1">每日財經摘要</h1>
          <p className="text-muted-foreground text-sm">AI 整理今日 10 大財經重點</p>
        </div>
        <DigestHistory history={history} currentDate={targetDate} />
      </div>

      {!digest && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">今日摘要尚未生成</p>
          <p className="text-sm">每天台灣時間 09:00 自動更新</p>
        </div>
      )}

      {digest?.status === "pending" && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">摘要生成中...</p>
          <p className="text-sm">請稍候幾分鐘後重新整理</p>
        </div>
      )}

      {digest?.status === "failed" && (
        <div className="text-center py-16 text-destructive">
          <p className="text-lg">摘要生成失敗，請稍後再試</p>
        </div>
      )}

      {digest?.status === "complete" && (
        <>
          <div className="text-xs text-muted-foreground mb-6">
            共分析 {digest.articleCount} 篇文章 · 由 {digest.modelUsed} 生成
            {digest.generatedAt && (
              <> · {new Date(digest.generatedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}</>
            )}
          </div>
          <div className="space-y-6">
            {(digest.bulletPoints as BulletPoint[]).map((bullet, i) => (
              <NewsBulletPoint key={i} index={i + 1} bullet={bullet} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
