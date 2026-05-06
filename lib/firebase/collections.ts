import type { Timestamp } from "firebase-admin/firestore";
import type { SectionCard } from "@/types/kol";
import type { BulletPoint } from "@/types/news";

export interface KolPersonDoc {
  slug: string;
  displayName: string;
  platform: string;
  feedUrl: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface KolPostDoc {
  personId: string; // = personSlug
  guid: string;
  title: string | null;
  content: string | null;
  sourceUrl: string | null;
  platform: string;
  translatedContent: string | null;
  tags: string[] | null;
  sectionCards: SectionCard[] | null;
  audioUrl?: string | null;
  publishedAt: Timestamp;
  fetchedAt: Timestamp;
  personSlug: string;
  personName: string;
  personAvatar: string | null;
}

export interface NewsDigestDoc {
  digestDate: string;
  bulletPoints: BulletPoint[];
  modelUsed: string;
  articleCount: number;
  generatedAt: Timestamp | null;
  status: string;
}

export interface EarningsCallDoc {
  stockCode: string;
  stockName: string;
  callDate: string;
  callTime: string | null;
  location: string | null;
  officialUrl: string | null;
  pdfUrl: string | null;
  status: string;
  summary: string | null;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface WatchedStockDoc {
  stockCode: string;
  stockName: string;
  isActive: boolean;
  createdAt: Timestamp;
}
