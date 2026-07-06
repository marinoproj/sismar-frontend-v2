import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { PortConfigService } from '../../../../ports/services/port-config.service';
import { TERMINAL_CONFIG_REPOSITORY } from '../../../../terminals/repositories/terminal-config.repository';
import { TerminalConfig } from '../../../../terminals/models/terminal-config.model';
import { AreaService } from '../../../../areas/services/area.service';
import { Area } from '../../../../areas/models/area.model';
import { BerthConfigService } from '../../../services/berth-config.service';
import { BerthConfig, BerthConfigInput } from '../../../models/berth-config.model';

export interface BerthFormDialogData {
  berth?: BerthConfig;
}

@Component({
  selector: 'app-berth-form-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './berth-form-dialog.component.html',
})
export class BerthFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly portConfigService = inject(PortConfigService);
  private readonly terminalConfigRepo = inject(TERMINAL_CONFIG_REPOSITORY);
  private readonly areaService = inject(AreaService);
  private readonly berthConfigService = inject(BerthConfigService);
  private readonly toast = inject(ToastService);
  readonly dialogRef = inject(DialogRef<boolean | undefined, BerthFormDialogComponent>);
  readonly data = inject<BerthFormDialogData>(DIALOG_DATA);

  readonly isEdit = !!this.data?.berth;
  readonly saving = signal(false);

  get ports() {
    return this.portConfigService.ports();
  }

  private readonly selectedPortId$ = new BehaviorSubject<number | null>(this.resolveInitialPortId());

  readonly terminalOptions = toSignal(
    this.selectedPortId$.pipe(
      switchMap((portId) => (portId != null ? this.terminalConfigRepo.getAll({ portId }) : of([]))),
    ),
    { initialValue: [] as TerminalConfig[] },
  );

  get areaOptions(): Area[] {
    const portId = this.form.get('portId')!.value;
    return this.areaService.areas().filter((area) => area.portId == null || area.portId === portId);
  }

  readonly form = this.fb.group({
    portId: [this.resolveInitialPortId(), Validators.required],
    terminalId: [this.data?.berth?.terminal?.id ?? null, Validators.required],
    areaId: [this.data?.berth?.area?.id ?? null],
    name: [this.data?.berth?.name ?? '', Validators.required],
    length: [this.data?.berth?.length ?? null],
    draft: [this.data?.berth?.draft ?? null],
  });

  constructor() {
    this.form.get('portId')!.valueChanges.subscribe((portId) => {
      this.selectedPortId$.next(portId);
      this.form.patchValue({ terminalId: null, areaId: null }, { emitEvent: false });
    });
  }

  get portIdControl() {
    return this.form.get('portId')!;
  }

  get terminalIdControl() {
    return this.form.get('terminalId')!;
  }

  get nameControl() {
    return this.form.get('name')!;
  }

  save(): void {
    if (this.form.invalid || this.saving()) return;

    const value = this.form.getRawValue();
    const input: BerthConfigInput = {
      name: value.name!,
      terminalId: value.terminalId!,
      areaId: value.areaId ?? null,
      length: value.length ?? null,
      draft: value.draft ?? null,
    };
    this.saving.set(true);

    const request$ = this.isEdit
      ? this.berthConfigService.update(this.data.berth!.id, input)
      : this.berthConfigService.create(input);

    request$.subscribe({
      next: () => {
        this.toast.show({
          message: `Berço "${input.name}" ${this.isEdit ? 'atualizado' : 'cadastrado'} com sucesso.`,
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

  private resolveInitialPortId(): number | null {
    return this.data?.berth?.terminal?.port?.id ?? null;
  }
}
