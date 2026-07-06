import { Component, inject, signal, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TableComponent } from '../../../../../shared/ui/table/table.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { HasFeatureDirective } from '../../../../../shared/directives/has-feature.directive';
import { ColumnDef, TableAction } from '../../../../../shared/models/column-def.model';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PortConfigService } from '../../../ports/services/port-config.service';
import { AreaService } from '../../services/area.service';
import { Area, AreaCoordinate } from '../../models/area.model';
import { AreaMethodChoiceDialogComponent, AreaCreationMethod } from './area-method-choice-dialog/area-method-choice-dialog.component';
import { AreaFormDialogComponent } from './area-form-dialog/area-form-dialog.component';
import { RetroactiveJobDialogComponent } from './retroactive-job-dialog/retroactive-job-dialog.component';
import { AreaMapViewComponent } from './area-map-view/area-map-view.component';
import {
  AreaDrawDestination,
  AreaDrawDestinationDialogComponent,
} from './area-draw-destination-dialog/area-draw-destination-dialog.component';
import { AreaSelectDialogComponent } from './area-select-dialog/area-select-dialog.component';

type AreaViewMode = 'table' | 'map';

@Component({
  selector: 'app-areas-config-page',
  standalone: true,
  imports: [TableComponent, ButtonComponent, BadgeComponent, HasFeatureDirective, AreaMapViewComponent],
  templateUrl: './areas-config-page.component.html',
})
export class AreasConfigPageComponent {
  private readonly areaService = inject(AreaService);
  private readonly portConfigService = inject(PortConfigService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly viewMode = signal<AreaViewMode>('table');
  readonly startDrawingRequestId = signal(0);

  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;

  get areas(): Area[] {
    return this.areaService.areas();
  }

  get rows(): Record<string, unknown>[] {
    return this.areaService.areas().map((area) => ({
      ...area,
      portName: this.resolvePortName(area.portId),
      coordinatesCount: area.coordinates.length,
    })) as unknown as Record<string, unknown>[];
  }

  get columns(): ColumnDef[] {
    return [
      { key: 'name', label: 'Área' },
      { key: 'portName', label: 'Porto' },
      { key: 'active', label: 'Status', template: this.statusTpl },
      { key: 'coordinatesCount', label: 'Qtd. coordenadas', align: 'right' },
    ];
  }

  get actions(): TableAction[] {
    return [
      {
        label: 'Atualizar',
        icon: 'ri-edit-line',
        variant: 'primary',
        visible: () => this.auth.hasFeature('CONFIGURACAO_AREA_EDITAR'),
        action: (row) => this.openManualFormDialog(row as unknown as Area),
      },
      {
        label: 'Ativar',
        icon: 'ri-checkbox-circle-line',
        variant: 'primary',
        visible: (row) =>
          this.auth.hasFeature('CONFIGURACAO_AREA_EDITAR') && !(row as unknown as Area).active,
        action: (row) => this.activateArea(row as unknown as Area),
      },
      {
        label: 'Job retroativo',
        icon: 'ri-history-line',
        variant: 'default',
        visible: () => this.auth.hasFeature('CONFIGURACAO_AREA_EDITAR'),
        action: (row) => this.openRetroactiveJobDialog(row as unknown as Area),
      },
    ];
  }

  onSearchChange(term: string): void {
    this.areaService.search(term);
  }

  setViewMode(mode: AreaViewMode): void {
    // Alternar de modo cancela um desenho em andamento (o componente do mapa é
    // destruído ao sair do modo Mapa) e evita que ele seja retomado sozinho ao voltar.
    if (mode !== this.viewMode()) {
      this.startDrawingRequestId.set(0);
    }
    this.viewMode.set(mode);
  }

  openCreateDialog(): void {
    const ref = this.dialog.open<AreaCreationMethod | undefined>(AreaMethodChoiceDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });

    ref.closed.subscribe((method) => {
      if (method === 'manual') {
        this.openManualFormDialog();
      } else if (method === 'draw') {
        this.setViewMode('map');
        this.startDrawingRequestId.update((id) => id + 1);
      }
    });
  }

  openManualFormDialog(area?: Area): void {
    this.dialog.open<boolean | undefined>(AreaFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: area ? { area } : {},
    });
  }

  onDrawFinished(coordinates: AreaCoordinate[]): void {
    const ref = this.dialog.open<AreaDrawDestination | undefined>(AreaDrawDestinationDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });

    ref.closed.subscribe((destination) => {
      if (destination === 'create') {
        this.dialog.open<boolean | undefined>(AreaFormDialogComponent, {
          viewContainerRef: this.viewContainerRef,
          data: { initialCoordinates: coordinates, hideCoordinatesEditor: true },
        });
      } else if (destination === 'update') {
        this.openDrawUpdateTargetSelection(coordinates);
      }
    });
  }

  private openDrawUpdateTargetSelection(coordinates: AreaCoordinate[]): void {
    const selectRef = this.dialog.open<Area | undefined>(AreaSelectDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { areas: this.areas, title: 'Selecione a área para atualizar o perímetro' },
    });

    selectRef.closed.subscribe((selected) => {
      if (!selected) return;

      this.areaService
        .update(selected.id, { name: selected.name, portId: selected.portId ?? null, coordinates })
        .subscribe({
          next: () =>
            this.toast.show({
              message: `Perímetro da área "${selected.name}" atualizado com sucesso.`,
              type: 'success',
            }),
          error: () => {}, // erro já é exibido pelo error.interceptor global
        });
    });
  }

  activateArea(area: Area): void {
    this.areaService.activate(area.id).subscribe({
      next: () => this.toast.show({ message: `Área "${area.name}" ativada com sucesso.`, type: 'success' }),
      error: () => {}, // erro já é exibido pelo error.interceptor global
    });
  }

  openRetroactiveJobDialog(area: Area): void {
    this.dialog.open<void>(RetroactiveJobDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { area },
    });
  }

  private resolvePortName(portId?: number | null): string {
    if (portId == null) return '—';
    return this.portConfigService.ports().find((port) => port.id === portId)?.name ?? '—';
  }
}
