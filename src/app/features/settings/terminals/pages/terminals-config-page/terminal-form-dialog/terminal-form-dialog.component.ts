import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { PortConfigService } from '../../../../ports/services/port-config.service';
import { TerminalConfigService } from '../../../services/terminal-config.service';
import { TerminalConfig, TerminalConfigInput } from '../../../models/terminal-config.model';

export interface TerminalFormDialogData {
  terminal?: TerminalConfig;
}

@Component({
  selector: 'app-terminal-form-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './terminal-form-dialog.component.html',
})
export class TerminalFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly portConfigService = inject(PortConfigService);
  private readonly terminalConfigService = inject(TerminalConfigService);
  private readonly toast = inject(ToastService);
  readonly dialogRef = inject(DialogRef<boolean | undefined, TerminalFormDialogComponent>);
  readonly data = inject<TerminalFormDialogData>(DIALOG_DATA);

  readonly isEdit = !!this.data?.terminal;
  readonly saving = signal(false);

  get ports() {
    return this.portConfigService.ports();
  }

  readonly form = this.fb.group({
    name: [this.data?.terminal?.name ?? '', Validators.required],
    code: [this.data?.terminal?.code ?? '', Validators.required],
    terminalType: [this.data?.terminal?.terminalType ?? '', Validators.required],
    portId: [this.data?.terminal?.port?.id ?? null, Validators.required],
    imageTerminal: [this.data?.terminal?.imageTerminal ?? ''],
    latitude: [this.data?.terminal?.latitude ?? null],
    longitude: [this.data?.terminal?.longitude ?? null],
  });

  get nameControl() {
    return this.form.get('name')!;
  }

  get codeControl() {
    return this.form.get('code')!;
  }

  get terminalTypeControl() {
    return this.form.get('terminalType')!;
  }

  get portIdControl() {
    return this.form.get('portId')!;
  }

  save(): void {
    if (this.form.invalid || this.saving()) return;

    const input = this.form.getRawValue() as TerminalConfigInput;
    this.saving.set(true);

    const request$ = this.isEdit
      ? this.terminalConfigService.update(this.data.terminal!.id, input)
      : this.terminalConfigService.create(input);

    request$.subscribe({
      next: () => {
        this.toast.show({
          message: `Terminal "${input.name}" ${this.isEdit ? 'atualizado' : 'cadastrado'} com sucesso.`,
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
