import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';
import { PortsConfigPageComponent } from './ports-config-page.component';
import { PortConfigService } from '../../services/port-config.service';
import { PORT_CONFIG_REPOSITORY } from '../../repositories/port-config.repository';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PortFormDialogComponent } from './port-form-dialog/port-form-dialog.component';
import { AreaService } from '../../../areas/services/area.service';
import { AREA_REPOSITORY } from '../../../areas/repositories/area.repository';
import { PortAreaConfigService } from '../../services/port-area-config.service';
import { PORT_AREA_CONFIG_REPOSITORY } from '../../repositories/port-area-config.repository';

describe('PortsConfigPageComponent (create flow, real CDK Dialog)', () => {
  it('shows a success toast after submitting the create dialog', fakeAsync(() => {
    const create = jest
      .fn()
      .mockReturnValue(of({ id: 1, name: 'Porto Novo', country: 'Brasil', imagePort: 'a', countryFlag: 'b' }));

    TestBed.configureTestingModule({
      imports: [PortsConfigPageComponent],
      providers: [
        PortConfigService,
        {
          provide: PORT_CONFIG_REPOSITORY,
          useValue: { getAll: jest.fn().mockReturnValue(of([])), create },
        },
        { provide: AuthService, useValue: { hasFeature: () => true } },
        AreaService,
        { provide: AREA_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])) } },
        PortAreaConfigService,
        { provide: PORT_AREA_CONFIG_REPOSITORY, useValue: { get: jest.fn(), update: jest.fn() } },
      ],
    });

    const fixture = TestBed.createComponent(PortsConfigPageComponent);
    fixture.detectChanges();
    tick(300);

    fixture.componentInstance.openCreateDialog();
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const dialogRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof PortFormDialogComponent);
    expect(dialogRef).toBeTruthy();

    const formDialog = dialogRef!.componentInstance as PortFormDialogComponent;
    formDialog.form.setValue({
      name: 'Porto Novo',
      country: 'Brasil',
      imagePort: 'a',
      countryFlag: 'b',
      latitude: null,
      longitude: null,
    });
    formDialog.save();
    tick();
    fixture.detectChanges();

    expect(create).toHaveBeenCalled();

    const toastService = TestBed.inject(ToastService);
    expect(toastService.toasts()).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'success', message: expect.stringContaining('Porto Novo') })]),
    );
  }));
});
