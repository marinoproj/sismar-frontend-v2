import { Component } from '@angular/core';
import { ListGroupComponent, ListGroupItem } from '../../../../shared/ui/list-group/list-group.component';

@Component({
  selector: 'app-list-group-page',
  standalone: true,
  imports: [ListGroupComponent],
  templateUrl: './list-group-page.component.html',
})
export class ListGroupPageComponent {
  readonly simpleItems: ListGroupItem[] = [
    { label: 'Perfil do usuário' },
    { label: 'Configurações da conta' },
    { label: 'Notificações', active: true },
    { label: 'Segurança e privacidade' },
    { label: 'Integrações' },
  ];

  readonly badgeItems: ListGroupItem[] = [
    { label: 'Caixa de entrada', badge: '14', badgeVariant: 'danger' },
    { label: 'Enviados', badge: '3', badgeVariant: 'default' },
    { label: 'Rascunhos', badge: '7', badgeVariant: 'warning' },
    { label: 'Spam', badge: '2', badgeVariant: 'danger' },
    { label: 'Lixeira', badge: '0', badgeVariant: 'default' },
  ];

  readonly iconItems: ListGroupItem[] = [
    { label: 'Dashboard', description: 'Visão geral e métricas', icon: 'ri-dashboard-line', active: true },
    { label: 'Relatórios', description: 'Exportação e análise de dados', icon: 'ri-file-chart-line' },
    { label: 'Usuários', description: 'Gestão de equipes e acessos', icon: 'ri-group-line' },
    { label: 'Configurações', description: 'Preferências do sistema', icon: 'ri-settings-3-line' },
  ];
}
