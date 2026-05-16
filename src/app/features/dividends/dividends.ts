import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Card } from '../../shared/components/card/card';
import { DividendService } from '../../core/services/dividend.service';
import { ToastService } from '../../core/services/toast.service';
import { DividendByMonth, DividendBySymbol, DividendRequest } from '../../core/models/dividend.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dividends',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Card, BaseChartDirective],
  templateUrl: './dividends.html',
  styleUrl: './dividends.css'
})
export class Dividends implements OnInit {
  private fb = inject(FormBuilder);
  private dividendService = inject(DividendService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  submitting = false;
  
  // Filtering and Stats
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [new Date().getFullYear()];
  avgMonthlyIncome: number = 0;
  totalYearIncome: number = 0;

  // Raw data
  private allDividendsByMonth: DividendByMonth[] = [];
  private allDividendsBySymbol: DividendBySymbol[] = [];
  
  // Display data
  assetMonthlyData: { ticker: string, months: (number | string)[], total: number }[] = [];
  monthsHeader = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  dividendForm: FormGroup = this.fb.group({
    ticker: ['', [Validators.required]],
    value: [0, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().substring(0, 10), [Validators.required]]
  });

  // Monthly Chart
  public barChartPlugins = [ChartDataLabels];
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 30 }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { min: 0, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#e2e8f0',
        font: { weight: 'bold', size: 11 },
        formatter: (value: number) => value > 0 ? value.toFixed(2) : ''
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Dividends', backgroundColor: '#135bec', borderRadius: 4 }]
  };

  ngOnInit() {
    this.loadCharts();
  }

  onYearChange(year: string) {
    this.selectedYear = Number(year);
    this.applyFilters();
  }

  loadCharts() {
    this.loading = true;
    let pending = 2;
    const checkDone = () => {
      pending--;
      if (pending === 0) {
        this.loading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      }
    };

    this.dividendService.getDividendsByMonth().pipe(finalize(checkDone)).subscribe({
      next: (byMonth) => {
        this.allDividendsByMonth = byMonth || [];
        this.updateAvailableYears();
      },
      error: (e) => console.error('Error fetching by month:', e)
    });

    this.dividendService.getDividendsBySymbol().pipe(finalize(checkDone)).subscribe({
      next: (bySymbol) => {
        this.allDividendsBySymbol = bySymbol || [];
      },
      error: (e) => console.error('Error fetching by symbol:', e)
    });
  }

  updateAvailableYears() {
    const yearsSet = new Set<number>();
    yearsSet.add(new Date().getFullYear());
    this.allDividendsByMonth.forEach(d => yearsSet.add(d.year));
    this.availableYears = Array.from(yearsSet).sort((a, b) => b - a);
  }

  applyFilters() {
    // 1. Filter and aggregate Bar Chart data
    const yearData = this.allDividendsByMonth.filter(d => d.year === this.selectedYear);
    const monthValues = new Array(12).fill(0);
    
    yearData.forEach(d => {
      if (d.month >= 1 && d.month <= 12) {
        monthValues[d.month - 1] = d.totalValue;
      }
    });

    this.barChartData = {
      labels: this.monthsHeader,
      datasets: [{ 
        data: monthValues, 
        label: 'Dividends', 
        backgroundColor: '#135bec', 
        borderRadius: 4 
      }]
    };

    // 2. Calculate Stats
    this.totalYearIncome = monthValues.reduce((sum, val) => sum + val, 0);
    this.avgMonthlyIncome = this.totalYearIncome / 12;

    // 3. Filter and group Symbol data for Matrix Table
    const tickerMap = new Map<string, { ticker: string, months: (number | string)[], total: number }>();
    
    this.allDividendsBySymbol
      .filter(d => d.year === this.selectedYear)
      .forEach(d => {
        if (!tickerMap.has(d.asset)) {
          tickerMap.set(d.asset, {
            ticker: d.asset,
            months: new Array(12).fill('-'),
            total: 0
          });
        }
        
        const row = tickerMap.get(d.asset)!;
        if (d.month >= 1 && d.month <= 12) {
          row.months[d.month - 1] = d.totalValue;
        }
        row.total += d.totalValue;
      });

    this.assetMonthlyData = Array.from(tickerMap.values())
      .sort((a, b) => b.total - a.total);

    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.dividendForm.invalid) return;

    this.submitting = true;
    const formVal = this.dividendForm.value;

    const request: DividendRequest = {
      ticker: formVal.ticker.toUpperCase(),
      value: Number(formVal.value),
      date: new Date(formVal.date).toISOString()
    };

    this.dividendService.createDividend(request).subscribe({
      next: () => {
        this.submitting = false;
        this.toastService.showSuccess(`Dividends for ${formVal.ticker.toUpperCase()} added successfully!`);
        this.dividendForm.reset({
          date: new Date().toISOString().substring(0, 10),
          value: 0
        });
        this.loadCharts();
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}

