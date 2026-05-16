import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';
import { DividendRequest, DividendByMonth, DividendBySymbol } from '../models/dividend.model';

@Injectable({
  providedIn: 'root'
})
export class DividendService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}/dividend`;

  createDividend(dividend: DividendRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, dividend, { responseType: 'text' as 'json' });
  }

  getDividendsByMonth(): Observable<DividendByMonth[]> {
    return this.http.get<DividendByMonth[]>(`${this.apiUrl}/by-month`);
  }

  getDividendsBySymbol(): Observable<DividendBySymbol[]> {
    return this.http.get<DividendBySymbol[]>(`${this.apiUrl}/by-symbol`);
  }
}
