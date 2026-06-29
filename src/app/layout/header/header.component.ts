import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/auth/auth.service';
import { THEME_CONFIG } from '../../core/config/theme.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly layout = inject(LayoutService);
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);
  readonly config = inject(THEME_CONFIG);
  private readonly router = inject(Router);

  userMenuOpen = signal(false);
  notificationCount = signal(5);

  get isDark(): boolean {
    return this.theme.currentMode() === 'dark';
  }

  toggleTheme(): void {
    this.theme.toggleMode();
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
