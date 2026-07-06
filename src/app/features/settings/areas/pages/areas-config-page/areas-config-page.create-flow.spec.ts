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
import { AreaMethodChoiceDialogComponent } from './area-method-choice-dialog/area-method-choice-dialog.component';
import { AreaFormDialogComponent } from './area-form-dialog/area-form-dialog.component';

describe('AreasConfigPageComponent (create flow, real CDK Dialog)', () => {
  it('shows a success toast after choosing manual entry and submitting the form', fakeAsync(() => {
    const create = jest.fn().mockReturnValue(
      of({ id: 1, name: 'Fundeio Norte', portId: null, active: false, coordinates: [] }),
    );

    TestBed.configureTestingModule({
      imports: [AreasConfigPageComponent],
      providers: [
        AreaService,
        { provide: AREA_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])), create } },
        PortConfigService,
        { provide: PORT_CONFIG_REPOSITORY, useValue: { getAll: jest.fn().mockReturnValue(of([])) } },
        { provide: AuthService, useValue: { hasFeature: () => true } },
      ],
    });

    const fixture = TestBed.createComponent(AreasConfigPageComponent);
    fixture.detectChanges();

    fixture.componentInstance.openCreateDialog();
    fixture.detectChanges();

    const dialog = TestBed.inject(Dialog);
    const choiceRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof AreaMethodChoiceDialogComponent);
    expect(choiceRef).toBeTruthy();

    const choiceDialog = choiceRef!.componentInstance as AreaMethodChoiceDialogComponent;
    choiceDialog.chooseManual();
    fixture.detectChanges();

    const formRef = dialog.openDialogs.find((ref) => ref.componentInstance instanceof AreaFormDialogComponent);
    expect(formRef).toBeTruthy();

    const formDialog = formRef!.componentInstance as AreaFormDialogComponent;
    formDialog.form.patchValue({ name: 'Fundeio Norte' });
    formDialog.coordinatesArray.at(0).setValue({ lat: -23.952, lon: -46.33 });
    formDialog.coordinatesArray.at(1).setValue({ lat: -23.949, lon: -46.328 });
    formDialog.coordinatesArray.at(2).setValue({ lat: -23.9505, lon: -46.325 });
    formDialog.save();
    tick();
    fixture.detectChanges();

    expect(create).toHaveBeenCalled();

    const toastService = TestBed.inject(ToastService);
    expect(toastService.toasts()).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'success', message: expect.stringContaining('Fundeio Norte') })]),
    );
  }));
});
