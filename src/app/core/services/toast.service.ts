import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSubject = new Subject<ToastMessage>();
  public messages$ = this.messageSubject.asObservable();

  showSuccess(message: string) {
    this.messageSubject.next({ type: 'success', message });
  }

  showError(message: string) {
    this.messageSubject.next({ type: 'error', message });
  }

  showInfo(message: string) {
    this.messageSubject.next({ type: 'info', message });
  }
}
