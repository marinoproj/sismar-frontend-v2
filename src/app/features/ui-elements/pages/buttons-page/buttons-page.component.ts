import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-buttons-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './buttons-page.component.html',
})
export class ButtonsPageComponent {
  loadingState = signal(false);

  simulateLoading(): void {
    this.loadingState.set(true);
    setTimeout(() => this.loadingState.set(false), 2000);
  }
}
