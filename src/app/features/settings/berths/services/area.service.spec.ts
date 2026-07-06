import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AreaService } from './area.service';
import { AREA_REPOSITORY } from '../repositories/area.repository';
import { Area } from '../models/area.model';

describe('AreaService', () => {
  it('loads all areas on init', () => {
    const areas: Area[] = [{ id: 1, name: 'Fundeio Norte', portId: 1, active: true }];
    const getAll = jest.fn().mockReturnValue(of(areas));

    TestBed.configureTestingModule({
      providers: [AreaService, { provide: AREA_REPOSITORY, useValue: { getAll } }],
    });

    const service = TestBed.inject(AreaService);

    expect(getAll).toHaveBeenCalled();
    expect(service.areas()).toEqual(areas);
  });
});
