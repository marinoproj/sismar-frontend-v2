import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { PortConfigService } from '../../../services/port-config.service';
import { PortConfig, PortConfigInput } from '../../../models/port-config.model';
import { PortAreaConfigService } from '../../../services/port-area-config.service';
import { AreaService } from '../../../../areas/services/area.service';
import { Area } from '../../../../areas/models/area.model';

export interface PortFormDialogData {
  port?: PortConfig;
}

@Component({
  selector: 'app-port-form-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './port-form-dialog.component.html',
})
export class PortFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portConfigService = inject(PortConfigService);
  private readonly portAreaConfigService = inject(PortAreaConfigService);
  private readonly areaService = inject(AreaService);
  private readonly toast = inject(ToastService);
  readonly dialogRef = inject(DialogRef<boolean | undefined, PortFormDialogComponent>);
  readonly data = inject<PortFormDialogData>(DIALOG_DATA);

  private static readonly ANCHORAGE_PAGE_SIZE = 5;

  readonly isEdit = !!this.data?.port;
  readonly saving = signal(false);

  readonly activeTab = signal<'dados' | 'areas'>('dados');

  readonly areaConfigLoading = signal(false);
  readonly areaConfigSaving = signal(false);
  readonly selectedAnchorageIds = signal<Set<number>>(new Set());
  readonly accessChannelControl = new FormControl<number | null>(null);
  readonly portAreaControl = new FormControl<number | null>(null);

  readonly anchorageSearchTerm = signal('');
  readonly anchoragePage = signal(1);

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

  get portAreas(): Area[] {
    if (!this.isEdit) return [];
    return this.areaService.areas().filter((area) => area.portId === this.data.port!.id);
  }

  get channelOptions(): Area[] {
    return this.portAreas.filter(
      (area) => !this.selectedAnchorageIds().has(area.id) && area.id !== this.portAreaControl.value,
    );
  }

  get portAreaOptions(): Area[] {
    return this.portAreas.filter(
      (area) => !this.selectedAnchorageIds().has(area.id) && area.id !== this.accessChannelControl.value,
    );
  }

  get filteredAnchorageAreas(): Area[] {
    const term = this.anchorageSearchTerm().trim().toLowerCase();
    if (!term) return this.portAreas;
    return this.portAreas.filter((area) => area.name.toLowerCase().includes(term));
  }

  get anchorageTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAnchorageAreas.length / PortFormDialogComponent.ANCHORAGE_PAGE_SIZE));
  }

  get pagedAnchorageAreas(): Area[] {
    const start = (this.anchoragePage() - 1) * PortFormDialogComponent.ANCHORAGE_PAGE_SIZE;
    return this.filteredAnchorageAreas.slice(start, start + PortFormDialogComponent.ANCHORAGE_PAGE_SIZE);
  }

  ngOnInit(): void {
    if (!this.isEdit) return;

    this.areaConfigLoading.set(true);
    this.portAreaConfigService.get(this.data.port!.id).subscribe({
      next: (config) => {
        this.selectedAnchorageIds.set(new Set(config.anchorageAreas.map((area) => area.id)));
        this.accessChannelControl.setValue(config.accessChannelArea?.id ?? null);
        this.portAreaControl.setValue(config.portArea?.id ?? null);
        this.areaConfigLoading.set(false);
      },
      error: () => this.areaConfigLoading.set(false), // erro já é exibido pelo error.interceptor global
    });
  }

  isAnchorage(id: number): boolean {
    return this.selectedAnchorageIds().has(id);
  }

  isAnchorageDisabled(id: number): boolean {
    return id === this.accessChannelControl.value || id === this.portAreaControl.value;
  }

  toggleAnchorage(id: number): void {
    const next = new Set(this.selectedAnchorageIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selectedAnchorageIds.set(next);
  }

  onAnchorageSearchChange(term: string): void {
    this.anchorageSearchTerm.set(term);
    this.anchoragePage.set(1);
  }

  goToAnchoragePage(page: number): void {
    if (page < 1 || page > this.anchorageTotalPages) return;
    this.anchoragePage.set(page);
  }

  submitActiveTab(): void {
    if (this.activeTab() === 'dados') {
      this.save();
    } else {
      this.saveAreaConfig();
    }
  }

  saveAreaConfig(): void {
    if (!this.isEdit || this.areaConfigSaving()) return;

    this.areaConfigSaving.set(true);
    this.portAreaConfigService
      .update(this.data.port!.id, {
        anchorageAreaIds: Array.from(this.selectedAnchorageIds()),
        accessChannelAreaId: this.accessChannelControl.value,
        portAreaId: this.portAreaControl.value,
      })
      .subscribe({
        next: () => {
          this.areaConfigSaving.set(false);
          this.toast.show({ message: 'Configuração de áreas do porto salva com sucesso.', type: 'success' });
        },
        error: () => this.areaConfigSaving.set(false), // erro já é exibido pelo error.interceptor global
      });
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
