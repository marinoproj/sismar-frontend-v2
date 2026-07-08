import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SkeletonComponent] });
    fixture = TestBed.createComponent(SkeletonComponent);
  });

  it('defaults to the "card" variant', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.rounded-full'))).toBeTruthy();
  });

  it('renders a single pulsing block sized by height for the "chart" variant', () => {
    fixture.componentInstance.variant = 'chart';
    fixture.componentInstance.height = 200;
    fixture.detectChanges();

    const block = fixture.debugElement.query(By.css('.animate-pulse'));
    expect(block).toBeTruthy();
    expect(block.nativeElement.style.height).toBe('200px');
    expect(fixture.debugElement.query(By.css('.rounded-full'))).toBeFalsy();
  });
});
