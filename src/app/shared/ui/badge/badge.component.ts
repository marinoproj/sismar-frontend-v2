import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      [ngClass]="badgeClasses"
    >
      {{ label }}
    </span>
  `,
})
export class BadgeComponent {
  @Input({ required: true }) label = '';
  @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'default';

  get badgeClasses(): Record<string, boolean> {
    return {
      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': this.variant === 'default',
      'bg-[var(--color-primary)]/10 text-[var(--color-primary)]': this.variant === 'primary',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': this.variant === 'success',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': this.variant === 'warning',
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': this.variant === 'danger',
    };
  }
}
