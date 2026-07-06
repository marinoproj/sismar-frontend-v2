import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ToastService } from '../../../../../../core/services/toast.service';
import { PortConfigService } from '../../../../ports/services/port-config.service';
import { AreaService } from '../../../services/area.service';
import { Area, AreaCoordinate, AreaInput } from '../../../models/area.model';

export interface AreaFormDialogData {
  area?: Area;
  /** Coordenadas pré-preenchidas (ex.: vindas do desenho no mapa); com ou sem a duplicata de fechamento, tanto faz. */
  initialCoordinates?: AreaCoordinate[];
  /** Oculta a lista editável de coordenadas (usado quando elas já vêm prontas de um desenho no mapa). */
  hideCoordinatesEditor?: boolean;
}

interface CoordinateFormValue {
  lat: number | null;
  lon: number | null;
}

const MIN_UNIQUE_COORDINATES = 3;

@Component({
  selector: 'app-area-form-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './area-form-dialog.component.html',
})
export class AreaFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly areaService = inject(AreaService);
  private readonly portConfigService = inject(PortConfigService);
  private readonly toast = inject(ToastService);
  readonly dialogRef = inject(DialogRef<boolean | undefined, AreaFormDialogComponent>);
  readonly data = inject<AreaFormDialogData>(DIALOG_DATA);

  readonly isEdit = !!this.data?.area;
  readonly saving = signal(false);

  get ports() {
    return this.portConfigService.ports();
  }

  readonly form = this.fb.group({
    name: [this.data?.area?.name ?? '', Validators.required],
    portId: [this.data?.area?.portId ?? null],
    coordinates: this.fb.array(this.buildInitialCoordinateGroups()),
  });

  get nameControl() {
    return this.form.get('name')!;
  }

  get coordinatesArray(): FormArray {
    return this.form.get('coordinates') as FormArray;
  }

  get coordinateGroups(): FormGroup[] {
    return this.coordinatesArray.controls as FormGroup[];
  }

  get uniqueValidCoordinatesCount(): number {
    const coords = this.coordinatesArray.getRawValue() as CoordinateFormValue[];
    const valid = coords.filter((c) => this.isValidLat(c.lat) && this.isValidLon(c.lon));
    return new Set(valid.map((c) => `${c.lat}:${c.lon}`)).size;
  }

  get hasMinimumCoordinates(): boolean {
    return this.uniqueValidCoordinatesCount >= MIN_UNIQUE_COORDINATES;
  }

  get canSave(): boolean {
    return this.nameControl.valid && this.coordinatesArray.valid && this.hasMinimumCoordinates && !this.saving();
  }

  addCoordinate(): void {
    this.coordinatesArray.push(this.createCoordinateGroup());
  }

  removeCoordinate(index: number): void {
    if (this.coordinatesArray.length <= 1) return;
    this.coordinatesArray.removeAt(index);
  }

  moveCoordinateUp(index: number): void {
    if (index === 0) return;
    this.swapCoordinates(index, index - 1);
  }

  moveCoordinateDown(index: number): void {
    if (index === this.coordinatesArray.length - 1) return;
    this.swapCoordinates(index, index + 1);
  }

  save(): void {
    if (!this.canSave) return;

    const value = this.form.getRawValue();
    const uniqueCoordinates = (value.coordinates as CoordinateFormValue[]).map((c) => ({
      lat: c.lat as number,
      lon: c.lon as number,
    }));
    const closedCoordinates: AreaCoordinate[] = [...uniqueCoordinates, uniqueCoordinates[0]];

    const input: AreaInput = {
      name: value.name!,
      portId: value.portId ?? null,
      coordinates: closedCoordinates,
    };
    this.saving.set(true);

    const request$ = this.isEdit
      ? this.areaService.update(this.data.area!.id, input)
      : this.areaService.create(input);

    request$.subscribe({
      next: () => {
        this.toast.show({
          message: `Área "${input.name}" ${this.isEdit ? 'atualizada' : 'cadastrada'} com sucesso.`,
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

  private swapCoordinates(a: number, b: number): void {
    const controls = this.coordinatesArray.controls;
    [controls[a], controls[b]] = [controls[b], controls[a]];
    this.coordinatesArray.updateValueAndValidity();
  }

  private buildInitialCoordinateGroups(): FormGroup[] {
    const raw = this.data?.area?.coordinates ?? this.data?.initialCoordinates ?? [];
    const source = this.stripClosingDuplicate(raw);
    const rows: Partial<AreaCoordinate>[] = source.length > 0 ? source : [{}, {}, {}];
    return rows.map((coord) => this.createCoordinateGroup(coord));
  }

  private createCoordinateGroup(coord?: Partial<AreaCoordinate>): FormGroup {
    return this.fb.group({
      lat: [coord?.lat ?? null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      lon: [coord?.lon ?? null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    });
  }

  private stripClosingDuplicate(coordinates: AreaCoordinate[]): AreaCoordinate[] {
    if (coordinates.length > 1) {
      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      if (first.lat === last.lat && first.lon === last.lon) {
        return coordinates.slice(0, -1);
      }
    }
    return coordinates;
  }

  private isValidLat(value: number | null): value is number {
    return value !== null && !Number.isNaN(value) && value >= -90 && value <= 90;
  }

  private isValidLon(value: number | null): value is number {
    return value !== null && !Number.isNaN(value) && value >= -180 && value <= 180;
  }
}
