export type TableRow = Record<string, string | number>;

export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  AREA = 'area',
  PIE = 'pie',
  SCATTER = 'scatter',
  TABLE = 'table'
}

export interface ChartConfig {
  title: string;
  type: ChartType;
  xKey: string;
  yKey: string | string[]; // yKey can be an array for multi-line/bar charts
  categoryKey?: string; // For pie charts
}

export type DashboardConfig = ChartConfig[];

// Fix: Add global declarations for libraries attached to the window object.
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    Papa: any;
    XLSX: any;
    jspdf: any;
  }
}
