export interface KolPost {
  id: string;
  guid: string;
  title: string | null;
  content: string | null;
  translatedContent: string | null;
  sourceUrl: string | null;
  platform: string;
  publishedAt: string;
  personSlug: string;
  personName: string;
  personAvatar: string | null;
}
