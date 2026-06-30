import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map-marker',
  standalone: true,
  template: '',
})
export class MapMarkerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) lat = 0;
  @Input({ required: true }) lng = 0;
  @Input() title?: string;
  @Input() popupContent?: string;

  private marker?: L.Marker;

  constructor(private readonly mapService: MapService) {}

  ngOnInit(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    this.marker = L.marker([this.lat, this.lng], {
      title: this.title,
    });

    if (this.popupContent) {
      this.marker.bindPopup(this.popupContent);
    }

    this.marker.addTo(map);
  }

  ngOnDestroy(): void {
    this.marker?.remove();
  }
}
