import { activeAreaPoints, activeAreas, toLatLngPoints } from './area-map-bounds';
import { Area } from '../../../models/area.model';

describe('area-map-bounds', () => {
  const active: Area = {
    id: 1,
    name: 'Fundeio Norte',
    active: true,
    portId: 1,
    coordinates: [
      { lat: -23.952, lon: -46.33 },
      { lat: -23.949, lon: -46.328 },
      { lat: -23.9505, lon: -46.325 },
      { lat: -23.952, lon: -46.33 },
    ],
  };

  const inactive: Area = {
    id: 2,
    name: 'Canal de Acesso',
    active: false,
    portId: 1,
    coordinates: [
      { lat: -10, lon: -50 },
      { lat: -11, lon: -51 },
      { lat: -12, lon: -52 },
    ],
  };

  it('converts an area coordinates to [lat, lon] tuples', () => {
    expect(toLatLngPoints(active)).toEqual([
      [-23.952, -46.33],
      [-23.949, -46.328],
      [-23.9505, -46.325],
      [-23.952, -46.33],
    ]);
  });

  it('filters only active areas', () => {
    expect(activeAreas([active, inactive])).toEqual([active]);
  });

  it('collects points only from active areas, ignoring inactive ones', () => {
    expect(activeAreaPoints([active, inactive])).toEqual(toLatLngPoints(active));
  });

  it('returns an empty array when there are no active areas', () => {
    expect(activeAreaPoints([inactive])).toEqual([]);
  });
});
