import { Component, inject, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TableComponent } from '../../../../../shared/ui/table/table.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { ColumnDef, TableAction } from '../../../../../shared/models/column-def.model';
import { ConfirmDialogComponent } from '../../../../../shared/ui/modal/confirm-dialog/confirm-dialog.component';
import { HasFeatureDirective } from '../../../../../shared/directives/has-feature.directive';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PortConfigService } from '../../services/port-config.service';
import { PortConfig } from '../../models/port-config.model';
import { PortFormDialogComponent } from './port-form-dialog/port-form-dialog.component';

@Component({
  selector: 'app-ports-config-page',
  standalone: true,
  imports: [TableComponent, ButtonComponent, HasFeatureDirective],
  templateUrl: './ports-config-page.component.html',
})
export class PortsConfigPageComponent {
  private readonly portConfigService = inject(PortConfigService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('portTpl', { static: true }) portTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;
  @ViewChild('countryTpl', { static: true }) countryTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;

  get rows(): Record<string, unknown>[] {
    return this.portConfigService.ports() as unknown as Record<string, unknown>[];
  }

  get columns(): ColumnDef[] {
    return [
      { key: 'name', label: 'Porto', template: this.portTpl },
      { key: 'country', label: 'País', template: this.countryTpl },
      { key: 'latitude', label: 'Latitude', align: 'right' },
      { key: 'longitude', label: 'Longitude', align: 'right' },
    ];
  }

  get actions(): TableAction[] {
    return [
      {
        label: 'Editar',
        icon: 'ri-edit-line',
        variant: 'primary',
        visible: () => this.auth.hasFeature('CONFIGURACAO_PORTO_EDITAR'),
        action: (row) => this.openEditDialog(row as unknown as PortConfig),
      },
      {
        label: 'Excluir',
        icon: 'ri-delete-bin-line',
        variant: 'danger',
        visible: () => this.auth.hasFeature('CONFIGURACAO_PORTO_EXCLUIR'),
        action: (row) => this.openDeleteConfirm(row as unknown as PortConfig),
      },
    ];
  }

  onSearchChange(term: string): void {
    this.portConfigService.search(term);
  }

  openCreateDialog(): void {
    this.dialog.open<boolean | undefined>(PortFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {},
    });
  }

  openEditDialog(port: PortConfig): void {
    this.dialog.open<boolean | undefined>(PortFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { port },
    });
  }

  openDeleteConfirm(port: PortConfig): void {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {
        title: 'Excluir porto',
        message: `Tem certeza que deseja excluir o porto "${port.name}"? Essa ação não pode ser desfeita.`,
        confirmLabel: 'Excluir',
        variant: 'danger',
      },
    });

    ref.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      this.portConfigService.delete(port.id).subscribe({
        next: () => this.toast.show({ message: `Porto "${port.name}" excluído com sucesso.`, type: 'success' }),
        error: () => {}, // erro já é exibido pelo error.interceptor global
      });
    });
  }
}
