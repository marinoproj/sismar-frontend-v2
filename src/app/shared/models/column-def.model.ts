import { TemplateRef } from '@angular/core';

export interface ColumnDef {
  key: string;
  label: string;
  template?: TemplateRef<{ $implicit: Record<string, unknown> }>;
  width?: string;
  align?: 'left' | 'center' | 'right';
}
