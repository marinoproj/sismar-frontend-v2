import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { MapComponent } from '../../../../../../shared/ui/map/map.component';
import { MapPolygonComponent } from '../../../../../../shared/ui/map/map-polygon.component';
import { MapService } from '../../../../../../shared/ui/map/map.service';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { Area, AreaCoordinate } from '../../../models/area.model';
import { PortConfig } from '../../../../ports/models/port-config.model';
import { AreaNameLabelComponent } from './area-name-label.component';
import { areaPoints, toLatLngPoints } from './area-map-bounds';
import { areaPolygonStyle } from './area-map-style';
import {
  allPortFilterIds,
  derivePortFilterOptions,
  filterAreasForMap,
  PortFilterOption,
} from './area-map-filters';
import { closePolygonCoordinates, isCloseEnoughToClose, MIN_DRAW_POINTS_TO_CLOSE } from './area-draw';

const DEFAULT_CENTER: [number, number] = [-15.78, -47.93];
const DEFAULT_ZOOM = 5;
const FIT_BOUNDS_PADDING: L.PointTuple = [24, 24];

@Component({
  selector: 'app-area-map-view',
  standalone: true,
  providers: [MapService],
  imports: [MapComponent, MapPolygonComponent, AreaNameLabelComponent, ButtonComponent],
  templateUrl: './area-map-view.component.html',
})
export class AreaMapViewComponent implements AfterViewInit, OnChanges, OnDestroy {
  private readonly mapService = inject(MapService);

  @Input({ required: true }) areas: Area[] = [];
  @Input() ports: PortConfig[] = [];

  /** Incrementar este valor (ex.: startDrawingRequestId + 1) solicita o início de um novo desenho, mesmo que o anterior tenha sido cancelado. */
  @Input() startDrawingRequestId = 0;

  @Output() drawFinished = new EventEmitter<AreaCoordinate[]>();

  readonly defaultCenter = DEFAULT_CENTER;
  readonly defaultZoom = DEFAULT_ZOOM;

  readonly isDrawing = signal(false);
  readonly draftVertexCount = signal(0);
  readonly closeHintActive = signal(false);
  readonly minPointsToClose = MIN_DRAW_POINTS_TO_CLOSE;

  readonly filtersCollapsed = signal(false);
  readonly showActive = signal(true);
  readonly showInactive = signal(true);
  private readonly selectedPortIds = signal<Set<number | null> | null>(null);

  private mapReady = false;
  private pendingBeginDrawing = false;
  private lastHandledDrawingRequestId = 0;

  private draftPoints: L.LatLng[] = [];
  private draftMarkers: L.CircleMarker[] = [];
  private draftPolyline?: L.Polyline;
  private mapClickHandler?: (event: L.LeafletMouseEvent) => void;
  private mapMouseMoveHandler?: (event: L.LeafletMouseEvent) => void;
  private keydownHandler?: (event: KeyboardEvent) => void;

  get portFilterOptions(): PortFilterOption[] {
    return derivePortFilterOptions(this.areas, this.ports);
  }

  get visibleAreas(): Area[] {
    return filterAreasForMap(this.areas, {
      showActive: this.showActive(),
      showInactive: this.showInactive(),
      selectedPortIds: this.effectiveSelectedPortIds(),
    });
  }

  isPortSelected(id: number | null): boolean {
    return this.effectiveSelectedPortIds().has(id);
  }

  toggleActiveFilter(): void {
    this.showActive.update((v) => !v);
    this.fitBoundsToVisibleAreas();
  }

  toggleInactiveFilter(): void {
    this.showInactive.update((v) => !v);
    this.fitBoundsToVisibleAreas();
  }

  togglePortFilter(id: number | null): void {
    const next = new Set(this.effectiveSelectedPortIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selectedPortIds.set(next);
    this.fitBoundsToVisibleAreas();
  }

  private effectiveSelectedPortIds(): Set<number | null> {
    return this.selectedPortIds() ?? allPortFilterIds(this.portFilterOptions);
  }

  polygonPoints(area: Area): [number, number][] {
    return toLatLngPoints(area);
  }

  polygonColor(area: Area): string {
    return areaPolygonStyle(area.active).color;
  }

  polygonDashArray(area: Area): string | undefined {
    return areaPolygonStyle(area.active).dashArray;
  }

  ngAfterViewInit(): void {
    this.mapReady = true;
    this.fitBoundsToVisibleAreas();
    if (this.pendingBeginDrawing) {
      this.pendingBeginDrawing = false;
      this.beginDrawing();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areas'] && this.mapReady) {
      this.fitBoundsToVisibleAreas();
    }
    if (
      changes['startDrawingRequestId'] &&
      this.startDrawingRequestId > 0 &&
      this.startDrawingRequestId !== this.lastHandledDrawingRequestId
    ) {
      this.lastHandledDrawingRequestId = this.startDrawingRequestId;
      this.tryBeginDrawing();
    }
  }

  ngOnDestroy(): void {
    this.teardownDrawing();
  }

  beginDrawing(): void {
    const map = this.mapService.getMap();
    if (!map) {
      this.pendingBeginDrawing = true;
      return;
    }
    if (this.isDrawing()) return;

    this.isDrawing.set(true);
    this.draftPoints = [];
    this.draftVertexCount.set(0);
    this.closeHintActive.set(false);

    this.draftPolyline = L.polyline([], { color: '#22c55e', weight: 2, dashArray: '6 4' }).addTo(map);

    this.mapClickHandler = (event) => this.handleMapClick(event);
    this.mapMouseMoveHandler = (event) => this.handleMouseMove(event);
    this.keydownHandler = (event) => this.handleKeyDown(event);

    map.on('click', this.mapClickHandler);
    map.on('mousemove', this.mapMouseMoveHandler);
    document.addEventListener('keydown', this.keydownHandler);
  }

  cancelDrawing(): void {
    this.teardownDrawing();
  }

  private tryBeginDrawing(): void {
    if (this.mapReady) {
      this.beginDrawing();
    } else {
      this.pendingBeginDrawing = true;
    }
  }

  private handleMapClick(event: L.LeafletMouseEvent): void {
    const map = this.mapService.getMap();
    if (!map) return;

    if (this.draftPoints.length >= MIN_DRAW_POINTS_TO_CLOSE) {
      const firstScreenPoint = map.latLngToContainerPoint(this.draftPoints[0]);
      const clickScreenPoint = map.latLngToContainerPoint(event.latlng);
      if (isCloseEnoughToClose(clickScreenPoint, firstScreenPoint, this.draftPoints.length)) {
        this.finishDrawing();
        return;
      }
    }

    this.addVertex(event.latlng);
  }

  private addVertex(latlng: L.LatLng): void {
    const map = this.mapService.getMap();
    if (!map) return;

    this.draftPoints.push(latlng);
    this.draftVertexCount.set(this.draftPoints.length);

    const marker = L.circleMarker(latlng, {
      radius: 6,
      color: '#16a34a',
      fillColor: '#22c55e',
      fillOpacity: 1,
    }).addTo(map);
    this.draftMarkers.push(marker);

    this.draftPolyline?.setLatLngs(this.draftPoints);
  }

  private handleMouseMove(event: L.LeafletMouseEvent): void {
    const map = this.mapService.getMap();
    if (!map || this.draftPoints.length < MIN_DRAW_POINTS_TO_CLOSE) {
      this.closeHintActive.set(false);
      return;
    }

    const firstScreenPoint = map.latLngToContainerPoint(this.draftPoints[0]);
    const cursorScreenPoint = map.latLngToContainerPoint(event.latlng);
    const close = isCloseEnoughToClose(cursorScreenPoint, firstScreenPoint, this.draftPoints.length);
    this.closeHintActive.set(close);

    this.draftMarkers[0]?.setStyle({
      radius: close ? 10 : 6,
      color: close ? '#facc15' : '#16a34a',
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cancelDrawing();
    }
  }

  private finishDrawing(): void {
    const closed = closePolygonCoordinates(this.draftPoints.map((p) => ({ lat: p.lat, lon: p.lng })));
    this.teardownDrawing();
    this.drawFinished.emit(closed);
  }

  private teardownDrawing(): void {
    const map = this.mapService.getMap();
    if (map) {
      if (this.mapClickHandler) map.off('click', this.mapClickHandler);
      if (this.mapMouseMoveHandler) map.off('mousemove', this.mapMouseMoveHandler);
    }
    if (this.keydownHandler) document.removeEventListener('keydown', this.keydownHandler);

    this.draftPolyline?.remove();
    this.draftPolyline = undefined;
    this.draftMarkers.forEach((marker) => marker.remove());
    this.draftMarkers = [];
    this.draftPoints = [];
    this.draftVertexCount.set(0);
    this.closeHintActive.set(false);
    this.isDrawing.set(false);
    this.mapClickHandler = undefined;
    this.mapMouseMoveHandler = undefined;
    this.keydownHandler = undefined;
  }

  private fitBoundsToVisibleAreas(): void {
    const map = this.mapService.getMap();
    if (!map) return;

    const points = areaPoints(this.visibleAreas);
    if (points.length === 0) return;

    // Adiado: logo após a criação, o container do mapa pode ainda não ter o tamanho
    // final do layout, o que faz o Leaflet calcular um zoom errado para os bounds.
    // invalidateSize() força a releitura do tamanho real antes de ajustar o zoom.
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(points), { padding: FIT_BOUNDS_PADDING });
    }, 0);
  }
}
