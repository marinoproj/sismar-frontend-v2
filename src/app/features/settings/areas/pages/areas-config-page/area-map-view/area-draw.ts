import { AreaCoordinate } from '../../../models/area.model';

/** Tolerância (em pixels de tela) para considerar um clique "próximo o suficiente" do primeiro vértice. */
export const CLOSE_PROXIMITY_PX = 15;

/** Quantidade mínima de vértices únicos antes de permitir fechar o polígono por proximidade. */
export const MIN_DRAW_POINTS_TO_CLOSE = 3;

export interface ScreenPoint {
  x: number;
  y: number;
}

export function isCloseEnoughToClose(
  point: ScreenPoint,
  firstPoint: ScreenPoint,
  currentPointCount: number,
  tolerancePx = CLOSE_PROXIMITY_PX,
): boolean {
  if (currentPointCount < MIN_DRAW_POINTS_TO_CLOSE) return false;
  const dx = point.x - firstPoint.x;
  const dy = point.y - firstPoint.y;
  return Math.sqrt(dx * dx + dy * dy) <= tolerancePx;
}

/** Fecha o polígono repetindo a primeira coordenada como última (convenção adotada para o payload da API). */
export function closePolygonCoordinates(points: AreaCoordinate[]): AreaCoordinate[] {
  if (points.length === 0) return points;
  return [...points, points[0]];
}
