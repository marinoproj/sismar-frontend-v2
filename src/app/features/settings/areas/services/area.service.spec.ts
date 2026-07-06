import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AreaService } from './area.service';
import { AREA_REPOSITORY } from '../repositories/area.repository';
import { Area, AreaInput } from '../models/area.model';

describe('AreaService', () => {
  let getAll: jest.Mock;
  let create: jest.Mock;
  let update: jest.Mock;
  let activate: jest.Mock;
  let deactivate: jest.Mock;
  let deleteArea: jest.Mock;

  const areas: Area[] = [
    { id: 1, name: 'Fundeio Norte', coordinates: [], portId: 1, active: true },
    { id: 2, name: 'Canal de Acesso', coordinates: [], portId: 1, active: false },
  ];

  beforeEach(() => {
    getAll = jest.fn().mockReturnValue(of(areas));
    create = jest.fn().mockReturnValue(of({}));
    update = jest.fn().mockReturnValue(of({}));
    activate = jest.fn().mockReturnValue(of(undefined));
    deactivate = jest.fn().mockReturnValue(of(undefined));
    deleteArea = jest.fn().mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        AreaService,
        {
          provide: AREA_REPOSITORY,
          useValue: {
            getAll,
            create,
            update,
            activate,
            deactivate,
            delete: deleteArea,
            getLastRetroactiveJob: jest.fn(),
            triggerRetroactiveJob: jest.fn(),
            cancelRetroactiveJob: jest.fn(),
          },
        },
      ],
    });
  });

  it('loads all areas on init', () => {
    const service = TestBed.inject(AreaService);

    expect(getAll).toHaveBeenCalled();
    expect(service.areas()).toEqual(areas);
  });

  it('filters areas by name client-side (a API não suporta filtro por nome)', () => {
    const service = TestBed.inject(AreaService);

    service.search('canal');

    expect(service.areas()).toEqual([areas[1]]);
    expect(getAll).toHaveBeenCalledTimes(1);
  });

  it('reloads the list after creating an area', () => {
    const service = TestBed.inject(AreaService);
    getAll.mockClear();

    const input: AreaInput = { name: 'Nova área', coordinates: [] };
    service.create(input).subscribe();

    expect(create).toHaveBeenCalledWith(input);
    expect(getAll).toHaveBeenCalledTimes(1);
  });

  it('reloads the list after updating an area', () => {
    const service = TestBed.inject(AreaService);
    getAll.mockClear();

    const input: AreaInput = { name: 'Área atualizada', coordinates: [] };
    service.update(1, input).subscribe();

    expect(update).toHaveBeenCalledWith(1, input);
    expect(getAll).toHaveBeenCalledTimes(1);
  });

  it('reloads the list after activating an area', () => {
    const service = TestBed.inject(AreaService);
    getAll.mockClear();

    service.activate(2).subscribe();

    expect(activate).toHaveBeenCalledWith(2);
    expect(getAll).toHaveBeenCalledTimes(1);
  });

  it('reloads the list after deactivating an area', () => {
    const service = TestBed.inject(AreaService);
    getAll.mockClear();

    service.deactivate(1).subscribe();

    expect(deactivate).toHaveBeenCalledWith(1);
    expect(getAll).toHaveBeenCalledTimes(1);
  });

  it('reloads the list after deleting an area', () => {
    const service = TestBed.inject(AreaService);
    getAll.mockClear();

    service.delete(2).subscribe();

    expect(deleteArea).toHaveBeenCalledWith(2);
    expect(getAll).toHaveBeenCalledTimes(1);
  });
});
