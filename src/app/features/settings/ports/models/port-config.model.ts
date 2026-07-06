export interface PortConfig {
  id: number;
  name: string;
  imagePort: string;
  countryFlag: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PortConfigFilter {
  name?: string;
}

export type PortConfigInput = Omit<PortConfig, 'id'>;
