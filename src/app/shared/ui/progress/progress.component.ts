import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <div>
      @if (label) {
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ label }}</span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ percent }}%</span>
        </div>
      }
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          class="h-2 rounded-full transition-all duration-500"
          [ngClass]="barClasses"
          [ngStyle]="{ width: percent + '%' }"
          role="progressbar"
          [attr.aria-valuenow]="value"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="max"
        ></div>
      </div>
    </div>
  `,
})
export class ProgressComponent {
  @Input({ required: true }) value = 0;
  @Input() max = 100;
  @Input() label?: string;
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  get percent(): number {
    return Math.min(100, Math.max(0, Math.round((this.value / this.max) * 100)));
  }

  get barClasses(): Record<string, boolean> {
    return {
      'bg-[var(--color-primary)]': this.variant === 'primary',
      'bg-green-500': this.variant === 'success',
      'bg-yellow-500': this.variant === 'warning',
      'bg-red-500': this.variant === 'danger',
    };
  }
}
