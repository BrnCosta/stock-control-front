import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { Trade, TradeRequest } from '../models/trade.model';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/trade`;

  getAllTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.apiUrl);
  }

  createTrade(trade: TradeRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, trade, { responseType: 'text' as 'json' });
  }
}
