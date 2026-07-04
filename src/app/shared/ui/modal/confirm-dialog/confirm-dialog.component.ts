import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../modal-shell/modal-shell.component';
import { ButtonComponent } from '../../button/button.component';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent],
  template: `
    <app-modal-shell [title]="data.title" (closed)="dialogRef.close(false)">
      <p class="text-sm text-gray-600 dark:text-gray-300">{{ data.message }}</p>
      <ng-container modal-footer>
        <app-button variant="ghost" (clicked)="dialogRef.close(false)">
          {{ data.cancelLabel ?? 'Cancelar' }}
        </app-button>
        <app-button
          [variant]="data.variant === 'danger' ? 'danger' : 'primary'"
          (clicked)="dialogRef.close(true)"
        >
          {{ data.confirmLabel ?? 'Confirmar' }}
        </app-button>
      </ng-container>
    </app-modal-shell>
  `,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(DialogRef<boolean, ConfirmDialogComponent>);
  readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
}
