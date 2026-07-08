import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-ticker-card',
  standalone: true,
  imports: [NgClass, SkeletonComponent],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
      @if (loading) {
        <app-skeleton variant="card" />
      } @else {
        <div class="flex flex-col gap-1">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-base font-bold text-gray-900 dark:text-white">{{ symbol }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ name }}</p>
            </div>
            <span
              class="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
              [ngClass]="trend === 'up'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'"
            >
              <i [class]="trend === 'up' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
              {{ change >= 0 ? '+' : '' }}{{ change }}%
            </span>
          </div>
          <p class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ currency }} {{ currentValue.toFixed(2).replace('.', ',') }}
          </p>
        </div>
      }
    </div>
  `,
})
export class TickerCardComponent {
  @Input({ required: true }) symbol = '';
  @Input({ required: true }) name = '';
  @Input({ required: true }) currentValue = 0;
  @Input({ required: true }) change = 0;
  @Input({ required: true }) trend: 'up' | 'down' = 'up';
  @Input() currency = 'R$';
  @Input() loading = false;
}
