import { db } from "@/lib/db";
import { earningsCalls } from "@/lib/db/schema";
import { eq, gte, lt, desc, asc, and, isNotNull } from "drizzle-orm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function getTodayStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" });
}

function formatCallDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function daysUntil(dateStr: string): number {
  const today = new Date(getTodayStr());
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function EarningsPage() {
  const today = getTodayStr();

  const upcoming = await db
    .select()
    .from(earningsCalls)
    .where(and(eq(earningsCalls.status, "upcoming"), gte(earningsCalls.callDate, today)))
    .orderBy(asc(earningsCalls.callDate));

  const completed = await db
    .select()
    .from(earningsCalls)
    .where(and(eq(earningsCalls.status, "completed"), isNotNull(earningsCalls.summary)))
    .orderBy(desc(earningsCalls.callDate))
    .limit(20);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">法說會</h1>
        <p className="text-muted-foreground text-sm">重點台股法說會行事曆與摘要</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">即將舉行</TabsTrigger>
          <TabsTrigger value="completed">法說會摘要</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>近期無排定的法說會</p>
              <p className="text-sm mt-1">資料由管理員手動更新</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((call) => {
                const days = daysUntil(call.callDate);
                return (
                  <div key={call.id} className="rounded-xl border p-4 flex gap-4 items-start">
                    {/* Date badge */}
                    <div className="flex-shrink-0 flex flex-col items-center bg-muted rounded-lg px-3 py-2 min-w-[56px]">
                      <span className="text-xs text-muted-foreground">
                        {new Date(call.callDate + "T00:00:00").toLocaleDateString("zh-TW", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold leading-tight">
                        {new Date(call.callDate + "T00:00:00").getDate()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(call.callDate + "T00:00:00").toLocaleDateString("zh-TW", { weekday: "short" })}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{call.stockName}</span>
                        <span className="text-xs text-muted-foreground">{call.stockCode}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          days === 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                            : days === 1
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        }`}>
                          {days === 0 ? "今天" : days === 1 ? "明天" : `${days} 天後`}
                        </span>
                      </div>

                      <div className="mt-1 space-y-0.5">
                        {call.callTime && (
                          <p className="text-sm text-muted-foreground">{call.callTime}</p>
                        )}
                        {call.location && (
                          <p className="text-sm text-muted-foreground truncate">{call.location}</p>
                        )}
                      </div>

                      {call.officialUrl && (
                        <a
                          href={call.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                        >
                          官方資訊
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {call.pdfUrl && (
                        <a
                          href={call.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 ml-3 text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          簡報 PDF
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completed.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>尚無法說會摘要</p>
              <p className="text-sm mt-1">管理員聽完法說會後會在此上傳摘要</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completed.map((call) => (
                <div key={call.id} className="rounded-xl border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold">{call.stockName}</span>
                    <span className="text-xs text-muted-foreground">{call.stockCode}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{formatCallDate(call.callDate)}</span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                    {call.summary}
                  </div>
                  {call.officialUrl && (
                    <a
                      href={call.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      官方資訊
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
