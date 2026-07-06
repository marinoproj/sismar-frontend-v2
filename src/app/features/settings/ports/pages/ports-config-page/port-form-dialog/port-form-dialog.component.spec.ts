import { TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { of, Subject } from 'rxjs';
import { PortFormDialogComponent, PortFormDialogData } from './port-form-dialog.component';
import { PortConfigService } from '../../../services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../../repositories/port-config.repository';
import { PortConfig } from '../../../models/port-config.model';
import { AreaService } from '../../../../areas/services/area.service';
import { AREA_REPOSITORY } from '../../../../areas/repositories/area.repository';
import { Area } from '../../../../areas/models/area.model';
import { PortAreaConfigService } from '../../../services/port-area-config.service';
import { PORT_AREA_CONFIG_REPOSITORY } from '../../../repositories/port-area-config.repository';
import { PortAreaConfigDetail } from '../../../models/port-area-config.model';

describe('PortFormDialogComponent', () => {
  let create: jest.Mock;
  let update: jest.Mock;
  let closeSpy: jest.Mock;
  let getAreaConfig: jest.Mock;
  let updateAreaConfig: jest.Mock;

  const portAreas: Area[] = [
    { id: 10, name: 'Fundeio Norte', portId: 1, active: true, coordinates: [] },
    { id: 11, name: 'Fundeio Sul', portId: 1, active: true, coordinates: [] },
    { id: 12, name: 'Canal Principal', portId: 1, active: true, coordinates: [] },
    { id: 13, name: 'Perímetro do Porto', portId: 1, active: true, coordinates: [] },
  ];

  function setup(
    data: PortFormDialogData = {},
    areaConfig: PortAreaConfigDetail = { anchorageAreas: [], accessChannelArea: null, portArea: null },
  ) {
    create = jest.fn();
    update = jest.fn();
    closeSpy = jest.fn();
    getAreaConfig = jest.fn().mockReturnValue(of(areaConfig));
    updateAreaConfig = jest.fn().mockReturnValue(of({ anchorageAreaIds: [] }));

    TestBed.configureTestingModule({
      imports: [PortFormDialogComponent],
      providers: [
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn(), create, update } },
        AreaService,
        { provide: AREA_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of(portAreas)) } },
        PortAreaConfigService,
        { provide: PORT_AREA_CONFIG_REPOSITORY, useValue: { get: getAreaConfig, update: updateAreaConfig } },
        { provide: DialogRef, useValue: { close: closeSpy } },
        { provide: DIALOG_DATA, useValue: data },
      ],
    });

    const fixture = TestBed.createComponent(PortFormDialogComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('shows a loading state on the button while the request is in flight, then closes on success', () => {
    const component = setup();
    const requestResult$ = new Subject<PortConfig>();
    create.mockReturnValue(requestResult$.asObservable());

    component.form.setValue({
      name: 'Porto Novo',
      country: 'Brasil',
      imagePort: 'a',
      countryFlag: 'b',
      latitude: null,
      longitude: null,
    });

    expect(component.saving()).toBe(false);

    component.save();

    expect(component.saving()).toBe(true);
    expect(closeSpy).not.toHaveBeenCalled();

    requestResult$.next({ id: 1, name: 'Porto Novo', country: 'Brasil', imagePort: 'a', countryFlag: 'b' });
    requestResult$.complete();

    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('re-enables the button (stops loading) if the request fails, keeping the dialog open', () => {
    const component = setup();
    const requestResult$ = new Subject<PortConfig>();
    create.mockReturnValue(requestResult$.asObservable());

    component.form.setValue({
      name: 'Porto Novo',
      country: 'Brasil',
      imagePort: 'a',
      countryFlag: 'b',
      latitude: null,
      longitude: null,
    });

    component.save();
    expect(component.saving()).toBe(true);

    requestResult$.error(new Error('falhou'));

    expect(component.saving()).toBe(false);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('does not submit again while a request is already in flight', () => {
    const component = setup();
    const requestResult$ = new Subject<PortConfig>();
    create.mockReturnValue(requestResult$.asObservable());

    component.form.setValue({
      name: 'Porto Novo',
      country: 'Brasil',
      imagePort: 'a',
      countryFlag: 'b',
      latitude: null,
      longitude: null,
    });

    component.save();
    component.save();

    expect(create).toHaveBeenCalledTimes(1);
  });

  describe('área do porto (fundeio / canal de acesso / área do porto)', () => {
    it('keeps the section disabled (no fetch) when creating a new port', () => {
      const component = setup({});

      expect(component.isEdit).toBe(false);
      expect(getAreaConfig).not.toHaveBeenCalled();
      expect(component.portAreas).toEqual([]);
    });

    it('loads the existing configuration when editing a port', () => {
      const port: PortConfig = { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
      const component = setup(
        { port },
        { anchorageAreas: [portAreas[0]], accessChannelArea: portAreas[2], portArea: portAreas[3] },
      );

      expect(getAreaConfig).toHaveBeenCalledWith(1);
      expect(component.areaConfigLoading()).toBe(false);
      expect(component.isAnchorage(portAreas[0].id)).toBe(true);
      expect(component.accessChannelControl.value).toBe(portAreas[2].id);
      expect(component.portAreaControl.value).toBe(portAreas[3].id);
    });

    it('only lists areas belonging to the port being edited', () => {
      const port: PortConfig = { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
      const component = setup({ port });

      expect(component.portAreas.map((a) => a.id)).toEqual(portAreas.map((a) => a.id));
    });

    it('prevents the same area from being selected in more than one role', () => {
      const port: PortConfig = { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
      const component = setup({ port });

      component.toggleAnchorage(portAreas[0].id);
      expect(component.channelOptions.some((a) => a.id === portAreas[0].id)).toBe(false);
      expect(component.portAreaOptions.some((a) => a.id === portAreas[0].id)).toBe(false);
      expect(component.isAnchorageDisabled(portAreas[0].id)).toBe(false);

      component.accessChannelControl.setValue(portAreas[1].id);
      expect(component.isAnchorageDisabled(portAreas[1].id)).toBe(true);
      expect(component.portAreaOptions.some((a) => a.id === portAreas[1].id)).toBe(false);
    });

    it('saves the area configuration with the expected payload and shows a success toast', () => {
      const port: PortConfig = { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
      const component = setup({ port });

      component.toggleAnchorage(portAreas[0].id);
      component.toggleAnchorage(portAreas[1].id);
      component.accessChannelControl.setValue(portAreas[2].id);
      component.portAreaControl.setValue(portAreas[3].id);

      component.saveAreaConfig();

      expect(updateAreaConfig).toHaveBeenCalledWith(1, {
        anchorageAreaIds: [portAreas[0].id, portAreas[1].id],
        accessChannelAreaId: portAreas[2].id,
        portAreaId: portAreas[3].id,
      });
      expect(component.areaConfigSaving()).toBe(false);
    });

    it('starts on the "dados" tab and submitActiveTab() dispatches to the right save method per tab', () => {
      const port: PortConfig = { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };
      const component = setup({ port });
      component.form.setValue({
        name: 'Porto de Santos',
        country: 'Brasil',
        imagePort: 'a',
        countryFlag: 'b',
        latitude: null,
        longitude: null,
      });
      update.mockReturnValue(of(port));

      expect(component.activeTab()).toBe('dados');
      component.submitActiveTab();
      expect(updateAreaConfig).not.toHaveBeenCalled();

      component.activeTab.set('areas');
      component.submitActiveTab();
      expect(updateAreaConfig).toHaveBeenCalledWith(1, {
        anchorageAreaIds: [],
        accessChannelAreaId: null,
        portAreaId: null,
      });
    });

    it('filters the anchorage list by name and paginates the results (5 per page)', () => {
      const manyAreas: Area[] = Array.from({ length: 7 }, (_, i) => ({
        id: 100 + i,
        name: `Fundeio ${i}`,
        portId: 1,
        active: true,
        coordinates: [],
      }));
      const port: PortConfig = { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: 'a', countryFlag: 'b' };

      TestBed.configureTestingModule({
        imports: [PortFormDialogComponent],
        providers: [
          PortConfigService,
          { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn(), create: jest.fn(), update: jest.fn() } },
          AreaService,
          { provide: AREA_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of(manyAreas)) } },
          PortAreaConfigService,
          {
            provide: PORT_AREA_CONFIG_REPOSITORY,
            useValue: {
              get: jest.fn().mockReturnValue(of({ anchorageAreas: [], accessChannelArea: null, portArea: null })),
              update: jest.fn(),
            },
          },
          { provide: DialogRef, useValue: { close: jest.fn() } },
          { provide: DIALOG_DATA, useValue: { port } },
        ],
      });
      const fixture = TestBed.createComponent(PortFormDialogComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;

      expect(component.anchorageTotalPages).toBe(2);
      expect(component.pagedAnchorageAreas.length).toBe(5);

      component.goToAnchoragePage(2);
      expect(component.pagedAnchorageAreas.length).toBe(2);

      component.onAnchorageSearchChange('Fundeio 6');
      expect(component.anchoragePage()).toBe(1);
      expect(component.filteredAnchorageAreas).toEqual([manyAreas[6]]);
      expect(component.anchorageTotalPages).toBe(1);
    });
  });
});
