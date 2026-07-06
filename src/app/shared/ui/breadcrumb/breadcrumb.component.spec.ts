import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  function createRoute(children: Partial<ActivatedRoute>[]): ActivatedRoute {
    return { children } as unknown as ActivatedRoute;
  }

  function setup(root: ActivatedRoute) {
    TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [{ provide: ActivatedRoute, useValue: { root } }],
    });
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('skips child routes whose snapshot has not resolved yet (lazy-loaded route mid-navigation)', () => {
    const root = createRoute([
      { snapshot: undefined, children: [] },
      {
        snapshot: { url: [{ path: 'berths' }], data: { breadcrumb: 'Berços' } } as never,
        children: [],
      },
    ]);

    const component = setup(root);

    expect(component.breadcrumbs()).toEqual([{ label: 'Berços', url: '/berths' }]);
  });
});
