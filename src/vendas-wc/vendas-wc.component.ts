import { Component, HostBinding, Input } from '@angular/core';
import { VendasPageComponent } from '../app/features/dashboard/pages/vendas-page/vendas-page.component';

@Component({
  selector: 'app-vendas-wc',
  standalone: true,
  imports: [VendasPageComponent],
  template: `
    <div class="bg-[var(--color-bg)] min-h-screen p-6 font-sans">
      <app-vendas-page />
    </div>
  `,
})
export class VendasWcComponent {
  @HostBinding('style.display') readonly display = 'block';
  @HostBinding('class.dark') isDark = false;

  @Input() set theme(value: 'light' | 'dark') {
    this.isDark = value === 'dark';
  }
}
