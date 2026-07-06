import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  host: { class: 'block w-full' },
  template: `
    <div #mapContainer [style.height]="height" class="w-full z-0"></div>
    <ng-content />
  `,
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() center: [number, number] = [-15.78, -47.93];
  @Input() zoom = 5;
  @Input() height = '500px';

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;

  constructor(private readonly mapService: MapService) {}

  ngOnInit(): void {
    // Precisa rodar antes do ngOnInit dos filhos projetados via <ng-content> (ex.: app-map-polygon),
    // que já leem mapService.getMap() no próprio ngOnInit — em ngAfterViewInit seria tarde demais.
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.mapService.setMap(this.map);

    setTimeout(() => this.map.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
