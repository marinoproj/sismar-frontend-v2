import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StatCardComponent } from './stat-card.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatCardComponent] });
    fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentInstance.label = 'Berços ocupados';
    fixture.componentInstance.value = 8;
    fixture.componentInstance.icon = 'ri-anchor-line';
  });

  it('renders the real content when not loading', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Berços ocupados');
    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeFalsy();
  });

  it('renders the skeleton instead of the content when loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Berços ocupados');
  });
});
