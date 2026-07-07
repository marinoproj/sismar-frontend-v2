import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map-polygon',
  standalone: true,
  template: '',
})
export class MapPolygonComponent implements OnInit, OnDestroy {
  @Input({ required: true }) points: [number, number][] = [];
  @Input() color?: string;
  @Input() dashArray?: string;
  @Input() tooltipContent?: string;

  private polygon?: L.Polygon;

  constructor(private readonly mapService: MapService) {}

  ngOnInit(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    this.polygon = L.polygon(this.points, {
      color: this.color ?? '#f59e0b',
      fillColor: this.color ?? '#f59e0b',
      fillOpacity: 0.2,
      weight: 2,
      dashArray: this.dashArray,
    });

    if (this.tooltipContent) {
      this.polygon.bindPopup(this.tooltipContent);
    }

    this.polygon.addTo(map);
  }

  ngOnDestroy(): void {
    this.polygon?.remove();
  }
}
