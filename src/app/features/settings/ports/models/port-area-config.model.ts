import { Area } from '../../areas/models/area.model';

export interface PortAreaConfigDetail {
  anchorageAreas: Area[];
  accessChannelArea: Area | null;
  portArea: Area | null;
}

export interface PortAreaConfigInput {
  anchorageAreaIds: number[];
  accessChannelAreaId?: number | null;
  portAreaId?: number | null;
}
