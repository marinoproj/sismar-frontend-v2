import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PortAreaConfigService } from './port-area-config.service';
import { PORT_AREA_CONFIG_REPOSITORY } from '../repositories/port-area-config.repository';
import { PortAreaConfigInput } from '../models/port-area-config.model';

describe('PortAreaConfigService', () => {
  let get: jest.Mock;
  let update: jest.Mock;
  let service: PortAreaConfigService;

  beforeEach(() => {
    get = jest.fn().mockReturnValue(of({ anchorageAreas: [], accessChannelArea: null, portArea: null }));
    update = jest.fn().mockReturnValue(of({ anchorageAreaIds: [] }));

    TestBed.configureTestingModule({
      providers: [PortAreaConfigService, { provide: PORT_AREA_CONFIG_REPOSITORY, useValue: { get, update } }],
    });

    service = TestBed.inject(PortAreaConfigService);
  });

  it('delegates get to the repository', () => {
    service.get(1).subscribe();
    expect(get).toHaveBeenCalledWith(1);
  });

  it('delegates update to the repository', () => {
    const input: PortAreaConfigInput = { anchorageAreaIds: [2, 3], accessChannelAreaId: 4, portAreaId: 5 };
    service.update(1, input).subscribe();
    expect(update).toHaveBeenCalledWith(1, input);
  });
});
