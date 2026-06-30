import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (visible) {
      <div
        class="flex items-start gap-3 p-4 rounded-lg border"
        role="alert"
        [ngClass]="alertClasses"
      >
        <i [class]="alertIcon + ' text-lg shrink-0 mt-0.5'"></i>
        <p class="flex-1 text-sm font-medium">{{ message }}</p>
        @if (dismissible) {
          <button
            (click)="visible = false"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            <i class="ri-close-line text-base"></i>
          </button>
        }
      </div>
    }
  `,
})
export class AlertComponent {
  @Input({ required: true }) message = '';
  @Input() type: 'info' | 'success' | 'warning' | 'danger' = 'info';
  @Input() dismissible = false;

  visible = true;

  get alertClasses(): Record<string, boolean> {
    return {
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300': this.type === 'info',
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300': this.type === 'success',
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300': this.type === 'warning',
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300': this.type === 'danger',
    };
  }

  get alertIcon(): string {
    const icons: Record<string, string> = {
      info: 'ri-information-line',
      success: 'ri-checkbox-circle-line',
      warning: 'ri-alert-line',
      danger: 'ri-close-circle-line',
    };
    return icons[this.type];
  }
}
