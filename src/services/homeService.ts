export interface Asset {
  name: string;
  average_price: number;
  current_price: number;
  quantity: number;
  type: string;
}

export interface OverviewData {
  invested_amount: number;
  current_value: number;
  available_balance: number;
  assets: Asset[];
}

export async function getOverviewData(): Promise<OverviewData> {
  const res = await fetch('/api/overview/overview_result.json');
  return res.json();
} 