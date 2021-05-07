import { LayerInfo } from './layer-info.model';

export interface MapserverInfo {
  capabilities: string;
  copyrightText: string;
  currentVersion: number;
  description: string;
  documentInfo: any;
  exportTilesAllowed: boolean;
  fullExtent: any;
  initialExtent: any;
  layers: LayerInfo[];
  mapName: string;
  maxImageHeight: number;
  maxImageWidth: number;
  maxRecordCount: number;
  maxScale: number;
  minScale: number;
  serviceDescription: string;
  singleFusedMapCache: boolean;
  spatialReference: any;
  supportedExtensions: string;
  supportedImageFormatTypes: string;
  supportedQueryFormates: string;
  supportsDynamicLayers: boolean;
  tables: any;
  units: string;
}

