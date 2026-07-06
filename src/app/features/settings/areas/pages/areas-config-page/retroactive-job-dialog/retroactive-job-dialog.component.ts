import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { AreaService } from '../../../services/area.service';
import { Area, RetroactiveJob, RetroactiveJobMode } from '../../../models/area.model';

export interface RetroactiveJobDialogData {
  area: Area;
}

@Component({
  selector: 'app-retroactive-job-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './retroactive-job-dialog.component.html',
})
export class RetroactiveJobDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly areaService = inject(AreaService);
  private readonly toast = inject(ToastService);
  readonly dialogRef = inject(DialogRef<void, RetroactiveJobDialogComponent>);
  readonly data = inject<RetroactiveJobDialogData>(DIALOG_DATA);

  readonly loadingJob = signal(true);
  readonly job = signal<RetroactiveJob | null>(null);
  readonly triggering = signal(false);
  readonly cancelling = signal(false);

  readonly triggerForm = this.fb.group({
    mode: ['FULL' as RetroactiveJobMode],
    periodDays: [null as number | null],
  });

  get modeControl() {
    return this.triggerForm.get('mode')!;
  }

  get periodDaysControl() {
    return this.triggerForm.get('periodDays')!;
  }

  get isRunning(): boolean {
    return this.job()?.status === 'RUNNING';
  }

  get canTrigger(): boolean {
    if (this.triggering() || this.data.area.active) return false;
    if (this.modeControl.value === 'FULL') {
      const periodDays = this.periodDaysControl.value;
      return periodDays != null && periodDays > 0;
    }
    return true;
  }

  constructor() {
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.loadingJob.set(true);
    this.areaService.getLastRetroactiveJob(this.data.area.id).subscribe({
      next: (job) => {
        this.job.set(job);
        this.loadingJob.set(false);
      },
      error: () => {
        this.loadingJob.set(false); // erro já é exibido pelo error.interceptor global
      },
    });
  }

  setMode(mode: RetroactiveJobMode): void {
    this.modeControl.setValue(mode);
  }

  trigger(): void {
    if (!this.canTrigger) return;

    const mode = this.modeControl.value as RetroactiveJobMode;
    this.triggering.set(true);

    this.areaService
      .triggerRetroactiveJob(
        this.data.area.id,
        mode === 'FULL' ? { periodDays: this.periodDaysControl.value! } : { catchUp: true },
      )
      .subscribe({
        next: () => {
          this.triggering.set(false);
          this.toast.show({ message: 'Job de reprocessamento disparado com sucesso.', type: 'success' });
          this.refreshStatus();
        },
        error: () => {
          this.triggering.set(false); // erro já é exibido pelo error.interceptor global
        },
      });
  }

  cancelJob(): void {
    if (this.cancelling()) return;
    this.cancelling.set(true);

    this.areaService.cancelRetroactiveJob(this.data.area.id).subscribe({
      next: () => {
        this.cancelling.set(false);
        this.toast.show({ message: 'Job cancelado com sucesso.', type: 'success' });
        this.refreshStatus();
      },
      error: () => {
        this.cancelling.set(false); // erro já é exibido pelo error.interceptor global
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
