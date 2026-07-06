import { Component, inject, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TableComponent } from '../../../../../shared/ui/table/table.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { ColumnDef, TableAction } from '../../../../../shared/models/column-def.model';
import { ConfirmDialogComponent } from '../../../../../shared/ui/modal/confirm-dialog/confirm-dialog.component';
import { HasFeatureDirective } from '../../../../../shared/directives/has-feature.directive';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { BerthConfigService } from '../../services/berth-config.service';
import { BerthConfig } from '../../models/berth-config.model';
import { BerthFormDialogComponent } from './berth-form-dialog/berth-form-dialog.component';

@Component({
  selector: 'app-berths-config-page',
  standalone: true,
  imports: [TableComponent, ButtonComponent, HasFeatureDirective],
  templateUrl: './berths-config-page.component.html',
})
export class BerthsConfigPageComponent {
  private readonly berthConfigService = inject(BerthConfigService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('berthTpl', { static: true }) berthTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;

  get rows(): Record<string, unknown>[] {
    return this.berthConfigService.berths().map((berth) => ({
      ...berth,
      terminalName: berth.terminal.name,
      areaName: berth.area?.name ?? '—',
    })) as unknown as Record<string, unknown>[];
  }

  get columns(): ColumnDef[] {
    return [
      { key: 'name', label: 'Berço', template: this.berthTpl },
      { key: 'terminalName', label: 'Terminal' },
      { key: 'areaName', label: 'Área' },
      { key: 'length', label: 'Comprimento (m)', align: 'right' },
      { key: 'draft', label: 'Calado (m)', align: 'right' },
    ];
  }

  get actions(): TableAction[] {
    return [
      {
        label: 'Editar',
        icon: 'ri-edit-line',
        variant: 'primary',
        visible: () => this.auth.hasFeature('CONFIGURACAO_BERCO_EDITAR'),
        action: (row) => this.openEditDialog(row as unknown as BerthConfig),
      },
      {
        label: 'Excluir',
        icon: 'ri-delete-bin-line',
        variant: 'danger',
        visible: () => this.auth.hasFeature('CONFIGURACAO_BERCO_EXCLUIR'),
        action: (row) => this.openDeleteConfirm(row as unknown as BerthConfig),
      },
    ];
  }

  onSearchChange(term: string): void {
    this.berthConfigService.search(term);
  }

  openCreateDialog(): void {
    this.dialog.open<boolean | undefined>(BerthFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {},
    });
  }

  openEditDialog(berth: BerthConfig): void {
    this.dialog.open<boolean | undefined>(BerthFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { berth },
    });
  }

  openDeleteConfirm(berth: BerthConfig): void {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {
        title: 'Excluir berço',
        message: `Tem certeza que deseja excluir o berço "${berth.name}"? Essa ação não pode ser desfeita.`,
        confirmLabel: 'Excluir',
        variant: 'danger',
      },
    });

    ref.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      this.berthConfigService.delete(berth.id).subscribe({
        next: () => this.toast.show({ message: `Berço "${berth.name}" excluído com sucesso.`, type: 'success' }),
        error: () => {}, // erro já é exibido pelo error.interceptor global
      });
    });
  }
}
