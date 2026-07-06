import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../../../../../shared/ui/map/map.service';

/**
 * Rótulo de texto sempre visível (não depende de clique), usado para exibir
 * o nome da área junto ao primeiro vértice do seu perímetro no mapa.
 */
@Component({
  selector: 'app-area-name-label',
  standalone: true,
  template: '',
})
export class AreaNameLabelComponent implements OnInit, OnDestroy {
  @Input({ required: true }) position: [number, number] = [0, 0];
  @Input({ required: true }) name = '';

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
        html: `<span style="display:inline-block;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.9);color:#111827;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.3);">${this.escapeHtml(this.name)}</span>`,
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

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
