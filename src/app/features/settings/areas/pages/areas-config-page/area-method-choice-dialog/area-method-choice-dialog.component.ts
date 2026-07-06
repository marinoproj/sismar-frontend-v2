import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

export type AreaCreationMethod = 'manual' | 'draw';

@Component({
  selector: 'app-area-method-choice-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent],
  templateUrl: './area-method-choice-dialog.component.html',
})
export class AreaMethodChoiceDialogComponent {
  readonly dialogRef = inject(DialogRef<AreaCreationMethod | undefined, AreaMethodChoiceDialogComponent>);

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  chooseManual(): void {
    this.dialogRef.close('manual');
  }

  chooseDraw(): void {
    this.dialogRef.close('draw');
  }
}
