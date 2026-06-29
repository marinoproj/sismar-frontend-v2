export interface ChartData {
  name: string;
  data: (number | [number, number] | { x: string | number; y: number })[];
}

export interface MixedChartData extends ChartData {
  type: 'line' | 'bar' | 'area';
}

export interface TimelineData {
  name: string;
  data: { x: string; y: [number, number] }[];
}
