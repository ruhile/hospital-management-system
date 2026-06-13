import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];
  private counter = 0;

  showSuccess(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  private show(message: string, type: 'success' | 'error', duration: number): void {
    const id = this.counter++;
    const toast: Toast = { id, message, type, duration };
    this.toasts.push(toast);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
