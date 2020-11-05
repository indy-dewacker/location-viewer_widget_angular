import { LayerLegendInfo } from './layer-legend-info.model';

export interface LayerLegend {
    layerId: number;
    layerName: string;
    layerType: string;
    legend: LayerLegendInfo[];
    maxScale: number;
    minScale: number;
}
