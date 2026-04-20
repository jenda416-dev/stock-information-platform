import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  date,
  integer,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const kolPersons = pgTable("kol_persons", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  displayName: text("display_name").notNull(),
  platform: text("platform").notNull(), // "podcast_rss" | "truth_social_rss"
  feedUrl: text("feed_url").notNull(),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const kolPosts = pgTable(
  "kol_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => kolPersons.id, { onDelete: "cascade" }),
    guid: text("guid").notNull(),
    title: text("title"),
    content: text("content"),
    sourceUrl: text("source_url"),
    platform: text("platform").notNull(), // "soundon" | "truth_social"
    translatedContent: text("translated_content"),
    tags: jsonb("tags").$type<string[]>(),
    sectionCards: jsonb("section_cards").$type<import("@/types/kol").SectionCard[]>(),
    publishedAt: timestamp("published_at").notNull(),
    fetchedAt: timestamp("fetched_at").defaultNow(),
  },
  (t) => [
    unique().on(t.personId, t.guid),
    index("kol_posts_person_published_idx").on(t.personId, t.publishedAt),
    index("kol_posts_published_idx").on(t.publishedAt),
  ]
);

export const newsArticles = pgTable(
  "news_articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceName: text("source_name").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    url: text("url").notNull().unique(),
    publishedAt: timestamp("published_at").notNull(),
    fetchedDate: date("fetched_date").notNull(),
    language: text("language").default("zh"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("news_articles_fetched_date_idx").on(t.fetchedDate)]
);

export const watchedStocks = pgTable("watched_stocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  stockCode: text("stock_code").notNull().unique(),
  stockName: text("stock_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const earningsCalls = pgTable(
  "earnings_calls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stockCode: text("stock_code").notNull(),
    stockName: text("stock_name").notNull(),
    callDate: date("call_date").notNull(),
    callTime: text("call_time"),
    location: text("location"),
    officialUrl: text("official_url"),
    pdfUrl: text("pdf_url"),
    status: text("status").notNull().default("upcoming"), // "upcoming" | "completed"
    summary: text("summary"),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique().on(t.stockCode, t.callDate),
    index("earnings_calls_call_date_idx").on(t.callDate),
    index("earnings_calls_status_idx").on(t.status),
  ]
);

export const newsDigests = pgTable("news_digests", {
  id: uuid("id").primaryKey().defaultRandom(),
  digestDate: date("digest_date").unique().notNull(),
  bulletPoints: jsonb("bullet_points").notNull().$type<
    Array<{
      title: string;
      point: string;
      sources: Array<{ title: string; url: string }>;
    }>
  >(),
  modelUsed: text("model_used").notNull(),
  articleCount: integer("article_count").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  status: text("status").default("pending"), // "pending" | "complete" | "failed"
});
