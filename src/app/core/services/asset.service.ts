import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/asset`;

  getLatestUpdate(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/latest-update`);
  }

  updateAssetsPrices(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/update`);
  }
}
