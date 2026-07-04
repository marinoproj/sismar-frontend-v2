import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center text-center py-24 px-8">
      <i class="ri-tools-line text-6xl text-[var(--color-primary)] mb-4"></i>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Em construção</h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-sm">
        As páginas do produto ainda estão sendo desenvolvidas. Em breve este espaço trará o conteúdo real do sistema.
      </p>
    </div>
  `,
})
export class HomeComponent {}
