export type MarketRegion = "台股" | "美股" | "恐慌指數";

export interface IndexData {
  symbol: string;
  name: string;
  region: MarketRegion;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  updatedAt: number;
  error?: string;
}

export interface FearGreedData {
  score: number;
  rating: string;
  previousClose: number;
  updatedAt: string;
  error?: string;
}

export interface MarketApiResponse {
  data: IndexData[];
  fearGreed: FearGreedData | null;
  fetchedAt: string;
}
