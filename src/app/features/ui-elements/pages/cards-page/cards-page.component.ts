import { Component } from '@angular/core';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardComponent, ButtonComponent, BadgeComponent],
  templateUrl: './cards-page.component.html',
})
export class CardsPageComponent {}
