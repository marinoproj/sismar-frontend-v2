import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map-circle',
  standalone: true,
  template: '',
})
export class MapCircleComponent implements OnInit, OnDestroy {
  @Input({ required: true }) center: [number, number] = [0, 0];
  @Input({ required: true }) radius = 50000;
  @Input() color?: string;
  @Input() tooltipContent?: string;

  private circle?: L.Circle;

  constructor(private readonly mapService: MapService) {}

  ngOnInit(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    this.circle = L.circle(this.center, {
      radius: this.radius,
      color: this.color ?? '#6366f1',
      fillColor: this.color ?? '#6366f1',
      fillOpacity: 0.15,
      weight: 2,
    });

    if (this.tooltipContent) {
      this.circle.bindPopup(this.tooltipContent);
    }

    this.circle.addTo(map);
  }

  ngOnDestroy(): void {
    this.circle?.remove();
  }
}
