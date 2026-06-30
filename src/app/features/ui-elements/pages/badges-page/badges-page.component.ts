import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-badges-page',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './badges-page.component.html',
})
export class BadgesPageComponent {}
