import { inject, Injectable, signal } from '@angular/core';
import { THEME_CONFIG } from '../config/theme.config';

const STORAGE_KEY = 'theme-mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly config = inject(THEME_CONFIG);

  readonly currentMode = signal<'light' | 'dark'>(this.resolveInitialMode());

  init(): void {
    this.applyMode(this.currentMode());
    this.applyColors();
  }

  toggleMode(): void {
    const next = this.currentMode() === 'light' ? 'dark' : 'light';
    this.currentMode.set(next);
    localStorage.setItem(STORAGE_KEY, next);
    this.applyMode(next);
  }

  private resolveInitialMode(): 'light' | 'dark' {
    const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    return saved ?? this.config.defaultMode;
  }

  private applyMode(mode: 'light' | 'dark'): void {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  private applyColors(): void {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', this.config.primaryColor);
    root.style.setProperty('--color-menu-bg', this.config.menuColor);
    root.style.setProperty('--color-header-bg', this.config.headerColor);
  }
}
