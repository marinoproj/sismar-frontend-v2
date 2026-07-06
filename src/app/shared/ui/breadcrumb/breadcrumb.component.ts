import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (breadcrumbs().length > 0) {
      <nav class="flex items-center gap-1.5 text-sm mb-4 flex-wrap">
        @for (crumb of breadcrumbs(); track crumb.url; let last = $last) {
          @if (!last) {
            <a
              [routerLink]="crumb.url"
              class="text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors"
            >
              {{ crumb.label }}
            </a>
            <i class="ri-arrow-right-s-line text-gray-400 dark:text-gray-600 text-base"></i>
          } @else {
            <span class="text-gray-800 dark:text-white font-medium">{{ crumb.label }}</span>
          }
        }
      </nav>
    }
  `,
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs(this.route.root)),
    ),
    { initialValue: [] as Breadcrumb[] },
  );

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    crumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    for (const child of route.children) {
      if (!child.snapshot) continue; // rota lazy ainda não resolvida no momento deste NavigationEnd
      const segment = child.snapshot.url.map((s) => s.path).join('/');
      const nextUrl = segment ? `${url}/${segment}` : url;
      if (child.snapshot.data['breadcrumb']) {
        crumbs.push({ label: child.snapshot.data['breadcrumb'] as string, url: nextUrl });
      }
      this.buildBreadcrumbs(child, nextUrl, crumbs);
    }
    return crumbs;
  }
}
