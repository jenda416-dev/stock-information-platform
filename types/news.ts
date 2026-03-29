export interface BulletPoint {
  point: string;
  sources: Array<{ title: string; url: string }>;
}

export interface NewsDigest {
  id: string;
  digestDate: string;
  bulletPoints: BulletPoint[];
  modelUsed: string;
  articleCount: number;
  generatedAt: string | null;
  status: string | null;
}
