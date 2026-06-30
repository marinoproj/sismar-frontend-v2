import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';
import { THEME_CONFIG } from '../../core/config/theme.config';
import { navSections, NavItem } from '../nav-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly layout = inject(LayoutService);
  readonly config = inject(THEME_CONFIG);
  readonly navSections = navSections;
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
