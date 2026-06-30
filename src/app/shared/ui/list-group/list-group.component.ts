import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';

export interface ListGroupItem {
  label: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  active?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-list-group',
  standalone: true,
  imports: [NgClass, BadgeComponent],
  template: `
    <ul class="divide-y divide-gray-200 dark:divide-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 overflow-hidden">
      @for (item of items; track item.label) {
        <li
          class="flex items-center gap-3 px-4 py-3 transition-colors"
          [ngClass]="item.active
            ? 'bg-[var(--color-primary)]/10 border-l-4 border-l-[var(--color-primary)]'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
        >
          @if (item.icon) {
            <i [class]="item.icon + ' text-lg text-gray-500 dark:text-gray-300 shrink-0'"></i>
          }
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium truncate"
              [ngClass]="item.active
                ? 'text-[var(--color-primary)]'
                : 'text-gray-800 dark:text-white'"
            >
              {{ item.label }}
            </p>
            @if (item.description) {
              <p class="text-xs text-gray-500 dark:text-gray-300 mt-0.5 truncate">{{ item.description }}</p>
            }
          </div>
          @if (item.badge) {
            <app-badge [label]="item.badge" [variant]="item.badgeVariant ?? 'default'" />
          }
        </li>
      }
    </ul>
  `,
})
export class ListGroupComponent {
  @Input({ required: true }) items: ListGroupItem[] = [];
}
