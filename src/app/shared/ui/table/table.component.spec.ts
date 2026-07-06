import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableComponent } from './table.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ColumnDef, TableAction } from '../../models/column-def.model';

describe('TableComponent', () => {
  let fixture: ComponentFixture<TableComponent>;
  let component: TableComponent;

  const columns: ColumnDef[] = [{ key: 'name', label: 'Nome' }];
  const rows: Record<string, unknown>[] = [
    { name: 'Ativa', active: true },
    { name: 'Inativa', active: false },
  ];

  function buildActions(edit: jest.Mock, activate: jest.Mock): TableAction[] {
    return [
      { label: 'Editar', icon: 'ri-edit-line', action: edit },
      {
        label: 'Ativar',
        icon: 'ri-checkbox-circle-line',
        action: activate,
        visible: (row) => !(row as { active: boolean }).active,
      },
    ];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TableComponent] });
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.columns = columns;
    component.rows = rows;
  });

  describe('actionsMode: inline (default)', () => {
    it('renders one button per visible action and omits hidden ones', () => {
      const edit = jest.fn();
      const activate = jest.fn();
      component.actions = buildActions(edit, activate);
      fixture.detectChanges();

      const activeRowButtons = fixture.debugElement.queryAll(By.css('tbody tr'))[0].queryAll(By.css('button'));
      expect(activeRowButtons.map((b) => b.nativeElement.title)).toEqual(['Editar']);

      const inactiveRowButtons = fixture.debugElement.queryAll(By.css('tbody tr'))[1].queryAll(By.css('button'));
      expect(inactiveRowButtons.map((b) => b.nativeElement.title)).toEqual(['Editar', 'Ativar']);
    });

    it('invokes the action callback with the row on click', () => {
      const edit = jest.fn();
      const activate = jest.fn();
      component.actions = buildActions(edit, activate);
      fixture.detectChanges();

      const editButton = fixture.debugElement.queryAll(By.css('tbody tr'))[0].query(By.css('button'));
      editButton.nativeElement.click();

      expect(edit).toHaveBeenCalledWith(rows[0]);
    });

    it('does not render app-dropdown', () => {
      component.actions = buildActions(jest.fn(), jest.fn());
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.directive(DropdownComponent)).length).toBe(0);
    });
  });

  describe('actionsMode: dropdown', () => {
    it('renders one app-dropdown per row with visible actions enabled and hidden ones disabled', () => {
      component.actionsMode = 'dropdown';
      component.actions = buildActions(jest.fn(), jest.fn());
      fixture.detectChanges();

      const dropdowns = fixture.debugElement.queryAll(By.directive(DropdownComponent));
      expect(dropdowns.length).toBe(2);

      const activeRowItems = (dropdowns[0].componentInstance as DropdownComponent).items;
      expect(activeRowItems.map((i) => [i.label, i.disabled])).toEqual([
        ['Editar', false],
        ['Ativar', true],
      ]);

      const inactiveRowItems = (dropdowns[1].componentInstance as DropdownComponent).items;
      expect(inactiveRowItems.map((i) => [i.label, i.disabled])).toEqual([
        ['Editar', false],
        ['Ativar', false],
      ]);
    });

    it('invokes the action callback with the row when an item is selected', () => {
      const edit = jest.fn();
      const activate = jest.fn();
      component.actionsMode = 'dropdown';
      component.actions = buildActions(edit, activate);
      fixture.detectChanges();

      const dropdowns = fixture.debugElement.queryAll(By.directive(DropdownComponent));
      (dropdowns[1].componentInstance as DropdownComponent).items[1].action();

      expect(activate).toHaveBeenCalledWith(rows[1]);
    });

    it('respects an explicit disabled() alongside visible()', () => {
      const disabledAction: TableAction = {
        label: 'Excluir',
        action: jest.fn(),
        disabled: () => true,
      };
      component.actionsMode = 'dropdown';
      component.actions = [disabledAction];
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.directive(DropdownComponent))
        .componentInstance as DropdownComponent;
      expect(dropdown.items[0].disabled).toBe(true);
    });
  });
});
