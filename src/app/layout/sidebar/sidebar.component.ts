import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';
import { THEME_CONFIG } from '../../core/config/theme.config';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';
import { getNavSections, NavItem } from '../nav-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
  styles: [`
    nav {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
    }

    nav::-webkit-scrollbar {
      width: 6px;
    }

    nav::-webkit-scrollbar-track {
      background: transparent;
    }

    nav::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.18);
      border-radius: 9999px;
    }

    nav::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.28);
    }
  `],
})
export class SidebarComponent {
  readonly layout = inject(LayoutService);
  readonly config = inject(THEME_CONFIG);
  private readonly auth = inject(AuthService);
  readonly navSections = computed(() =>
    getNavSections({
      production: environment.production,
      hasFeature: (feature) => this.auth.hasFeature(feature),
    }),
  );
  expandedGroups = new Set<string>();

  get isCollapsed(): boolean {
    return this.layout.sidebarState() === 'collapsed';
  }

  toggleGroup(label: string): void {
    if (this.expandedGroups.has(label)) {
      this.expandedGroups.delete(label);
    } else {
      this.expandedGroups.add(label);
    }
  }

  isGroupExpanded(label: string): boolean {
    return this.expandedGroups.has(label);
  }

  onNavClick(): void {
    this.layout.closeMobileDrawer();
  }

  trackByLabel(_: number, item: NavItem): string {
    return item.label;
  }
}
