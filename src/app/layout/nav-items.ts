export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'ri-dashboard-line',
    route: '/dashboard',
  },
  {
    label: 'Configurações',
    icon: 'ri-settings-3-line',
    route: '/settings',
  },
];
