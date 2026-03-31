import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage | null>();
  toast$ = this.toastSubject.asObservable();
  private timeoutId: any;

  showSuccess(message: string): void {
    this.show({ type: 'success', text: message });
  }

  showError(message: string): void {
    this.show({ type: 'error', text: message });
  }

  showInfo(message: string): void {
    this.show({ type: 'info', text: message });
  }

  clear(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.toastSubject.next(null);
  }

  private show(message: ToastMessage): void {
    this.clear();
    this.toastSubject.next(message);
    this.timeoutId = setTimeout(() => {
      this.toastSubject.next(null);
    }, 3000);
  }
}
