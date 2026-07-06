import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { TerminalsConfigPageComponent } from './terminals-config-page.component';
import { TerminalConfigService } from '../../services/terminal-config.service';
import { TERMINAL_CONFIG_REPOSITORY } from '../../repositories/terminal-config.repository';
import { PortConfigService } from '../../../ports/services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../../ports/repositories/port-config.repository';
import { AuthService } from '../../../../../core/auth/auth.service';

describe('TerminalsConfigPageComponent (rendering)', () => {
  it('resolves the port name for each terminal row from the nested port object', fakeAsync(() => {
    const ports = [{ id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: '', countryFlag: '' }];
    const terminals = [
      {
        id: 1,
        name: 'Terminal T2',
        code: 'TC2',
        terminalType: 'CONTAINER',
        port: { id: 1, name: 'Porto de Santos', country: 'Brasil', imagePort: '', countryFlag: '' },
      },
    ];

    TestBed.configureTestingModule({
      imports: [TerminalsConfigPageComponent],
      providers: [
        TerminalConfigService,
        { provide: TERMINAL_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of(terminals)) } },
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of(ports)) } },
        { provide: AuthService, useValue: { hasFeature: () => true } },
      ],
    });

    const fixture = TestBed.createComponent(TerminalsConfigPageComponent);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const rows = fixture.componentInstance.rows;
    expect(rows[0]['portName']).toBe('Porto de Santos');
  }));
});
