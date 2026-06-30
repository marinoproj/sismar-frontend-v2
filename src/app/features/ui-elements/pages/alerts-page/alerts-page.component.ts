import { Component } from '@angular/core';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './alerts-page.component.html',
})
export class AlertsPageComponent {}
