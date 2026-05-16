import { AssetType, Currency } from './enums.model';

export interface Asset {
  id: string;
  ticker: string;
  price: number;
  type: AssetType;
  lastUpdate: string;
  currency: Currency;
}
