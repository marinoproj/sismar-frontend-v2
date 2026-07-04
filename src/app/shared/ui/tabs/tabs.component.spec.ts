import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TabsComponent, TabItem } from './tabs.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [TabsComponent],
  template: `<app-tabs [tabs]="tabs" />`,
})
class HostComponent {
  tabs: TabItem[] = [
    { label: 'Geral', route: 'geral', feature: 'PORTOS' },
    { label: 'Sem feature', route: 'livre' },
    { label: 'Terminais', route: 'terminais', feature: 'PORTOS_TERMINAIS' },
  ];
}

function linkLabels(fixture: ComponentFixture<HostComponent>): string[] {
  return Array.from(fixture.nativeElement.querySelectorAll('a')).map(
    (el) => (el as HTMLElement).textContent?.trim() ?? '',
  );
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let hasFeature: jest.Mock;
  let router: Router;

  beforeEach(() => {
    hasFeature = jest.fn((feature: string) => feature === 'PORTOS');

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([{ path: '**', component: HostComponent }]),
        { provide: AuthService, useValue: { hasFeature } },
      ],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HostComponent);
  });

  it('renders a navigable link for a tab whose feature the user has', fakeAsync(() => {
    router.navigateByUrl('/ports/1/geral');
    tick();
    fixture.detectChanges();

    expect(linkLabels(fixture)).toContain('Geral');
  }));

  it('renders a tab without a declared feature as always navigable', fakeAsync(() => {
    router.navigateByUrl('/ports/1/geral');
    tick();
    fixture.detectChanges();

    expect(linkLabels(fixture)).toContain('Sem feature');
  }));

  it('renders a tab whose feature the user lacks as blocked (no link)', fakeAsync(() => {
    router.navigateByUrl('/ports/1/geral');
    tick();
    fixture.detectChanges();

    expect(linkLabels(fixture)).not.toContain('Terminais');
    const blockedSpans = Array.from(fixture.nativeElement.querySelectorAll('span')).map(
      (el) => (el as HTMLElement).textContent?.trim() ?? '',
    );
    expect(blockedSpans.some((label) => label.includes('Terminais'))).toBe(true);
  }));

  it('marks the tab matching the current URL as active', fakeAsync(() => {
    router.navigateByUrl('/ports/1/geral');
    tick();
    fixture.detectChanges();

    const geralLink = Array.from(fixture.nativeElement.querySelectorAll('a')).find(
      (el) => (el as HTMLElement).textContent?.trim() === 'Geral',
    ) as HTMLElement;
    expect(geralLink.className).toContain('text-[var(--color-primary)]');
  }));

  it('does not mark a non-matching tab as active', fakeAsync(() => {
    router.navigateByUrl('/ports/1/geral');
    tick();
    fixture.detectChanges();

    const livreLink = Array.from(fixture.nativeElement.querySelectorAll('a')).find(
      (el) => (el as HTMLElement).textContent?.trim() === 'Sem feature',
    ) as HTMLElement;
    expect(livreLink.className).not.toContain('text-[var(--color-primary)]');
  }));
});
