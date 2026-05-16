export interface Position {
  ticker: string;
  averagePrice: number;
  quantity: number;
  totalInvested: number;
  currentPrice: number;
  currentInvested: number;
  currentGain: number;
  gainPercentage: number;
  assetType: string;
}

export interface PortfolioBalance {
  totalInvested: number;
  currentInvested: number;
  totalGain: number;
  gainPercentage: number;
}

export interface AssetTypeOverview {
  assetType: string;
  value: number;
}

export interface WalletOverview {
  assetTypes: AssetTypeOverview[];
  totalValue: number;
}
