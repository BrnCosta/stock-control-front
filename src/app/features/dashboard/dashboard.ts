import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Card } from '../../shared/components/card/card';
import { PositionService } from '../../core/services/position.service';
import { AssetService } from '../../core/services/asset.service';
import { PortfolioBalance, Position, AssetTypeOverview } from '../../core/models/position.model';
import { finalize } from 'rxjs/operators';

type PositionSortKey =
  | 'ticker'
  | 'assetType'
  | 'quantity'
  | 'averagePrice'
  | 'currentPrice'
  | 'currentInvested'
  | 'totalInvested'
  | 'currentGain';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Card, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private positionService = inject(PositionService);
  private assetService = inject(AssetService);
  private cdr = inject(ChangeDetectorRef);

  balance?: PortfolioBalance[];
  positions: Position[] = [];
  wallet?: AssetTypeOverview[];
  lastUpdate?: string;
  loading = true;
  refreshing = false;
  sortKey?: PositionSortKey;
  sortDirection: SortDirection = 'asc';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#ffffff' }
      }
    }
  };
  public pieChartData?: ChartData<'pie', number[], string | string[]>;

  get sortedPositions(): Position[] {
    if (!this.sortKey) {
      return this.positions;
    }

    return [...this.positions].sort((left, right) => {
      const leftValue = left[this.sortKey!];
      const rightValue = right[this.sortKey!];
      const comparison = typeof leftValue === 'string' && typeof rightValue === 'string'
        ? leftValue.localeCompare(rightValue)
        : Number(leftValue) - Number(rightValue);

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  get currencyGroups(): { currency: string; positions: Position[] }[] {
    const groups = new Map<string, Position[]>();

    this.sortedPositions.forEach(position => {
      const group = groups.get(position.currency) || [];
      group.push(position);
      groups.set(position.currency, group);
    });

    return Array.from(groups, ([currency, positions]) => ({ currency, positions }));
  }

  sortPositions(key: PositionSortKey) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.sortKey = key;
    this.sortDirection = 'asc';
  }

  getSortIndicator(key: PositionSortKey): string {
    if (this.sortKey !== key) {
      return '↕';
    }

    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  private readonly assetTypePalette = [
    'rgba(51, 104, 209, 0.99)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(236, 72, 153, 0.8)'
  ];

  private readonly assetTypeColorMap: Record<string, string> = {
    stock: this.assetTypePalette[0],
    reit: this.assetTypePalette[1],
    etf: this.assetTypePalette[2],
    bond: this.assetTypePalette[3],
    crypto: this.assetTypePalette[4],
    cash: this.assetTypePalette[5],
    fund: this.assetTypePalette[6]
  };

  ngOnInit() {
    this.loadData();

    this.assetService.getLatestUpdate().subscribe({
      next: (u) => { if (u) this.lastUpdate = u; this.cdr.detectChanges(); },
      error: (e) => console.error('Error lastUpdate:', e)
    });
  }

  updateAssetsPrices() {
    if (this.refreshing) {
      return;
    }

    this.refreshing = true;
    this.assetService.updateAssetsPrices().subscribe({
      next: (updateTime) => {
        this.lastUpdate = updateTime;
        this.loadData(() => {
          this.refreshing = false;
          this.cdr.detectChanges();
        });
      },
      error: (e) => {
        this.refreshing = false;
        this.cdr.detectChanges();
        console.error('Error updating assets prices:', e);
      }
    });
  }

  getAssetTypeColor(assetType?: string): string {
    const normalized = (assetType || '').trim().toLowerCase().replace(/s$/, '');

    if (this.assetTypeColorMap[normalized]) {
      return this.assetTypeColorMap[normalized];
    }

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % this.assetTypePalette.length;
    return this.assetTypePalette[index];
  }

  loadData(onComplete?: () => void) {
    this.loading = true;
    let pending = 3;
    const checkDone = () => {
      pending--;
      if (pending === 0) {
        this.loading = false;
        onComplete?.();
        this.cdr.detectChanges();
      }
    };

    this.positionService.getPortfolioBalance().pipe(finalize(checkDone)).subscribe({
      next: (b) => {
        if (b) {
          this.balance = b;
        }

        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error balance:', e)
    });

    this.positionService.getCurrentPosition().pipe(finalize(checkDone)).subscribe({
      next: (p) => { if (p) this.positions = p; this.cdr.detectChanges(); },
      error: (e) => console.error('Error positions:', e)
    });

    this.positionService.getWalletOverview().pipe(finalize(checkDone)).subscribe({
      next: (w) => {
        if (w) {
          this.wallet = w;
          this.pieChartData = {
            labels: this.wallet.map(a => a.assetType),
            datasets: [{
              data: this.wallet.map(a => a.value),
              backgroundColor: this.wallet.map(item => this.getAssetTypeColor(item.assetType)),
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1
            }]
          };
        }
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error wallet:', e)
    });
  }
}
