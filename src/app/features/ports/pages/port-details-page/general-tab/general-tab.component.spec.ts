import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GeneralTabComponent } from './general-tab.component';
import { PortsService } from '../../../services/ports.service';
import { PortDetails } from '../../../models/port.model';
import { SkeletonComponent } from '../../../../../shared/ui/skeleton/skeleton.component';
import { StatCardComponent } from '../../../../../shared/ui/stat-card/stat-card.component';
import { THEME_CONFIG, themeConfig } from '../../../../../core/config/theme.config';

describe('GeneralTabComponent', () => {
  let fixture: ComponentFixture<GeneralTabComponent>;
  let details: PortDetails | null;
  let detailsLoading: boolean;

  const buildDetails = (): PortDetails => ({
    portInfo: {
      id: 1,
      name: 'Porto de Santos',
      imagePort: '',
      country: 'Brasil',
      countryFlag: '',
      totalBerths: 10,
      occupiedBerths: 4,
      occupancyRate: 40,
    },
    operationalIndicators: {
      shipsInPort: 5,
      shipsInPortByType: { Cargo: 5 },
      shipsLast24h: 8,
      shipsLast24hByType: { Cargo: 8 },
      shipsInAnchorage: 1,
      shipsInAccessChannel: 2,
      shipsDocked: 3,
    },
  });

  function setup() {
    TestBed.configureTestingModule({
      imports: [GeneralTabComponent],
      providers: [
        {
          provide: PortsService,
          useValue: { details: () => details, detailsLoading: () => detailsLoading },
        },
        { provide: THEME_CONFIG, useValue: themeConfig },
      ],
    });
    fixture = TestBed.createComponent(GeneralTabComponent);
  }

  it('shows a skeleton and no stat cards with data while loading', () => {
    details = null;
    detailsLoading = true;
    setup();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SkeletonComponent))).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Porto de Santos');
  });

  it('renders the real content once details are loaded', () => {
    details = buildDetails();
    detailsLoading = false;
    setup();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Porto de Santos');
    const statCards = fixture.debugElement.queryAll(By.directive(StatCardComponent));
    expect(statCards.length).toBeGreaterThan(0);
    statCards.forEach((card) => expect((card.componentInstance as StatCardComponent).loading).toBe(false));
  });
});
