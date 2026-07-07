import { Area } from '../../../models/area.model';

export function toLatLngPoints(area: Area): [number, number][] {
  return area.coordinates.map((coord) => [coord.lat, coord.lon]);
}

export function areaPoints(areas: Area[]): [number, number][] {
  return areas.flatMap((area) => toLatLngPoints(area));
}
