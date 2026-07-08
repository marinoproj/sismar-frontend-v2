import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KpiCardComponent } from './kpi-card.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';

describe('KpiCardComponent', () => {
  let fixture: ComponentFixture<KpiCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [KpiCardComponent] });
    fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentInstance.label = 'Navios no porto';
    fixture.componentInstance.value = 12;
    fixture.componentInstance.change = 5;
    fixture.componentInstance.icon = 'ri-ship-line';
  });

  it('renders the real content when not loading', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Navios no porto');
    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeFalsy();
  });

  it('renders the skeleton instead of the content when loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Navios no porto');
  });
});
