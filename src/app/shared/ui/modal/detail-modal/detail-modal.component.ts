import { Component, inject, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { ButtonComponent } from '../../button/button.component';

export interface DetailModalData {
  title: string;
  template: TemplateRef<unknown>;
}

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, NgTemplateOutlet],
  template: `
    <app-modal-shell [title]="data.title" panelClass="max-w-2xl" (closed)="dialogRef.close()">
      <ng-container [ngTemplateOutlet]="data.template" />
      <ng-container modal-footer>
        <app-button variant="secondary" (clicked)="dialogRef.close()">Fechar</app-button>
      </ng-container>
    </app-modal-shell>
  `,
})
export class DetailModalComponent {
  readonly dialogRef = inject(DialogRef<void, DetailModalComponent>);
  readonly data = inject<DetailModalData>(DIALOG_DATA);
}
