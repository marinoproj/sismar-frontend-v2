import { Component } from '@angular/core';
import { ProgressComponent } from '../../../../shared/ui/progress/progress.component';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [ProgressComponent],
  templateUrl: './progress-page.component.html',
})
export class ProgressPageComponent {}
