import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { AreasConfigPageComponent } from './areas-config-page.component';
import { AreaService } from '../../services/area.service';
import { AREA_REPOSITORY } from '../../repositories/area.repository';
import { PortConfigService } from '../../../ports/services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../../ports/repositories/port-config.repository';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Area } from '../../models/area.model';
import { ConfirmDialogComponent } from '../../../../../shared/ui/modal/confirm-dialog/confirm-dialog.component';

describe('AreasConfigPageComponent (dropdown actions, real CDK Dialog)', () => {
  const activeArea: Area = { id: 1, name: 'Fundeio Norte', portId: 1, active: true, coordinates: [] };
  const inactiveArea: Area = { id: 2, name: 'Canal de Acesso', portId: 1, active: false, coordinates: [] };

  function setupTestBed(deactivate: jest.Mock, deleteArea: jest.Mock) {
    TestBed.configureTestingModule({
      imports: [AreasConfigPageComponent],
      providers: [
        AreaService,
        {
          provide: AREA_REPOSITORY,
          useValue: {
            getAll: jest.fn().mockReturnValue(of([activeArea, inactiveArea])),
            deactivate,
            delete: deleteArea,
          },
        },
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])) } },
        { provide: AuthService, useValue: { hasFeature: () => true } },
      ],
    });
  }

  it('shows "Editar" (not "Atualizar") and enables Ativar/Inativar/Excluir according to the row state', () => {
    setupTestBed(jest.fn(), jest.fn());
    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const labels = component.actions.map((a) => a.label);
    expect(labels).toEqual(['Editar', 'Ativar', 'Inativar', 'Job retroativo', 'Excluir']);

    const ativar = component.actions.find((a) => a.label === 'Ativar')!;
    const inativar = component.actions.find((a) => a.label === 'Inativar')!;
    const excluir = component.actions.find((a) => a.label === 'Excluir')!;

    expect(ativar.visible!(activeArea as unknown as Record<string, unknown>)).toBe(false);
    expect(inativar.visible!(activeArea as unknown as Record<string, unknown>)).toBe(true);
    expect(excluir.visible!(activeArea as unknown as Record<string, unknown>)).toBe(false);

    expect(ativar.visible!(inactiveArea as unknown as Record<string, unknown>)).toBe(true);
    expect(inativar.visible!(inactiveArea as unknown as Record<string, unknown>)).toBe(false);
    expect(excluir.visible!(inactiveArea as unknown as Record<string, unknown>)).toBe(true);
  });

  it('deactivates an area only after confirming the modal, then shows a success toast', () => {
    const deactivate = jest.fn().mockReturnValue(of(undefined));
    setupTestBed(deactivate, jest.fn());
    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.openDeactivateConfirm(activeArea);
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const confirmRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof ConfirmDialogComponent);
    expect(confirmRef).toBeTruthy();
    expect(deactivate).not.toHaveBeenCalled();

    confirmRef!.close(true);

    expect(deactivate).toHaveBeenCalledWith(activeArea.id);
    const toastService = TestBed.inject(ToastService);
    expect(toastService.toasts()).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'success', message: expect.stringContaining('Fundeio Norte') })]),
    );
  });

  it('does not deactivate when the confirmation modal is cancelled', () => {
    const deactivate = jest.fn().mockReturnValue(of(undefined));
    setupTestBed(deactivate, jest.fn());
    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.openDeactivateConfirm(activeArea);
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const confirmRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof ConfirmDialogComponent);
    confirmRef!.close(false);

    expect(deactivate).not.toHaveBeenCalled();
  });

  it('deletes an area only after confirming the modal, then shows a success toast', () => {
    const deleteArea = jest.fn().mockReturnValue(of(undefined));
    setupTestBed(jest.fn(), deleteArea);
    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.openDeleteConfirm(inactiveArea);
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const confirmRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof ConfirmDialogComponent);
    expect(confirmRef).toBeTruthy();

    confirmRef!.close(true);

    expect(deleteArea).toHaveBeenCalledWith(inactiveArea.id);
    const toastService = TestBed.inject(ToastService);
    expect(toastService.toasts()).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'success', message: expect.stringContaining('Canal de Acesso') })]),
    );
  });
});
