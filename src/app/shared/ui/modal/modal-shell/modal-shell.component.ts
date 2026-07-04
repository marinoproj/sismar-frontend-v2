import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  template: `
    <div class="w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden" [class]="panelClass">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
        <button
          (click)="closed.emit()"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Fechar"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
      <div class="px-5 py-4">
        <ng-content />
      </div>
      <div class="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
        <ng-content select="[modal-footer]" />
      </div>
    </div>
  `,
})
export class ModalShellComponent {
  @Input({ required: true }) title = '';
  @Input() panelClass = 'max-w-md';
  @Output() closed = new EventEmitter<void>();
}
