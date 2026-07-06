import { TerminalConfig } from '../../terminals/models/terminal-config.model';
import { Area } from './area.model';

export interface BerthConfig {
  id: number;
  name: string;
  terminal: TerminalConfig;
  area?: Area | null;
  length?: number | null;
  draft?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  imageBerth?: string | null;
}

export interface BerthConfigFilter {
  name?: string;
}

export interface BerthConfigInput {
  name: string;
  terminalId: number;
  areaId?: number | null;
  length?: number | null;
  draft?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  imageBerth?: string | null;
}
