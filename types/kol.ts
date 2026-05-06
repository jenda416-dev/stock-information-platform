export interface SectionCard {
  title: string;
  stocks: string[];
  logic: string;
  adviceKeyword: string;
  advice: string;
}

export interface KolPost {
  id: string;
  guid: string;
  title: string | null;
  content: string | null;
  translatedContent: string | null;
  tags: string[] | null;
  audioUrl?: string | null;
  sourceUrl: string | null;
  platform: string;
  publishedAt: string;
  personSlug: string;
  personName: string;
  personAvatar: string | null;
}
