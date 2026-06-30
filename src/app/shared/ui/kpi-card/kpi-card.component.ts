import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shrink-0"
        [style.background]="'var(--color-primary)'"
      >
        <i [class]="icon"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        <p
          class="text-xs mt-0.5 font-medium"
          [ngClass]="change >= 0 ? 'text-green-600' : 'text-red-500'"
        >
          <i [class]="change >= 0 ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </p>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input({ required: true }) change = 0;
  @Input({ required: true }) icon = '';
}
