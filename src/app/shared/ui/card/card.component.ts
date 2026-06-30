import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
      <ng-content select="[card-header]" />
      <div class="p-4">
        <ng-content select="[card-body]" />
      </div>
      <ng-content select="[card-footer]" />
    </div>
  `,
})
export class CardComponent {}
