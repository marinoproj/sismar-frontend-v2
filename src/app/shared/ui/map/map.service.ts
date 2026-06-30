import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MapService {
  private map: L.Map | null = null;

  setMap(map: L.Map): void {
    this.map = map;
  }

  getMap(): L.Map | null {
    return this.map;
  }
}
