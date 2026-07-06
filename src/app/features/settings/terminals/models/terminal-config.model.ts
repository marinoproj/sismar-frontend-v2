import { PortConfig } from '../../ports/models/port-config.model';

export interface TerminalConfig {
  id: number;
  name: string;
  code: string;
  terminalType: string;
  port: PortConfig;
  imageTerminal?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface TerminalConfigFilter {
  portId?: number;
  name?: string;
}

export interface TerminalConfigInput {
  name: string;
  code: string;
  terminalType: string;
  portId: number;
  imageTerminal?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
