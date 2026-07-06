import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { AreasConfigPageComponent } from './areas-config-page.component';
import { AreaService } from '../../services/area.service';
import { AREA_REPOSITORY } from '../../repositories/area.repository';
import { PortConfigService } from '../../../ports/services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../../ports/repositories/port-config.repository';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Area, AreaCoordinate } from '../../models/area.model';
import { AreaDrawDestinationDialogComponent } from './area-draw-destination-dialog/area-draw-destination-dialog.component';
import { AreaFormDialogComponent } from './area-form-dialog/area-form-dialog.component';
import { AreaSelectDialogComponent } from './area-select-dialog/area-select-dialog.component';

describe('AreasConfigPageComponent (draw flow, real CDK Dialog)', () => {
  const closedCoordinates: AreaCoordinate[] = [
    { lat: -23.952, lon: -46.33 },
    { lat: -23.949, lon: -46.328 },
    { lat: -23.9505, lon: -46.325 },
    { lat: -23.952, lon: -46.33 },
  ];

  function setupTestBed(areas: Area[], create: jest.Mock, update: jest.Mock) {
    TestBed.configureTestingModule({
      imports: [AreasConfigPageComponent],
      providers: [
        AreaService,
        { provide: AREA_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of(areas)), create, update } },
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])) } },
        { provide: AuthService, useValue: { hasFeature: () => true } },
      ],
    });
  }

  it('opens a reduced create form pre-filled with the drawn coordinates when choosing "Criar nova área"', fakeAsync(() => {
    const create = jest.fn().mockReturnValue(of({ id: 10 }));
    setupTestBed([], create, jest.fn());

    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onDrawFinished(closedCoordinates);
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const destinationRef = dialog.openDialogs.find(
      (ref) => ref.componentInstance instanceof AreaDrawDestinationDialogComponent,
    );
    expect(destinationRef).toBeTruthy();

    (destinationRef!.componentInstance as AreaDrawDestinationDialogComponent).chooseCreate();
    fixture.detectChanges();

    const formRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof AreaFormDialogComponent);
    expect(formRef).toBeTruthy();

    const formDialog = formRef!.componentInstance as AreaFormDialogComponent;
    expect(formDialog.data.hideCoordinatesEditor).toBe(true);
    expect(formDialog.uniqueValidCoordinatesCount).toBe(3);

    formDialog.form.patchValue({ name: 'Fundeio desenhado' });
    formDialog.save();
    tick();

    expect(create).toHaveBeenCalledWith({
      name: 'Fundeio desenhado',
      portId: null,
      coordinates: closedCoordinates,
    });
  }));

  it('replaces the perimeter of the selected existing area when choosing "Atualizar área existente"', fakeAsync(() => {
    const existingArea: Area = { id: 5, name: 'Canal de Acesso', portId: 2, active: true, coordinates: [] };
    const update = jest.fn().mockReturnValue(of(existingArea));
    setupTestBed([existingArea], jest.fn(), update);

    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.onDrawFinished(closedCoordinates);
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const destinationRef = dialog.openDialogs.find(
      (ref) => ref.componentInstance instanceof AreaDrawDestinationDialogComponent,
    );
    (destinationRef!.componentInstance as AreaDrawDestinationDialogComponent).chooseUpdate();
    fixture.detectChanges();

    const selectRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof AreaSelectDialogComponent);
    expect(selectRef).toBeTruthy();

    const selectDialog = selectRef!.componentInstance as AreaSelectDialogComponent;
    selectDialog.control.setValue(existingArea.id);
    selectDialog.confirm();
    tick();

    expect(update).toHaveBeenCalledWith(5, {
      name: 'Canal de Acesso',
      portId: 2,
      coordinates: closedCoordinates,
    });

    const toastService = TestBed.inject(ToastService);
    expect(toastService.toasts()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'success', message: expect.stringContaining('Canal de Acesso') }),
      ]),
    );
  }));

  it('resets the draw request when switching away from Mapa, so returning to it does not resume drawing', () => {
    setupTestBed([], jest.fn(), jest.fn());

    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.setViewMode('map');
    component.startDrawingRequestId.set(3);

    component.setViewMode('table');
    expect(component.startDrawingRequestId()).toBe(0);

    component.setViewMode('map');
    expect(component.startDrawingRequestId()).toBe(0);
  });
});
