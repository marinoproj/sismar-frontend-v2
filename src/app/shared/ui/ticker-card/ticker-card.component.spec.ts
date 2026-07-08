import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TickerCardComponent } from './ticker-card.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';

describe('TickerCardComponent', () => {
  let fixture: ComponentFixture<TickerCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TickerCardComponent] });
    fixture = TestBed.createComponent(TickerCardComponent);
    fixture.componentInstance.symbol = 'PETR4';
    fixture.componentInstance.name = 'Petrobras';
    fixture.componentInstance.currentValue = 36.5;
    fixture.componentInstance.change = 1.2;
    fixture.componentInstance.trend = 'up';
  });

  it('renders the real content when not loading', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('PETR4');
    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeFalsy();
  });

  it('renders the skeleton instead of the content when loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('PETR4');
  });
});
