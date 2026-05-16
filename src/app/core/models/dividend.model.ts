export interface DividendRequest {
  ticker: string;
  value: number;
  date: string;
}

export interface DividendByMonth {
  year: number;
  month: number;
  totalValue: number;
}

export interface DividendBySymbol {
  asset: string;
  year: number;
  month: number;
  totalValue: number;
}
