import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass, SpinnerComponent],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="!disabled && !loading && clicked.emit()"
      class="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      [ngClass]="buttonClasses"
    >
      @if (loading) {
        <app-spinner [size]="spinnerSize" />
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  get spinnerSize(): 'sm' | 'md' {
    return this.size === 'lg' ? 'md' : 'sm';
  }

  get buttonClasses(): Record<string, boolean> {
    const sizes: Record<string, boolean> = {
      'px-2.5 py-1.5 text-xs': this.size === 'sm',
      'px-4 py-2 text-sm': this.size === 'md',
      'px-6 py-3 text-base': this.size === 'lg',
    };
    const variants: Record<string, boolean> = {
      'bg-[var(--color-primary)] text-white hover:opacity-90 focus:ring-[var(--color-primary)]': this.variant === 'primary',
      'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400': this.variant === 'secondary',
      'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 focus:ring-[var(--color-primary)]': this.variant === 'outline',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': this.variant === 'danger',
      'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400': this.variant === 'ghost',
    };
    return { ...sizes, ...variants };
  }
}
