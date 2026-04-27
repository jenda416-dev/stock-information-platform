import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Use JSON directly to avoid private key parsing issues
const sa = require("/Users/alexchen/Downloads/stock-dashboard-d512a-firebase-adminsdk-fbsvc-1ab7403169.json");

initializeApp({ credential: cert(sa) });
const firestore = getFirestore();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function batchWrite(
  ops: Array<{ ref: FirebaseFirestore.DocumentReference; data: object }>
) {
  const BATCH_SIZE = 499;
  for (let i = 0; i < ops.length; i += BATCH_SIZE) {
    const chunk = ops.slice(i, i + BATCH_SIZE);
    const batch = firestore.batch();
    chunk.forEach(({ ref, data }) => batch.set(ref, data));
    await batch.commit();
    console.log(`  Wrote ${i + chunk.length}/${ops.length}`);
  }
}

async function migratePersons() {
  console.log("\n── kolPersons ──");
  const persons = await db.select().from(schema.kolPersons);
  const ops = persons.map((p) => ({
    ref: firestore.collection("kolPersons").doc(p.slug),
    data: {
      slug: p.slug,
      displayName: p.displayName,
      platform: p.platform,
      feedUrl: p.feedUrl,
      avatarUrl: p.avatarUrl ?? null,
      isActive: p.isActive ?? true,
      createdAt: p.createdAt ? Timestamp.fromDate(p.createdAt) : Timestamp.now(),
    },
  }));
  await batchWrite(ops);
  console.log(`✓ ${persons.length} persons 搬移完成`);
  return persons;
}

async function migratePosts(
  persons: (typeof schema.kolPersons.$inferSelect)[]
) {
  console.log("\n── kolPosts ──");
  const slugMap = new Map(persons.map((p) => [p.id, p]));

  const posts = await db.select().from(schema.kolPosts);
  const ops = posts
    .map((post) => {
      const person = slugMap.get(post.personId);
      if (!person) {
        console.warn(`  ⚠ 找不到 personId=${post.personId}，跳過 guid=${post.guid}`);
        return null;
      }
      const docId = `${person.slug}_${post.guid}`;
      return {
        ref: firestore.collection("kolPosts").doc(docId),
        data: {
          personId: person.slug,
          guid: post.guid,
          title: post.title ?? null,
          content: post.content ?? null,
          sourceUrl: post.sourceUrl ?? null,
          platform: post.platform,
          translatedContent: post.translatedContent ?? null,
          tags: post.tags ?? null,
          sectionCards: post.sectionCards ?? null,
          publishedAt: Timestamp.fromDate(post.publishedAt),
          fetchedAt: post.fetchedAt
            ? Timestamp.fromDate(post.fetchedAt)
            : Timestamp.now(),
          personSlug: person.slug,
          personName: person.displayName,
          personAvatar: person.avatarUrl ?? null,
        },
      };
    })
    .filter(Boolean) as Array<{ ref: FirebaseFirestore.DocumentReference; data: object }>;

  await batchWrite(ops);
  console.log(`✓ ${ops.length} posts 搬移完成`);
}

async function migrateNewsDigests() {
  console.log("\n── newsDigests ──");
  const digests = await db.select().from(schema.newsDigests);
  const ops = digests.map((d) => ({
    ref: firestore.collection("newsDigests").doc(d.digestDate),
    data: {
      digestDate: d.digestDate,
      bulletPoints: d.bulletPoints ?? [],
      modelUsed: d.modelUsed,
      articleCount: d.articleCount,
      generatedAt: d.generatedAt ? Timestamp.fromDate(d.generatedAt) : null,
      status: d.status ?? "pending",
    },
  }));
  await batchWrite(ops);
  console.log(`✓ ${digests.length} digests 搬移完成`);
}

async function migrateEarningsCalls() {
  console.log("\n── earningsCalls ──");
  const calls = await db.select().from(schema.earningsCalls);
  const ops = calls.map((c) => ({
    ref: firestore.collection("earningsCalls").doc(`${c.stockCode}_${c.callDate}`),
    data: {
      stockCode: c.stockCode,
      stockName: c.stockName,
      callDate: c.callDate,
      callTime: c.callTime ?? null,
      location: c.location ?? null,
      officialUrl: c.officialUrl ?? null,
      pdfUrl: c.pdfUrl ?? null,
      status: c.status,
      summary: c.summary ?? null,
      updatedAt: c.updatedAt ? Timestamp.fromDate(c.updatedAt) : Timestamp.now(),
      createdAt: c.createdAt ? Timestamp.fromDate(c.createdAt) : Timestamp.now(),
    },
  }));
  await batchWrite(ops);
  console.log(`✓ ${calls.length} earnings calls 搬移完成`);
}

async function migrateWatchedStocks() {
  console.log("\n── watchedStocks ──");
  const stocks = await db.select().from(schema.watchedStocks);
  const ops = stocks.map((s) => ({
    ref: firestore.collection("watchedStocks").doc(s.stockCode),
    data: {
      stockCode: s.stockCode,
      stockName: s.stockName,
      isActive: s.isActive,
      createdAt: s.createdAt ? Timestamp.fromDate(s.createdAt) : Timestamp.now(),
    },
  }));
  await batchWrite(ops);
  console.log(`✓ ${stocks.length} watched stocks 搬移完成`);
}

async function main() {
  console.log("🚀 開始搬移 PostgreSQL → Firestore");
  const persons = await migratePersons();
  await migratePosts(persons);
  await migrateNewsDigests();
  await migrateEarningsCalls();
  await migrateWatchedStocks();
  console.log("\n✅ 全部搬移完成！");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ 搬移失敗：", e);
  process.exit(1);
});
