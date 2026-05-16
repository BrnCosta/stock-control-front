import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { Position, PortfolioBalance, WalletOverview } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/position`;

  getCurrentPosition(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl);
  }

  getPortfolioBalance(): Observable<PortfolioBalance> {
    return this.http.get<PortfolioBalance>(`${this.apiUrl}/balance`);
  }

  getWalletOverview(): Observable<WalletOverview> {
    return this.http.get<WalletOverview>(`${this.apiUrl}/wallet`);
  }
}
