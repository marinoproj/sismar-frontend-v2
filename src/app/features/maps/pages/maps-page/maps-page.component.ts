import { Component } from '@angular/core';
import { MapComponent } from '../../../../shared/ui/map/map.component';
import { MapMarkerComponent } from '../../../../shared/ui/map/map-marker.component';
import { MapCircleComponent } from '../../../../shared/ui/map/map-circle.component';
import { MapPolygonComponent } from '../../../../shared/ui/map/map-polygon.component';
import { MapService } from '../../../../shared/ui/map/map.service';

@Component({
  selector: 'app-maps-page',
  standalone: true,
  providers: [MapService],
  imports: [MapComponent, MapMarkerComponent, MapCircleComponent, MapPolygonComponent],
  templateUrl: './maps-page.component.html',
})
export class MapsPageComponent {
  readonly markers: { lat: number; lng: number; title: string; popup?: string }[] = [
    { lat: -23.55, lng: -46.63, title: 'São Paulo', popup: '<b>São Paulo — Filial SP</b><br>Av. Paulista, 1000' },
    { lat: -22.91, lng: -43.17, title: 'Rio de Janeiro', popup: '<b>Rio de Janeiro — Filial RJ</b><br>Rua das Flores, 250' },
    { lat: -19.92, lng: -43.94, title: 'Belo Horizonte', popup: '<b>Belo Horizonte — Filial MG</b><br>Savassi, 500' },
    { lat: -8.05, lng: -34.88, title: 'Recife', popup: '<b>Recife — Filial PE</b><br>Boa Viagem, 120' },
    { lat: -15.78, lng: -47.93, title: 'Brasília' },
  ];

  readonly circles: { center: [number, number]; radius: number; color: string; tooltip?: string }[] = [
    {
      center: [-19.92, -43.94],
      radius: 200000,
      color: '#6366f1',
      tooltip: '<b>Cobertura BH</b><br>Raio de 200 km ao redor de Belo Horizonte',
    },
    {
      center: [-8.05, -34.88],
      radius: 150000,
      color: '#10b981',
      tooltip: '<b>Cobertura Recife</b><br>Raio de 150 km ao redor de Recife',
    },
  ];

  readonly polygon: [number, number][] = [
    [-10.0, -55.0],
    [-15.0, -45.0],
    [-20.0, -55.0],
  ];
}
