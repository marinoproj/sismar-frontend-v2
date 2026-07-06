import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { PortConfigService } from '../../../services/port-config.service';
import { PortConfig, PortConfigInput } from '../../../models/port-config.model';

export interface PortFormDialogData {
  port?: PortConfig;
}

@Component({
  selector: 'app-port-form-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './port-form-dialog.component.html',
})
export class PortFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly portConfigService = inject(PortConfigService);
  private readonly toast = inject(ToastService);
  readonly dialogRef = inject(DialogRef<boolean | undefined, PortFormDialogComponent>);
  readonly data = inject<PortFormDialogData>(DIALOG_DATA);

  readonly isEdit = !!this.data?.port;
  readonly saving = signal(false);

  readonly form = this.fb.group({
    name: [this.data?.port?.name ?? '', Validators.required],
    country: [this.data?.port?.country ?? '', Validators.required],
    imagePort: [this.data?.port?.imagePort ?? '', Validators.required],
    countryFlag: [this.data?.port?.countryFlag ?? '', Validators.required],
    latitude: [this.data?.port?.latitude ?? null],
    longitude: [this.data?.port?.longitude ?? null],
  });

  get nameControl() {
    return this.form.get('name')!;
  }

  get countryControl() {
    return this.form.get('country')!;
  }

  get imagePortControl() {
    return this.form.get('imagePort')!;
  }

  get countryFlagControl() {
    return this.form.get('countryFlag')!;
  }

  save(): void {
    if (this.form.invalid || this.saving()) return;

    const input = this.form.getRawValue() as PortConfigInput;
    this.saving.set(true);

    const request$ = this.isEdit
      ? this.portConfigService.update(this.data.port!.id, input)
      : this.portConfigService.create(input);

    request$.subscribe({
      next: () => {
        this.toast.show({
          message: `Porto "${input.name}" ${this.isEdit ? 'atualizado' : 'cadastrado'} com sucesso.`,
          type: 'success',
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false); // erro já é exibido pelo error.interceptor global
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
