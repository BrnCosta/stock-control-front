import { Asset } from './asset.model';
import { OperationType, Currency } from './enums.model';

export interface Transaction {
  id?: string;
  quantity: number;
  price: number;
  operatingType?: OperationType;
  operationType?: string | number;
  assetId?: string;
  assetTicker?: string;
  asset?: Asset;
  tradeId?: string;
}

export interface Trade {
  id: string;
  tax: number | null;
  date: string;
  currency: Currency;
  transactions: Transaction[];
}

export interface TransactionRequest {
  ticker: string;
  quantity: number;
  price: number;
  operatingType: OperationType;
}

export interface TradeRequest {
  date: string;
  tax?: number;
  currency: Currency;
  transactions: TransactionRequest[];
}
