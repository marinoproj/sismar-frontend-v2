import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    @if (variant === 'chart') {
      <div class="w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" [style.height.px]="height"></div>
    } @else {
      <div class="flex items-center gap-4 animate-pulse">
        <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
        <div class="flex-1 min-w-0 space-y-2">
          <div class="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    }
  `,
})
export class SkeletonComponent {
  @Input() variant: 'card' | 'chart' = 'card';
  @Input() height = 350;
}
