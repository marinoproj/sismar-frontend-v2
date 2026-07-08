import { Component, inject, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TableComponent } from '../../../../../shared/ui/table/table.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { ColumnDef, TableAction } from '../../../../../shared/models/column-def.model';
import { ConfirmDialogComponent } from '../../../../../shared/ui/modal/confirm-dialog/confirm-dialog.component';
import { HasFeatureDirective } from '../../../../../shared/directives/has-feature.directive';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { TerminalConfigService } from '../../services/terminal-config.service';
import { PortConfigService } from '../../../ports/services/port-config.service';
import { TerminalConfig } from '../../models/terminal-config.model';
import { TerminalFormDialogComponent } from './terminal-form-dialog/terminal-form-dialog.component';

@Component({
  selector: 'app-terminals-config-page',
  standalone: true,
  imports: [TableComponent, ButtonComponent, HasFeatureDirective],
  templateUrl: './terminals-config-page.component.html',
})
export class TerminalsConfigPageComponent {
  private readonly terminalConfigService = inject(TerminalConfigService);
  private readonly portConfigService = inject(PortConfigService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('terminalTpl', { static: true }) terminalTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;

  get ports() {
    return this.portConfigService.ports();
  }

  get rows(): Record<string, unknown>[] {
    return this.terminalConfigService.terminals().map((terminal) => ({
      ...terminal,
      portName: terminal.port.name,
    })) as unknown as Record<string, unknown>[];
  }

  get loading(): boolean {
    return this.terminalConfigService.loading();
  }

  get columns(): ColumnDef[] {
    return [
      { key: 'name', label: 'Terminal', template: this.terminalTpl },
      { key: 'code', label: 'Código' },
      { key: 'terminalType', label: 'Tipo' },
      { key: 'portName', label: 'Porto' },
    ];
  }

  get actions(): TableAction[] {
    return [
      {
        label: 'Editar',
        icon: 'ri-edit-line',
        variant: 'primary',
        visible: () => this.auth.hasFeature('CONFIGURACAO_TERMINAL_EDITAR'),
        action: (row) => this.openEditDialog(row as unknown as TerminalConfig),
      },
      {
        label: 'Excluir',
        icon: 'ri-delete-bin-line',
        variant: 'danger',
        visible: () => this.auth.hasFeature('CONFIGURACAO_TERMINAL_EXCLUIR'),
        action: (row) => this.openDeleteConfirm(row as unknown as TerminalConfig),
      },
    ];
  }

  onSearchChange(term: string): void {
    this.terminalConfigService.search(term);
  }

  onPortFilterChange(value: string): void {
    this.terminalConfigService.filterByPort(value ? Number(value) : null);
  }

  openCreateDialog(): void {
    this.dialog.open<boolean | undefined>(TerminalFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {},
    });
  }

  openEditDialog(terminal: TerminalConfig): void {
    this.dialog.open<boolean | undefined>(TerminalFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { terminal },
    });
  }

  openDeleteConfirm(terminal: TerminalConfig): void {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {
        title: 'Excluir terminal',
        message: `Tem certeza que deseja excluir o terminal "${terminal.name}"? Essa ação não pode ser desfeita.`,
        confirmLabel: 'Excluir',
        variant: 'danger',
      },
    });

    ref.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      this.terminalConfigService.delete(terminal.id).subscribe({
        next: () => this.toast.show({ message: `Terminal "${terminal.name}" excluído com sucesso.`, type: 'success' }),
        error: () => {}, // erro já é exibido pelo error.interceptor global
      });
    });
  }
}
