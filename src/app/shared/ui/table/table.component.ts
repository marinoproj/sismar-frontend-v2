import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ColumnDef } from '../../models/column-def.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input({ required: true }) columns: ColumnDef[] = [];
  @Input({ required: true }) rows: Record<string, unknown>[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() totalItems?: number;
  @Input() pageSize = 10;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  get skeletonRows(): number[] {
    return Array.from({ length: this.pageSize }, (_, i) => i);
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
}
