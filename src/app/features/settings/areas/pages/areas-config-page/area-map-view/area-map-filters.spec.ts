import {
  allPortFilterIds,
  derivePortFilterOptions,
  filterAreasForMap,
  matchesAreaMapFilters,
} from './area-map-filters';
import { Area } from '../../../models/area.model';

describe('area-map-filters', () => {
  const activeWithPort: Area = { id: 1, name: 'Fundeio Norte', active: true, portId: 1, coordinates: [] };
  const inactiveWithPort: Area = { id: 2, name: 'Canal de Acesso', active: false, portId: 1, coordinates: [] };
  const activeOtherPort: Area = { id: 3, name: 'Fundeio Sul', active: true, portId: 2, coordinates: [] };
  const noPortArea: Area = { id: 4, name: 'Área avulsa', active: true, coordinates: [] };

  const ports = [
    { id: 1, name: 'Porto de Santos' },
    { id: 2, name: 'Porto de Paranaguá' },
    { id: 3, name: 'Porto sem áreas' },
  ];

  describe('derivePortFilterOptions', () => {
    it('lists only ports with at least one area, plus the fixed "Sem porto" option', () => {
      const options = derivePortFilterOptions(
        [activeWithPort, inactiveWithPort, activeOtherPort, noPortArea],
        ports,
      );

      expect(options).toEqual([
        { id: 1, label: 'Porto de Santos' },
        { id: 2, label: 'Porto de Paranaguá' },
        { id: null, label: 'Sem porto' },
      ]);
    });

    it('still includes "Sem porto" even when every area has a port', () => {
      const options = derivePortFilterOptions([activeWithPort], ports);
      expect(options).toContainEqual({ id: null, label: 'Sem porto' });
    });
  });

  describe('matchesAreaMapFilters / filterAreasForMap', () => {
    const allOptions = derivePortFilterOptions(
      [activeWithPort, inactiveWithPort, activeOtherPort, noPortArea],
      ports,
    );
    const allPortIds = allPortFilterIds(allOptions);

    it('shows everything by default (both statuses, all ports)', () => {
      const filters = { showActive: true, showInactive: true, selectedPortIds: allPortIds };
      expect(filterAreasForMap([activeWithPort, inactiveWithPort, activeOtherPort, noPortArea], filters)).toEqual([
        activeWithPort,
        inactiveWithPort,
        activeOtherPort,
        noPortArea,
      ]);
    });

    it('hides inactive areas when showInactive is false, without affecting active ones', () => {
      const filters = { showActive: true, showInactive: false, selectedPortIds: allPortIds };
      expect(filterAreasForMap([activeWithPort, inactiveWithPort], filters)).toEqual([activeWithPort]);
    });

    it('hides active areas when showActive is false, without affecting inactive ones', () => {
      const filters = { showActive: false, showInactive: true, selectedPortIds: allPortIds };
      expect(filterAreasForMap([activeWithPort, inactiveWithPort], filters)).toEqual([inactiveWithPort]);
    });

    it('filters by port, only keeping areas from selected ports', () => {
      const filters = { showActive: true, showInactive: true, selectedPortIds: new Set<number | null>([1]) };
      expect(filterAreasForMap([activeWithPort, activeOtherPort], filters)).toEqual([activeWithPort]);
    });

    it('treats areas without a port as matching the "Sem porto" (null) option', () => {
      const filters = { showActive: true, showInactive: true, selectedPortIds: new Set<number | null>([null]) };
      expect(matchesAreaMapFilters(noPortArea, filters)).toBe(true);
      expect(matchesAreaMapFilters(activeWithPort, filters)).toBe(false);
    });

    it('combines status and port filters (an area must satisfy both)', () => {
      const filters = { showActive: true, showInactive: false, selectedPortIds: new Set<number | null>([1]) };
      expect(matchesAreaMapFilters(activeWithPort, filters)).toBe(true);
      expect(matchesAreaMapFilters(inactiveWithPort, filters)).toBe(false); // fails status
      expect(matchesAreaMapFilters(activeOtherPort, filters)).toBe(false); // fails port
    });
  });
});
