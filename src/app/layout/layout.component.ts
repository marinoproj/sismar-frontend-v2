import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../core/services/layout.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly layout = inject(LayoutService);

  get showOverlay(): boolean {
    return this.layout.sidebarState() === 'mobile-open';
  }

  get showMobileSidebar(): boolean {
    return this.layout.sidebarState() === 'mobile-open';
  }
}
