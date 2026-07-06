import { TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Subject } from 'rxjs';
import { PortFormDialogComponent } from './port-form-dialog.component';
import { PortConfigService } from '../../../services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../../repositories/port-config.repository';
import { PortConfig } from '../../../models/port-config.model';

describe('PortFormDialogComponent', () => {
  let create: jest.Mock;
  let closeSpy: jest.Mock;

  function setup() {
    create = jest.fn();
    closeSpy = jest.fn();

    TestBed.configureTestingModule({
      imports: [PortFormDialogComponent],
      providers: [
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn(), create, update: jest.fn() } },
        { provide: DialogRef, useValue: { close: closeSpy } },
        { provide: DIALOG_DATA, useValue: {} },
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
});
