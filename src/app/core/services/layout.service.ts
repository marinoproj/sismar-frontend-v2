import { inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type SidebarState = 'expanded' | 'collapsed' | 'mobile-open' | 'mobile-closed';

const STORAGE_KEY = 'sidebar-state';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private isMobile = signal(false);

  readonly sidebarState = signal<SidebarState>(this.resolveInitialState());

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 767px)')
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        if (result.matches) {
          this.sidebarState.set('mobile-closed');
        } else {
          this.sidebarState.set(this.resolveDesktopState());
        }
      });
  }

  toggle(): void {
    if (this.isMobile()) {
      const current = this.sidebarState();
      const next = current === 'mobile-open' ? 'mobile-closed' : 'mobile-open';
      this.sidebarState.set(next);
    } else {
      const current = this.sidebarState();
      const next = current === 'expanded' ? 'collapsed' : 'expanded';
      this.sidebarState.set(next);
      localStorage.setItem(STORAGE_KEY, next);
    }
  }

  closeMobileDrawer(): void {
    if (this.isMobile()) {
      this.sidebarState.set('mobile-closed');
    }
  }

  isMobileMode(): boolean {
    return this.isMobile();
  }

  private resolveInitialState(): SidebarState {
    return this.resolveDesktopState();
  }

  private resolveDesktopState(): 'expanded' | 'collapsed' {
    const saved = localStorage.getItem(STORAGE_KEY) as 'expanded' | 'collapsed' | null;
    return saved ?? 'expanded';
  }
}
