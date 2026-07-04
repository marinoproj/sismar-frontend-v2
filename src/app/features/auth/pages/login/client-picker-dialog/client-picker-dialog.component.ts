import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { ClientDTO } from '../../../../../core/auth/session.model';

export interface ClientPickerDialogData {
  clients: ClientDTO[];
}

@Component({
  selector: 'app-client-picker-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent],
  template: `
    <app-modal-shell title="Selecione o cliente" (closed)="dialogRef.close(undefined)">
      <ul class="space-y-2">
        @for (client of data.clients; track client.id) {
          <li>
            <button
              type="button"
              (click)="dialogRef.close(client.code)"
              class="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              <span class="block text-sm font-medium text-gray-900 dark:text-white">{{ client.name }}</span>
              <span class="block text-xs text-gray-500 dark:text-gray-400">{{ client.code }}</span>
            </button>
          </li>
        }
      </ul>
      <ng-container modal-footer>
        <app-button variant="ghost" (clicked)="dialogRef.close(undefined)">Cancelar</app-button>
      </ng-container>
    </app-modal-shell>
  `,
})
export class ClientPickerDialogComponent {
  readonly dialogRef = inject(DialogRef<string | undefined, ClientPickerDialogComponent>);
  readonly data = inject<ClientPickerDialogData>(DIALOG_DATA);
}
