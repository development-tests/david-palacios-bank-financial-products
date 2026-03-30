import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
  id?: number;
}


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ type: 'success', text: message });
  }

  showError(message: string): void {
    this.toastSubject.next({ type: 'error', text: message });
  }

  showInfo(message: string): void {
    this.toastSubject.next({ type: 'info', text: message });
  }
}
