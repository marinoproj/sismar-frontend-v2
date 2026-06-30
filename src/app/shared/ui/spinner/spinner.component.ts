import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <span
      class="inline-block rounded-full border-2 border-current border-t-transparent animate-spin"
      [ngClass]="sizeClasses"
      [ngStyle]="color ? { color } : {}"
      role="status"
      aria-label="Carregando"
    ></span>
  `,
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color?: string;

  get sizeClasses(): Record<string, boolean> {
    return {
      'w-4 h-4': this.size === 'sm',
      'w-6 h-6': this.size === 'md',
      'w-10 h-10': this.size === 'lg',
    };
  }
}
