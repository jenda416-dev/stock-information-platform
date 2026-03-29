import { db } from "@/lib/db";
import { newsDigests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NewsBulletPoint } from "@/components/news/NewsBulletPoint";
import { DigestHistory } from "@/components/news/DigestHistory";
import type { BulletPoint } from "@/types/news";

const MOCK_BULLETS: BulletPoint[] = [
  { title: "Fed 暗示今年降息一至兩次", point: "美國聯準會官員暗示今年可能降息一至兩次，市場對利率走向的預期趨於保守，美債殖利率小幅回落，美元指數走弱。", sources: [{ title: "Reuters", url: "#" }, { title: "Bloomberg", url: "#" }] },
  { title: "台積電 Q1 營收超預期，上調全年展望", point: "台積電法說會公布第一季營收超預期，AI 晶片需求持續強勁，CoWoS 先進封裝產能供不應求，全年營收展望上調至兩位數成長。", sources: [{ title: "工商時報", url: "#" }, { title: "經濟日報", url: "#" }] },
  { title: "輝達 Blackwell Ultra GPU 下半年量產", point: "輝達宣布新一代 Blackwell Ultra GPU 將於下半年量產，預計衝擊 AI 伺服器市場，台灣供應鏈廣達、緯穎、台達電等同步受惠。", sources: [{ title: "The Verge", url: "#" }] },
  { title: "中國 PMI 連兩月低於榮枯線", point: "中國製造業 PMI 連續兩個月低於 50 榮枯線，內需疲軟訊號明顯，人民幣承壓，港股恆生指數下跌逾 1%。", sources: [{ title: "財訊", url: "#" }, { title: "聯合報", url: "#" }] },
  { title: "中東局勢升溫，油價突破 88 美元", point: "油價因中東地緣政治緊張局勢升溫而上漲，布蘭特原油突破每桶 88 美元，通膨壓力再度引發市場關注。", sources: [{ title: "CNBC", url: "#" }] },
  { title: "蘋果 2026 年推 AI 晶片 MacBook", point: "蘋果傳出將於 2026 年推出首款配備自研 AI 晶片的 MacBook，台積電 3nm 製程獨家供貨，蘋概股受消息帶動走揚。", sources: [{ title: "MacRumors", url: "#" }, { title: "科技新報", url: "#" }] },
  { title: "日銀維持利率不變，日圓短線走強", point: "日本央行維持利率不變，但釋出未來可能進一步升息訊號，日圓短線走強，出口類股承壓。", sources: [{ title: "日經新聞", url: "#" }] },
  { title: "比特幣突破 7 萬美元，ETF 資金持續流入", point: "比特幣突破 7 萬美元關卡，市場情緒樂觀，以太坊及其他主流加密貨幣同步上漲，現貨 ETF 資金持續流入。", sources: [{ title: "CoinDesk", url: "#" }, { title: "動區動趨", url: "#" }] },
  { title: "台灣全年 GDP 成長率上修至 3.1%", point: "台灣主計總處上修全年 GDP 成長率至 3.1%，出口動能優於預期，半導體與 AI 相關產業為主要貢獻來源。", sources: [{ title: "主計總處", url: "#" }] },
  { title: "Meta、Alphabet 廣告收入亮眼，那斯達克漲逾 1.5%", point: "美國科技股財報季開跑，Meta、Alphabet 廣告收入優於預期，帶動那斯達克指數收漲逾 1.5%，市場風險偏好回升。", sources: [{ title: "Wall Street Journal", url: "#" }, { title: "Yahoo Finance", url: "#" }] },
];

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
        <>
          <div className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">預覽模式</span>
            共分析 42 篇文章 · 由 gemini-1.5-flash 生成
          </div>
          <div className="space-y-6">
            {MOCK_BULLETS.map((bullet, i) => (
              <NewsBulletPoint key={i} index={i + 1} bullet={bullet} />
            ))}
          </div>
        </>
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
