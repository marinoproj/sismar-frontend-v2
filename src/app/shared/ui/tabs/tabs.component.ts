import { Component, computed, inject, input } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

export interface TabItem {
  label: string;
  route: string;
  feature?: string;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    <div class="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
      @for (tab of resolvedTabs(); track tab.route) {
        @if (tab.disabled) {
          <span
            class="px-4 py-2.5 text-sm font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed flex items-center gap-1.5"
            [title]="'Sem permissão para acessar ' + tab.label"
          >
            <i class="ri-lock-line text-xs"></i>
            {{ tab.label }}
          </span>
        } @else {
          <a
            [routerLink]="tab.route"
            [ngClass]="tab.active
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
            class="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors"
          >
            {{ tab.label }}
          </a>
        }
      }
    </div>
  `,
})
export class TabsComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly tabs = input.required<TabItem[]>();

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly resolvedTabs = computed(() => {
    const url = this.currentUrl().split('?')[0];
    return this.tabs().map((tab) => ({
      ...tab,
      disabled: !!tab.feature && !this.auth.hasFeature(tab.feature),
      active: url.endsWith(`/${tab.route}`),
    }));
  });
}
