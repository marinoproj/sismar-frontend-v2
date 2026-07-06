import { TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Subject, of } from 'rxjs';
import { AreaFormDialogComponent } from './area-form-dialog.component';
import { AreaService } from '../../../services/area.service';
import { AREA_REPOSITORY } from '../../../repositories/area.repository';
import { PortConfigService } from '../../../../ports/services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../../../ports/repositories/port-config.repository';
import { Area } from '../../../models/area.model';

describe('AreaFormDialogComponent', () => {
  let create: jest.Mock;
  let closeSpy: jest.Mock;

  function setup(data: { area?: Area } = {}) {
    create = jest.fn();
    closeSpy = jest.fn();

    TestBed.configureTestingModule({
      imports: [AreaFormDialogComponent],
      providers: [
        AreaService,
        { provide: AREA_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])), create, update: jest.fn() } },
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])) } },
        { provide: DialogRef, useValue: { close: closeSpy } },
        { provide: DIALOG_DATA, useValue: data },
      ],
    });

    const fixture = TestBed.createComponent(AreaFormDialogComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function fillCoordinate(component: AreaFormDialogComponent, index: number, lat: number, lon: number): void {
    component.coordinatesArray.at(index).setValue({ lat, lon });
  }

  it('starts with 3 empty coordinate rows for a new area and blocks save', () => {
    const component = setup();

    expect(component.coordinateGroups.length).toBe(3);
    expect(component.hasMinimumCoordinates).toBe(false);
    expect(component.canSave).toBe(false);
  });

  it('blocks save with less than 3 unique valid coordinates', () => {
    const component = setup();
    component.form.patchValue({ name: 'Área teste' });
    fillCoordinate(component, 0, -23.95, -46.3);
    fillCoordinate(component, 1, -23.95, -46.3); // duplicada da primeira
    fillCoordinate(component, 2, -23.94, -46.29);

    expect(component.hasMinimumCoordinates).toBe(false);
    expect(component.canSave).toBe(false);
  });

  it('allows save with 3 unique valid coordinates and closes the polygon automatically on submit', () => {
    const component = setup();
    component.form.patchValue({ name: 'Fundeio Norte' });
    fillCoordinate(component, 0, -23.952, -46.33);
    fillCoordinate(component, 1, -23.949, -46.328);
    fillCoordinate(component, 2, -23.9505, -46.325);

    expect(component.hasMinimumCoordinates).toBe(true);
    expect(component.canSave).toBe(true);

    create.mockReturnValue(of({ id: 1 }));
    component.save();

    expect(create).toHaveBeenCalledWith({
      name: 'Fundeio Norte',
      portId: null,
      coordinates: [
        { lat: -23.952, lon: -46.33 },
        { lat: -23.949, lon: -46.328 },
        { lat: -23.9505, lon: -46.325 },
        { lat: -23.952, lon: -46.33 },
      ],
    });
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('shows the loading state while saving and re-enables on error', () => {
    const component = setup();
    component.form.patchValue({ name: 'Fundeio Norte' });
    fillCoordinate(component, 0, -23.952, -46.33);
    fillCoordinate(component, 1, -23.949, -46.328);
    fillCoordinate(component, 2, -23.9505, -46.325);

    const requestResult$ = new Subject();
    create.mockReturnValue(requestResult$.asObservable());

    component.save();
    expect(component.saving()).toBe(true);

    requestResult$.error(new Error('falhou'));

    expect(component.saving()).toBe(false);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('strips the closing duplicate coordinate when editing an existing area', () => {
    const area: Area = {
      id: 1,
      name: 'Fundeio Norte',
      portId: 1,
      active: false,
      coordinates: [
        { lat: -23.952, lon: -46.33 },
        { lat: -23.949, lon: -46.328 },
        { lat: -23.9505, lon: -46.325 },
        { lat: -23.952, lon: -46.33 },
      ],
    };

    const component = setup({ area });

    expect(component.coordinateGroups.length).toBe(3);
    expect(component.coordinatesArray.getRawValue()).toEqual([
      { lat: -23.952, lon: -46.33 },
      { lat: -23.949, lon: -46.328 },
      { lat: -23.9505, lon: -46.325 },
    ]);
  });
});
