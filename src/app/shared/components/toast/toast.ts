import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private sub?: Subscription;

  messages: (ToastMessage & { id: number })[] = [];
  private nextId = 0;

  ngOnInit() {
    this.sub = this.toastService.messages$.subscribe((msg: ToastMessage) => {
      const id = this.nextId++;
      this.messages.push({ ...msg, id });
      this.cdr.detectChanges();
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        this.remove(id);
      }, 5000);
    });
  }

  remove(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
