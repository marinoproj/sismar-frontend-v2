import { Area } from '../../../models/area.model';

export function toLatLngPoints(area: Area): [number, number][] {
  return area.coordinates.map((coord) => [coord.lat, coord.lon]);
}

export function activeAreas(areas: Area[]): Area[] {
  return areas.filter((area) => area.active);
}

export function activeAreaPoints(areas: Area[]): [number, number][] {
  return activeAreas(areas).flatMap((area) => toLatLngPoints(area));
}
