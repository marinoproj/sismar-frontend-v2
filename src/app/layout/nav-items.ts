export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  feature?: string;
  demo?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  group: string;
  items: NavItem[];
}

const allNavSections: NavSection[] = [
  {
    group: 'MAIN',
    items: [
      {
        label: 'Portos',
        icon: 'ri-anchor-line',
        route: '/ports',
        feature: 'PORTOS',
      },
      {
        label: 'Dashboard',
        icon: 'ri-dashboard-line',
        demo: true,
        children: [
          { label: 'Vendas', icon: 'ri-line-chart-line', route: '/dashboard/vendas' },
          { label: 'Ações', icon: 'ri-stock-line', route: '/dashboard/acoes' },
        ],
      },
      {
        label: 'Charts',
        icon: 'ri-bar-chart-grouped-line',
        demo: true,
        children: [
          { label: 'Line Charts', icon: 'ri-line-chart-line', route: '/charts/line' },
          { label: 'Bar Charts', icon: 'ri-bar-chart-line', route: '/charts/bar' },
          { label: 'Mixed Charts', icon: 'ri-bar-chart-2-line', route: '/charts/mixed' },
          { label: 'Timeline Charts', icon: 'ri-calendar-event-line', route: '/charts/timeline' },
          { label: 'Pie Charts', icon: 'ri-pie-chart-line', route: '/charts/pie' },
        ],
      },
      {
        label: 'UI Elements',
        icon: 'ri-layout-grid-line',
        demo: true,
        children: [
          { label: 'Alerts', icon: 'ri-alert-line', route: '/ui-elements/alerts' },
          { label: 'Badges', icon: 'ri-price-tag-3-line', route: '/ui-elements/badges' },
          { label: 'Buttons', icon: 'ri-cursor-line', route: '/ui-elements/buttons' },
          { label: 'Cards', icon: 'ri-article-line', route: '/ui-elements/cards' },
          { label: 'Dropdowns', icon: 'ri-menu-line', route: '/ui-elements/dropdowns' },
          { label: 'List group', icon: 'ri-list-check', route: '/ui-elements/list-group' },
          { label: 'Modals', icon: 'ri-window-2-line', route: '/ui-elements/modals' },
          { label: 'Progress', icon: 'ri-progress-4-line', route: '/ui-elements/progress' },
          { label: 'Spinners', icon: 'ri-loader-4-line', route: '/ui-elements/spinners' },
          { label: 'Tables', icon: 'ri-table-line', route: '/ui-elements/tables' },
          { label: 'Toasts', icon: 'ri-notification-3-line', route: '/ui-elements/toasts' },
        ],
      },
      {
        label: 'Maps',
        icon: 'ri-map-pin-line',
        demo: true,
        route: '/maps',
      },
    ],
  },
  {
    group: 'SISTEMA',
    items: [
      {
        label: 'Configurações',
        icon: 'ri-settings-3-line',
        route: '/settings',
      },
    ],
  },
];

export interface NavVisibilityOptions {
  production: boolean;
  hasFeature: (feature: string) => boolean;
}

export function getNavSections(options: NavVisibilityOptions): NavSection[] {
  return allNavSections
    .map((section) => ({
      group: section.group,
      items: section.items.filter((item) => isNavItemVisible(item, options)),
    }))
    .filter((section) => section.items.length > 0);
}

function isNavItemVisible(item: NavItem, options: NavVisibilityOptions): boolean {
  if (item.demo && options.production) return false;
  if (item.feature && !options.hasFeature(item.feature)) return false;
  return true;
}
