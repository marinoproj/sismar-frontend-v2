import { TemplateRef } from '@angular/core';

export interface ColumnDef {
  key: string;
  label: string;
  template?: TemplateRef<{ $implicit: Record<string, unknown> }>;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T = Record<string, unknown>> {
  label: string;
  icon?: string;
  variant?: 'default' | 'primary' | 'danger' | 'warning';
  action: (row: T) => void;
  disabled?: (row: T) => boolean;
  visible?: (row: T) => boolean;
}
