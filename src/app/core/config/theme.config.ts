import { InjectionToken } from '@angular/core';

/** Configuração visual do projeto. Edite este arquivo ao iniciar um novo sistema. */
export interface ThemeConfig {
  /** 'light' | 'dark' — modo padrão ao abrir pela primeira vez */
  defaultMode: 'light' | 'dark';
  /** Cor primária em hex/hsl — usada em botões, links e destaques (ex: '#6366f1') */
  primaryColor: string;
  /** Cor de fundo do menu/sidebar no modo claro */
  menuColor: string;
  /** Cor de fundo do header no modo claro */
  headerColor: string;
  /** Cor de fundo do menu/sidebar no modo escuro (sobrescreve menuColor) */
  darkMenuColor?: string;
  /** Cor de fundo do header no modo escuro (sobrescreve headerColor) */
  darkHeaderColor?: string;
  /** Caminho para o logo em src/assets/images/ (ex: 'assets/images/logo.svg') */
  logoUrl: string;
  /** Nome da aplicação exibido no título e header */
  appName: string;
}

export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');

export const themeConfig: ThemeConfig = {
  defaultMode: 'dark',
  primaryColor: '#6C63FF',
  menuColor:     '#131925',   // sidebar no modo claro
  headerColor:   '#ffffff',   // header no modo claro
  darkMenuColor:   '#18181B', // sidebar no modo escuro
  darkHeaderColor: '#202026', // header no modo escuro
  logoUrl: 'assets/images/logo.svg',
  appName: 'Sismar',
};
