import { TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Subject, of } from 'rxjs';
import { RetroactiveJobDialogComponent } from './retroactive-job-dialog.component';
import { AreaService } from '../../../services/area.service';
import { AREA_REPOSITORY } from '../../../repositories/area.repository';
import { Area, RetroactiveJob } from '../../../models/area.model';

describe('RetroactiveJobDialogComponent', () => {
  const area: Area = { id: 6, name: 'Fundeio Norte', portId: 1, active: false, coordinates: [] };

  let getLastRetroactiveJob: jest.Mock;
  let triggerRetroactiveJob: jest.Mock;
  let cancelRetroactiveJob: jest.Mock;

  function setup(initialJob: RetroactiveJob | null = null, targetArea: Area = area) {
    getLastRetroactiveJob = jest.fn().mockReturnValue(of(initialJob));
    triggerRetroactiveJob = jest.fn().mockReturnValue(of(undefined));
    cancelRetroactiveJob = jest.fn().mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [RetroactiveJobDialogComponent],
      providers: [
        AreaService,
        {
          provide: AREA_REPOSITORY,
          useValue: {
            getAll: jest.fn().mockReturnValue(of([])),
            getLastRetroactiveJob,
            triggerRetroactiveJob,
            cancelRetroactiveJob,
          },
        },
        { provide: DialogRef, useValue: { close: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { area: targetArea } },
      ],
    });

    const fixture = TestBed.createComponent(RetroactiveJobDialogComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('loads the last job status on open, showing "nenhum job" when there is none', () => {
    const component = setup();

    expect(getLastRetroactiveJob).toHaveBeenCalledWith(6);
    expect(component.loadingJob()).toBe(false);
    expect(component.job()).toBeNull();
  });

  it('shows the loaded job and only allows cancel when RUNNING', () => {
    const job: RetroactiveJob = { mode: 'FULL', status: 'RUNNING', progressPercent: 40 };

    const component = setup(job);

    expect(component.job()).toEqual(job);
    expect(component.isRunning).toBe(true);
  });

  it('does not allow triggering a FULL job without periodDays', () => {
    const component = setup();

    expect(component.modeControl.value).toBe('FULL');
    expect(component.canTrigger).toBe(false);
  });

  it('allows triggering a FULL job once periodDays is set, and refreshes status after success', () => {
    const component = setup();
    component.periodDaysControl.setValue(30);

    expect(component.canTrigger).toBe(true);

    getLastRetroactiveJob.mockClear();
    component.trigger();

    expect(triggerRetroactiveJob).toHaveBeenCalledWith(6, { periodDays: 30 });
    expect(getLastRetroactiveJob).toHaveBeenCalledTimes(1);
  });

  it('allows triggering a CATCHUP job without periodDays', () => {
    const component = setup();
    component.setMode('CATCHUP');

    expect(component.canTrigger).toBe(true);

    component.trigger();

    expect(triggerRetroactiveJob).toHaveBeenCalledWith(6, { catchUp: true });
  });

  it('re-enables the trigger button on error', () => {
    const component = setup();
    component.setMode('CATCHUP');

    const requestResult$ = new Subject<void>();
    triggerRetroactiveJob.mockReturnValue(requestResult$.asObservable());

    component.trigger();
    expect(component.triggering()).toBe(true);

    requestResult$.error(new Error('já existe job em andamento'));

    expect(component.triggering()).toBe(false);
  });

  it('does not allow triggering a job for an area that is already active', () => {
    const activeArea: Area = { ...area, active: true };
    const component = setup(null, activeArea);
    component.setMode('CATCHUP');

    expect(component.canTrigger).toBe(false);

    component.trigger();

    expect(triggerRetroactiveJob).not.toHaveBeenCalled();
  });

  it('cancels the running job and refreshes status', () => {
    const component = setup({ mode: 'FULL', status: 'RUNNING' });
    getLastRetroactiveJob.mockClear();

    component.cancelJob();

    expect(cancelRetroactiveJob).toHaveBeenCalledWith(6);
    expect(getLastRetroactiveJob).toHaveBeenCalledTimes(1);
  });
});
