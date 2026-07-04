import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab-placeholder',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <i class="ri-tools-line text-5xl text-[var(--color-primary)] mb-3"></i>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ title }}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Em desenvolvimento. Esta funcionalidade estará disponível em breve.
      </p>
    </div>
  `,
})
export class TabPlaceholderComponent {
  readonly title = (inject(ActivatedRoute).snapshot.data['title'] as string) ?? 'Em desenvolvimento';
}
