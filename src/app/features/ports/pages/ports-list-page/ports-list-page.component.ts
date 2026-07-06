import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent } from '../../../../shared/ui/table/table.component';
import { ColumnDef, TableAction } from '../../../../shared/models/column-def.model';
import { PortsService } from '../../services/ports.service';
import { PortSummary } from '../../models/port.model';

@Component({
  selector: 'app-ports-list-page',
  standalone: true,
  imports: [TableComponent, DatePipe],
  templateUrl: './ports-list-page.component.html',
})
export class PortsListPageComponent {
  private readonly portsService = inject(PortsService);
  private readonly router = inject(Router);

  @ViewChild('portTpl', { static: true }) portTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;
  @ViewChild('countryTpl', { static: true }) countryTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;
  @ViewChild('shipsTpl', { static: true }) shipsTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;
  @ViewChild('updatedTpl', { static: true }) updatedTpl!: TemplateRef<{ $implicit: Record<string, unknown> }>;

  searchTerm = signal('');

  get summary() {
    return this.portsService.summary();
  }

  get isLoading(): boolean {
    return !this.summary;
  }

  get filteredPorts(): Record<string, unknown>[] {
    const ports = this.summary ?? [];
    const term = this.searchTerm().trim().toLowerCase();
    const filtered = term ? ports.filter((p) => p.name.toLowerCase().includes(term)) : ports;
    return filtered as unknown as Record<string, unknown>[];
  }

  get columns(): ColumnDef[] {
    return [
      { key: 'name', label: 'Porto', template: this.portTpl },
      { key: 'country', label: 'País', template: this.countryTpl },
      { key: 'shipsInPort', label: 'Navios no porto', template: this.shipsTpl, align: 'center' },
    ];
  }

  readonly actions: TableAction[] = [
    {
      label: 'Ver detalhes',
      icon: 'ri-eye-line',
      variant: 'primary',
      action: (row) => this.router.navigate(['/ports', (row as unknown as PortSummary).id]),
    },
  ];

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
