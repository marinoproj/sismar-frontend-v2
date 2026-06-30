import { Component, inject } from '@angular/core';
import { ToastService } from '../../../../core/services/toast.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-toasts-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './toasts-page.component.html',
})
export class ToastsPageComponent {
  readonly toastService = inject(ToastService);

  showSuccess(): void {
    this.toastService.show({ message: 'Usuário cadastrado com sucesso!', type: 'success' });
  }

  showError(): void {
    this.toastService.show({ message: 'Erro ao processar a requisição.', type: 'error' });
  }

  showWarning(): void {
    this.toastService.show({ message: 'Atenção: sessão prestes a expirar.', type: 'warning' });
  }

  showInfo(): void {
    this.toastService.show({ message: 'Atualização disponível na versão 2.1.0.', type: 'info' });
  }
}
