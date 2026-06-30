import { Component, inject } from '@angular/core';
import { DropdownComponent, DropdownItem } from '../../../../shared/ui/dropdown/dropdown.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-dropdowns-page',
  standalone: true,
  imports: [DropdownComponent],
  templateUrl: './dropdowns-page.component.html',
})
export class DropdownsPageComponent {
  private readonly toast = inject(ToastService);

  readonly simpleItems: DropdownItem[] = [
    { label: 'Editar', action: () => this.toast.show({ message: 'Ação: Editar', type: 'info' }) },
    { label: 'Duplicar', action: () => this.toast.show({ message: 'Ação: Duplicar', type: 'info' }) },
    { label: 'Excluir', action: () => this.toast.show({ message: 'Ação: Excluir', type: 'error' }) },
  ];

  readonly iconItems: DropdownItem[] = [
    { label: 'Editar', icon: 'ri-edit-line', action: () => this.toast.show({ message: 'Editando item', type: 'info' }) },
    { label: 'Duplicar', icon: 'ri-file-copy-line', action: () => this.toast.show({ message: 'Item duplicado', type: 'success' }) },
    { label: 'Arquivar', icon: 'ri-archive-line', action: () => this.toast.show({ message: 'Item arquivado', type: 'warning' }) },
    { label: 'Excluir', icon: 'ri-delete-bin-line', action: () => this.toast.show({ message: 'Item excluído', type: 'error' }) },
  ];

  readonly disabledItems: DropdownItem[] = [
    { label: 'Editar', icon: 'ri-edit-line', action: () => this.toast.show({ message: 'Editando', type: 'info' }) },
    { label: 'Publicar', icon: 'ri-send-plane-line', action: () => this.toast.show({ message: 'Publicado', type: 'success' }), disabled: true },
    { label: 'Excluir', icon: 'ri-delete-bin-line', action: () => this.toast.show({ message: 'Excluído', type: 'error' }), disabled: true },
  ];
}
