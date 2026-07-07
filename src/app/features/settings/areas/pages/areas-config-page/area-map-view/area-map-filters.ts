import { Area } from '../../../models/area.model';

export interface PortFilterOption {
  id: number | null;
  label: string;
}

export interface AreaMapFilters {
  showActive: boolean;
  showInactive: boolean;
  selectedPortIds: ReadonlySet<number | null>;
}

const NO_PORT_OPTION: PortFilterOption = { id: null, label: 'Sem porto' };

export function derivePortFilterOptions(areas: Area[], ports: { id: number; name: string }[]): PortFilterOption[] {
  const portIdsWithAreas = new Set(
    areas.map((area) => area.portId ?? null).filter((id): id is number => id !== null),
  );
  const options = ports
    .filter((port) => portIdsWithAreas.has(port.id))
    .map((port) => ({ id: port.id, label: port.name }));
  return [...options, NO_PORT_OPTION];
}

export function allPortFilterIds(options: PortFilterOption[]): Set<number | null> {
  return new Set(options.map((option) => option.id));
}

export function matchesAreaMapFilters(area: Area, filters: AreaMapFilters): boolean {
  const statusOk = area.active ? filters.showActive : filters.showInactive;
  if (!statusOk) return false;
  return filters.selectedPortIds.has(area.portId ?? null);
}

export function filterAreasForMap(areas: Area[], filters: AreaMapFilters): Area[] {
  return areas.filter((area) => matchesAreaMapFilters(area, filters));
}
