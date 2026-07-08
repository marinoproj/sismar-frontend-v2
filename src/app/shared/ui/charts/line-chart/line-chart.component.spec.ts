import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LineChartComponent } from './line-chart.component';
import { SkeletonComponent } from '../../skeleton/skeleton.component';
import { THEME_CONFIG, themeConfig } from '../../../../core/config/theme.config';

describe('LineChartComponent', () => {
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LineChartComponent],
      providers: [{ provide: THEME_CONFIG, useValue: themeConfig }],
    });
    fixture = TestBed.createComponent(LineChartComponent);
    fixture.componentInstance.data = [{ name: 'Série A', data: [1, 2, 3] }];
    fixture.componentInstance.title = 'Navios por dia';
  });

  it('renders the chart when not loading', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('apx-chart'))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeFalsy();
  });

  it('renders the skeleton instead of the chart when loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('apx-chart'))).toBeFalsy();
  });
});
