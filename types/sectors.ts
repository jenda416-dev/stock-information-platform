export type SectorStock = {
  stockId: string
  stockName: string
}

export type Sector = {
  id: number
  name: string
  description?: string
  stocks: SectorStock[]
}

export type SectorsData = {
  updatedAt: string
  sectors: Sector[]
}

export type SectorWithStocks = {
  id: number
  name: string
  changePercent: number
  stocks: SectorStock[]
}

export type SectorApiResponse = {
  sectors: SectorWithStocks[]
  period: string
  country: string
  fetchedAt: string
  error?: string
}
