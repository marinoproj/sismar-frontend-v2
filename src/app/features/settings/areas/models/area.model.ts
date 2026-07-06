export interface AreaCoordinate {
  lat: number;
  lon: number;
}

export interface Area {
  id: number;
  name: string;
  coordinates: AreaCoordinate[];
  portId?: number | null;
  active: boolean;
}

export interface AreaInput {
  name: string;
  coordinates: AreaCoordinate[];
  portId?: number | null;
}

export type RetroactiveJobMode = 'FULL' | 'CATCHUP';
export type RetroactiveJobStatus = 'PENDING' | 'RUNNING' | 'DONE' | 'CANCELLING' | 'CANCELLED' | 'ERROR';

export interface RetroactiveJob {
  mode: RetroactiveJobMode;
  status: RetroactiveJobStatus;
  dhPeriodStart?: string | null;
  dhPeriodEnd?: string | null;
  mmsisTotal?: number | null;
  mmsisProcessed?: number | null;
  progressPercent?: number | null;
  objectAreasCreated?: number | null;
  errorMessage?: string | null;
}

export interface TriggerRetroactiveJobInput {
  periodDays?: number;
  catchUp?: boolean;
}
