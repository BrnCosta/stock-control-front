import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Card } from '../../shared/components/card/card';
import { PositionService } from '../../core/services/position.service';
import { AssetService } from '../../core/services/asset.service';
import { PortfolioBalance, Position, WalletOverview } from '../../core/models/position.model';
import { finalize } from 'rxjs/operators';

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

  balance?: PortfolioBalance;
  positions: Position[] = [];
  wallet?: WalletOverview;
  lastUpdate?: string;
  loading = true;

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

  ngOnInit() {
    this.loadData();

    this.assetService.getLatestUpdate().subscribe({
      next: (u) => { if (u) this.lastUpdate = u; this.cdr.detectChanges(); },
      error: (e) => console.error('Error lastUpdate:', e)
    });
  }

  updateAssetsPrices() {
    this.assetService.updateAssetsPrices().subscribe({
      next: (updateTime) => {
        this.lastUpdate = updateTime;
        this.loadData();
      },
      error: (e) => console.error('Error updating assets prices:', e)
    });
  }

  loadData() {
    this.loading = true;
    let pending = 3;
    const checkDone = () => {
      pending--;
      if (pending === 0) {
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    this.positionService.getPortfolioBalance().pipe(finalize(checkDone)).subscribe({
      next: (b) => { if (b) this.balance = b; this.cdr.detectChanges(); },
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
            labels: w.assetTypes.map(a => a.assetType),
            datasets: [{
              data: w.assetTypes.map(a => a.value),
              backgroundColor: [
                'rgba(19, 91, 236, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(239, 68, 68, 0.8)'
              ],
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
