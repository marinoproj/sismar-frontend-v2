import { Component, inject, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { KpiCardComponent } from '../../../../shared/ui/kpi-card/kpi-card.component';
import { TableComponent } from '../../../../shared/ui/table/table.component';
import { ColumnDef } from '../../../../shared/models/column-def.model';
import { ConfirmDialogComponent } from '../../../../shared/ui/modal/confirm-dialog/confirm-dialog.component';
import { DetailModalComponent } from '../../../../shared/ui/modal/detail-modal/detail-modal.component';
import { CustomerFormDialogComponent, CustomerFormValue } from './customer-form-dialog/customer-form-dialog.component';
import { ToastService } from '../../../../core/services/toast.service';

interface OrderItem {
  produto: string;
  quantidade: number;
  valorUnitario: string;
  subtotal: string;
}

const ORDER_ITEMS: OrderItem[] = [
  { produto: 'Teclado mecânico', quantidade: 2, valorUnitario: 'R$ 450,00', subtotal: 'R$ 900,00' },
  { produto: 'Mouse sem fio', quantidade: 1, valorUnitario: 'R$ 180,00', subtotal: 'R$ 180,00' },
  { produto: 'Monitor 27"', quantidade: 1, valorUnitario: 'R$ 1.100,00', subtotal: 'R$ 1.100,00' },
];

@Component({
  selector: 'app-modals-page',
  standalone: true,
  imports: [ButtonComponent, KpiCardComponent, TableComponent],
  templateUrl: './modals-page.component.html',
})
export class ModalsPageComponent {
  private readonly dialog = inject(Dialog);
  private readonly toast = inject(ToastService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('orderDetailTpl', { static: true }) orderDetailTpl!: TemplateRef<unknown>;

  readonly orderItems = ORDER_ITEMS as unknown as Record<string, unknown>[];

  readonly orderItemsColumns: ColumnDef[] = [
    { key: 'produto', label: 'Produto' },
    { key: 'quantidade', label: 'Qtd.', align: 'center', width: '80px' },
    { key: 'valorUnitario', label: 'Valor unit.', align: 'right' },
    { key: 'subtotal', label: 'Subtotal', align: 'right' },
  ];

  openDeleteConfirm(): void {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {
        title: 'Excluir pedido',
        message: 'Tem certeza que deseja excluir o pedido #1005? Essa ação não pode ser desfeita.',
        confirmLabel: 'Excluir',
        variant: 'danger',
      },
    });

    ref.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.toast.show({ message: 'Pedido excluído com sucesso.', type: 'success' });
      }
    });
  }

  openActionConfirm(): void {
    const ref = this.dialog.open<boolean>(ConfirmDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: {
        title: 'Enviar pedido',
        message: 'Confirma o envio do pedido #1005 para o cliente?',
        confirmLabel: 'Enviar',
        variant: 'primary',
      },
    });

    ref.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.toast.show({ message: 'Pedido enviado com sucesso.', type: 'success' });
      }
    });
  }

  openDetail(): void {
    this.dialog.open<void>(DetailModalComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { title: 'Detalhes do pedido #1005', template: this.orderDetailTpl },
    });
  }

  openCustomerForm(): void {
    const ref = this.dialog.open<CustomerFormValue | undefined>(CustomerFormDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });

    ref.closed.subscribe((value) => {
      if (value) {
        this.toast.show({ message: `Cliente "${value.nome}" cadastrado com sucesso.`, type: 'success' });
      }
    });
  }
}
