import { InjectionToken } from '@angular/core';

/** Configuração visual do projeto. Edite este arquivo ao iniciar um novo sistema. */
export interface ThemeConfig {
  /** 'light' | 'dark' — modo padrão ao abrir pela primeira vez */
  defaultMode: 'light' | 'dark';
  /** Cor primária em hex/hsl — usada em botões, links e destaques (ex: '#6366f1') */
  primaryColor: string;
  /** Cor de fundo do menu/sidebar (ex: '#1e2235') */
  menuColor: string;
  /** Cor de fundo do header (ex: '#ffffff') */
  headerColor: string;
  /** Caminho para o logo em src/assets/images/ (ex: 'assets/images/logo.svg') */
  logoUrl: string;
  /** Nome da aplicação exibido no título e header */
  appName: string;
}

export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');

export const themeConfig: ThemeConfig = {
  defaultMode: 'dark',
  primaryColor: '#6C63FF',
  menuColor: '#18181B',
  headerColor: '#202026',
  logoUrl: 'assets/images/logo.svg',
  appName: 'Sismar',
};
