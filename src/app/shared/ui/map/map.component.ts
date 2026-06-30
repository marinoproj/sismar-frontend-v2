import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div #mapContainer [style.height]="height" class="w-full rounded-lg overflow-hidden z-0"></div>
    <ng-content />
  `,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() center: [number, number] = [-15.78, -47.93];
  @Input() zoom = 5;
  @Input() height = '500px';

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;

  constructor(private readonly mapService: MapService) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.mapService.setMap(this.map);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
