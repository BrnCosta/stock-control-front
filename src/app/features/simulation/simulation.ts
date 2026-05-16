import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Card } from '../../shared/components/card/card';

@Component({
  selector: 'app-simulation',
  imports: [CommonModule, ReactiveFormsModule, Card, BaseChartDirective],
  templateUrl: './simulation.html',
  styleUrl: './simulation.css'
})
export class Simulation {
  private fb = new FormBuilder();

  simForm: FormGroup = this.fb.group({
    initialAmount: [10000, [Validators.required, Validators.min(0)]],
    monthlyContribution: [500, [Validators.required, Validators.min(0)]],
    annualRate: [8, [Validators.required, Validators.min(0)]],
    years: [10, [Validators.required, Validators.min(1), Validators.max(50)]]
  });

  totalPrincipal = 0;
  totalInterest = 0;
  finalBalance = 0;

  // Chart
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { min: 0, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    plugins: {
      legend: { labels: { color: '#94a3b8' } }
    }
  };
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Total Balance', borderColor: '#135bec', backgroundColor: 'rgba(19, 91, 236, 0.2)', fill: true, tension: 0.4 },
      { data: [], label: 'Total Principal', borderColor: '#94a3b8', borderDash: [5, 5], fill: false, tension: 0.4 }
    ]
  };

  constructor() {
    this.calculate();
    this.simForm.valueChanges.subscribe(() => {
      if (this.simForm.valid) this.calculate();
    });
  }

  calculate() {
    const { initialAmount, monthlyContribution, annualRate, years } = this.simForm.value;
    
    const months = years * 12;
    const monthlyRate = (annualRate / 100) / 12;
    
    let currentBalance = initialAmount;
    let currentPrincipal = initialAmount;
    
    const labels = [];
    const balanceData = [];
    const principalData = [];

    labels.push('Year 0');
    balanceData.push(currentBalance);
    principalData.push(currentPrincipal);

    for (let m = 1; m <= months; m++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
      currentPrincipal += monthlyContribution;

      if (m % 12 === 0) {
        labels.push(`Year ${m / 12}`);
        balanceData.push(Math.round(currentBalance));
        principalData.push(Math.round(currentPrincipal));
      }
    }

    this.totalPrincipal = currentPrincipal;
    this.finalBalance = currentBalance;
    this.totalInterest = currentBalance - currentPrincipal;

    this.lineChartData = {
      labels,
      datasets: [
        { data: balanceData, label: 'Total Balance', borderColor: '#135bec', backgroundColor: 'rgba(19, 91, 236, 0.2)', fill: true, tension: 0.4 },
        { data: principalData, label: 'Total Principal', borderColor: '#94a3b8', borderDash: [5, 5], fill: false, tension: 0.4 }
      ]
    };
  }
}
