import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSignal = signal<ToastMessage[]>([]);
  toasts = this.toastsSignal.asReadonly();
  private nextId = 0;

  show(message: string, type: ToastMessage['type'] = 'info', duration: number = 3000): void {
    const id = this.nextId++;
    const toast: ToastMessage = { id, message, type };
    this.toastsSignal.update(toasts => [...toasts, toast]);
    
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}