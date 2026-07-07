import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../../../../../shared/ui/map/map.service';
import { areaLabelHtml } from './area-map-style';

/**
 * Rótulo de texto sempre visível (não depende de clique), usado para exibir
 * o nome da área (e um badge "Inativo" quando aplicável) junto ao primeiro
 * vértice do seu perímetro no mapa.
 */
@Component({
  selector: 'app-area-name-label',
  standalone: true,
  template: '',
})
export class AreaNameLabelComponent implements OnInit, OnDestroy {
  @Input({ required: true }) position: [number, number] = [0, 0];
  @Input({ required: true }) name = '';
  @Input() active = true;

  private marker?: L.Marker;

  constructor(private readonly mapService: MapService) {}

  ngOnInit(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    this.marker = L.marker(this.position, {
      icon: L.divIcon({
        className: 'area-name-label',
        // Estilo inline (não classes Tailwind): este HTML é inserido via innerHTML pelo Leaflet,
        // fora do template Angular, então não pode depender do CSS/variáveis de tema do app.
        html: areaLabelHtml(this.name, this.active),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
      interactive: false,
    });
    this.marker.addTo(map);
  }

  ngOnDestroy(): void {
    this.marker?.remove();
  }
}
