import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(options: Omit<Toast, 'id'>): void {
    const id = crypto.randomUUID();
    const toast: Toast = { duration: 4000, ...options, id };
    this._toasts.update((list) => [...list, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
  }

  dismiss(id: string): void {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
