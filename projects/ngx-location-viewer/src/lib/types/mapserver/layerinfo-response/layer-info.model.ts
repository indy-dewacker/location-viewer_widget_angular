import { GeometryTypes } from '../../geometry-types.enum';

export interface LayerSpecificInfo {
  id: number;
  name: string;
  defaultVisibility: boolean;
  drawingInfo: LayerDrawingInfo;
  geometryType: GeometryTypes;
  displayField: string;
}

export interface LayerDrawingInfo {
  renderer: LayerRendererInfo;
  transparancy: number;
}

export interface LayerRendererInfo {
  field1: string;
  type: DrawingInfoType;
  uniqueValueInfos?: LayerUniqueValueInfo[];
  symbol?: LayerSymbolInfo;
}

export interface LayerUniqueValueInfo {
  symbol: LayerSymbolInfo;
  value: string;
  label: string;
}

export interface LayerSymbolInfo {
  contentType?: string;
  imageData?: string;
  height?: number;
  url?: string;
  width?: number;
  color?: number[];
  outline?: LayerSymbolOutline;
}

export interface LayerSymbolOutline {
  color?: number[];
  width?: number;
}

export enum DrawingInfoType {
  SIMPLE = 'simple',
  UNIQUEVALUE = 'uniqueValue'
}