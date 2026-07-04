export interface PortSummary {
  id: number;
  name: string;
  imagePort: string;
  country: string;
  countryFlag: string;
  shipsInPort: number;
  lastEquipmentUpdate: string | null;
}

export interface PortInfo {
  id: number;
  name: string;
  imagePort: string;
  country: string;
  countryFlag: string;
  totalBerths: number;
  occupiedBerths: number;
  occupancyRate: number;
}

export interface OperationalIndicators {
  shipsInPort: number;
  shipsInPortByType: Record<string, number>;
  shipsLast24h: number;
  shipsLast24hByType: Record<string, number>;
  shipsInAnchorage: number;
  shipsInAccessChannel: number;
  shipsDocked: number;
}

export interface PortDetails {
  portInfo: PortInfo;
  operationalIndicators: OperationalIndicators;
}
