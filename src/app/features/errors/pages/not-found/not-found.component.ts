import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 text-center">
      <div class="text-8xl font-black text-[var(--color-primary)] mb-4">404</div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Página não encontrada</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        A página que você está tentando acessar não existe ou foi removida.
      </p>
      <a
        routerLink="/dashboard"
        class="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:opacity-90 transition"
      >
        Voltar ao Dashboard
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
