import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 p-4 rounded-lg shadow-lg border pointer-events-auto animate-fade-in"
          [ngClass]="toastClasses(toast)"
          role="alert"
        >
          <i [class]="toastIcon(toast) + ' text-lg shrink-0 mt-0.5'"></i>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <i class="ri-close-line text-base"></i>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  toastClasses(toast: Toast): Record<string, boolean> {
    return {
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300':
        toast.type === 'success',
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300':
        toast.type === 'error',
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-700 dark:text-yellow-300':
        toast.type === 'warning',
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300':
        toast.type === 'info',
    };
  }

  toastIcon(toast: Toast): string {
    const icons: Record<string, string> = {
      success: 'ri-checkbox-circle-line',
      error: 'ri-close-circle-line',
      warning: 'ri-alert-line',
      info: 'ri-information-line',
    };
    return icons[toast.type];
  }
}
