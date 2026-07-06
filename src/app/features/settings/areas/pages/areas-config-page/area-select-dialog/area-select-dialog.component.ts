import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { Area } from '../../../models/area.model';

export interface AreaSelectDialogData {
  areas: Area[];
  title: string;
}

@Component({
  selector: 'app-area-select-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './area-select-dialog.component.html',
})
export class AreaSelectDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(DialogRef<Area | undefined, AreaSelectDialogComponent>);
  readonly data = inject<AreaSelectDialogData>(DIALOG_DATA);

  readonly control = this.fb.control<number | null>(null);

  get areas(): Area[] {
    return this.data.areas;
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  confirm(): void {
    const id = this.control.value;
    if (id == null) return;
    const area = this.areas.find((a) => a.id === id);
    this.dialogRef.close(area);
  }
}
