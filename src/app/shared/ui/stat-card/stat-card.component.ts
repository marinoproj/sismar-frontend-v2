import { Component, Input } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    @if (loading) {
      <app-skeleton variant="card" />
    } @else {
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shrink-0"
          [style.background]="'var(--color-primary)'"
        >
          <i [class]="icon"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ label }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        </div>
      </div>
    }
  `,
})
export class StatCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input({ required: true }) icon = '';
  @Input() loading = false;
}
