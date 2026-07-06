import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

export type AreaDrawDestination = 'create' | 'update';

@Component({
  selector: 'app-area-draw-destination-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent],
  templateUrl: './area-draw-destination-dialog.component.html',
})
export class AreaDrawDestinationDialogComponent {
  readonly dialogRef = inject(DialogRef<AreaDrawDestination | undefined, AreaDrawDestinationDialogComponent>);

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  chooseCreate(): void {
    this.dialogRef.close('create');
  }

  chooseUpdate(): void {
    this.dialogRef.close('update');
  }
}
