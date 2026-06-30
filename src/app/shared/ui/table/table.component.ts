import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ColumnDef, TableAction } from '../../models/column-def.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input({ required: true }) columns: ColumnDef[] = [];
  @Input({ required: true }) rows: Record<string, unknown>[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() totalItems?: number;
  @Input() pageSize = 10;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  get hasActions(): boolean {
    return this.actions.length > 0;
  }

  get skeletonRows(): number[] {
    return Array.from({ length: this.pageSize }, (_, i) => i);
  }

  get totalColumns(): number {
    return this.columns.length + (this.hasActions ? 1 : 0);
  }

  get totalPages(): number {
    if (!this.totalItems) return 1;
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get showPagination(): boolean {
    return this.totalItems !== undefined && this.totalItems > this.pageSize;
  }

  get rangeStart(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems ?? 0);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  getCellValue(row: Record<string, unknown>, key: string): unknown {
    return key.split('.').reduce((obj, k) => (obj as Record<string, unknown>)?.[k], row as unknown);
  }

  alignClass(align?: 'left' | 'center' | 'right'): string {
    return align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  }

  isActionVisible(action: TableAction, row: Record<string, unknown>): boolean {
    return action.visible ? action.visible(row) : true;
  }

  isActionDisabled(action: TableAction, row: Record<string, unknown>): boolean {
    return action.disabled ? action.disabled(row) : false;
  }

  actionButtonClass(action: TableAction): string {
    const base = 'inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
    const variants: Record<string, string> = {
      primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40',
      warning: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/40',
      default: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    };
    return `${base} ${variants[action.variant ?? 'default']}`;
  }
}
