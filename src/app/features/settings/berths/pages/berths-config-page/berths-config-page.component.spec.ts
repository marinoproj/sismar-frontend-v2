import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { BerthsConfigPageComponent } from './berths-config-page.component';
import { BerthConfigService } from '../../services/berth-config.service';
import { BERTH_CONFIG_REPOSITORY } from '../../repositories/berth-config.repository';
import { AuthService } from '../../../../../core/auth/auth.service';

describe('BerthsConfigPageComponent (rendering)', () => {
  it('resolves terminal and area names from the nested objects returned by the API', fakeAsync(() => {
    const berths = [
      {
        id: 1,
        name: 'Berço 01 Leste',
        terminal: {
          id: 1,
          name: 'Terminal T2',
          code: 'TC2',
          terminalType: 'CONTAINER',
          port: { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: '', countryFlag: '' },
        },
        area: { id: 6, name: 'Fundeio Norte', portId: 1, active: true },
        length: 350.5,
        draft: 12.8,
      },
      {
        id: 2,
        name: 'Berço 02',
        terminal: {
          id: 1,
          name: 'Terminal T2',
          code: 'TC2',
          terminalType: 'CONTAINER',
          port: { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: '', countryFlag: '' },
        },
        area: null,
        length: 300,
        draft: 10,
      },
    ];

    TestBed.configureTestingModule({
      imports: [BerthsConfigPageComponent],
      providers: [
        BerthConfigService,
        { provide: BERTH_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of(berths)) } },
        { provide: AuthService, useValue: { hasFeature: () => true } },
      ],
    });

    const fixture = TestBed.createComponent(BerthsConfigPageComponent);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const rows = fixture.componentInstance.rows;
    expect(rows[0]['terminalName']).toBe('Terminal T2');
    expect(rows[0]['areaName']).toBe('Fundeio Norte');
    expect(rows[1]['areaName']).toBe('—');
  }));
});
