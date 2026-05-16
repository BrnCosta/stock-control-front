import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormArray } from '@angular/forms';
import { Card } from '../../shared/components/card/card';
import { TradeService } from '../../core/services/trade.service';
import { PositionService } from '../../core/services/position.service';
import { ToastService } from '../../core/services/toast.service';
import { Trade, TradeRequest, TransactionRequest } from '../../core/models/trade.model';
import { Position } from '../../core/models/position.model';
import { Currency, OperationType } from '../../core/models/enums.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Card],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder);
  private tradeService = inject(TradeService);
  private positionService = inject(PositionService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  trades: Trade[] = [];
  positions: Position[] = [];
  loading = true;
  submitting = false;
  expandedTrades: Set<string> = new Set<string>();

  tradeForm: FormGroup = this.fb.group({
    date: [new Date().toISOString().substring(0, 10), [Validators.required]],
    currency: ['CAD', [Validators.required]],
    tax: [0, [Validators.min(0)]],
    transactions: this.fb.array([this.createTransactionGroup()])
  });

  get transactionsFormArray(): FormArray {
    return this.tradeForm.get('transactions') as FormArray;
  }

  createTransactionGroup(): FormGroup {
    return this.fb.group({
      ticker: ['', [Validators.required]],
      operationType: ['1', [Validators.required]], // Buy = 1, Sell = 0
      quantity: [1, [Validators.required, Validators.min(0.0001)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  addTransaction() {
    this.transactionsFormArray.push(this.createTransactionGroup());
  }

  removeTransaction(index: number) {
    if (this.transactionsFormArray.length > 1) {
      this.transactionsFormArray.removeAt(index);
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.cdr.detectChanges();
    this.tradeService.getAllTrades().subscribe({
      next: (data) => {
        this.trades = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.positionService.getCurrentPosition().subscribe({
      next: (pos) => {
        this.positions = pos || [];
      }
    });
  }

  onSubmit() {
    if (this.tradeForm.invalid) return;

    const formVal = this.tradeForm.value;
    const transactions: TransactionRequest[] = [];

    // Business Validation and building transactions
    for (const tx of formVal.transactions) {
      const ticker = tx.ticker.toUpperCase();
      const quantity = Number(tx.quantity);
      
      if (tx.operationType === '0') {
        const pos = this.positions.find(p => p.ticker.toUpperCase() === ticker);
        const currentQty = pos ? pos.quantity : 0;
        if (quantity > currentQty) {
          this.toastService.showError(`Invalid Sell for ${ticker}: You own ${currentQty} units, but tried to sell ${quantity}.`);
          return;
        }
      }

      transactions.push({
        ticker: ticker,
        quantity: quantity,
        price: Number(tx.price),
        operatingType: Number(tx.operationType) as OperationType
      });
    }

    this.submitting = true;
    const request: TradeRequest = {
      date: new Date(formVal.date).toISOString(),
      currency: formVal.currency as Currency,
      tax: formVal.tax || 0,
      transactions: transactions
    };

    this.tradeService.createTrade(request).subscribe({
      next: () => {
        this.toastService.showSuccess(`Trade recorded successfully!`);
        setTimeout(() => {
          this.submitting = false;
          this.resetForm();
          this.loadData();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm() {
    this.tradeForm.reset({
      date: new Date().toISOString().substring(0, 10),
      currency: 'CAD',
      tax: 0
    });
    
    this.transactionsFormArray.clear();
    this.addTransaction();
    this.cdr.detectChanges();
  }

  isBuy(tx: any): boolean {
    return tx.operationType === 'Buy' || tx.operationType === 1 || tx.operatingType === 1 || tx.operatingType === 'Buy';
  }

  getOperationTypeName(tx: any): string {
    return this.isBuy(tx) ? 'Buy' : 'Sell';
  }

  toggleTrade(tradeId: string) {
    if (this.expandedTrades.has(tradeId)) {
      this.expandedTrades.delete(tradeId);
    } else {
      this.expandedTrades.add(tradeId);
    }
  }

  isExpanded(tradeId: string): boolean {
    return this.expandedTrades.has(tradeId);
  }
}

