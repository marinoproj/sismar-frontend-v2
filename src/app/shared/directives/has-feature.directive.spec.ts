import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HasFeatureDirective } from './has-feature.directive';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [HasFeatureDirective],
  template: `<button *appHasFeature="'AREA_EDIT'">Editar</button>`,
})
class HostComponent {}

describe('HasFeatureDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let hasFeature: jest.Mock;

  beforeEach(() => {
    hasFeature = jest.fn().mockReturnValue(false);

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: AuthService, useValue: { hasFeature } }],
    });

    fixture = TestBed.createComponent(HostComponent);
  });

  it('does not render the element when the feature is absent', () => {
    fixture.detectChanges();
    TestBed.flushEffects();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('renders the element when the feature is present', () => {
    hasFeature.mockReturnValue(true);
    fixture.detectChanges();
    TestBed.flushEffects();

    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
  });
});
