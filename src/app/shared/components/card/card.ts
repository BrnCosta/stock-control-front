import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--surface-dark);
      border-radius: var(--radius-base);
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
  `]
})
export class Card {
  @Input() title?: string;
}
