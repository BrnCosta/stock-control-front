import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { Position, PortfolioBalance, AssetTypeOverview } from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/position`;

  getCurrentPosition(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl);
  }

  getPortfolioBalance(): Observable<PortfolioBalance[]> {
    return this.http.get<PortfolioBalance[]>(`${this.apiUrl}/balance`);
  }

  getWalletOverview(): Observable<AssetTypeOverview[]> {
    return this.http.get<AssetTypeOverview[]>(`${this.apiUrl}/wallet`);
  }
}
