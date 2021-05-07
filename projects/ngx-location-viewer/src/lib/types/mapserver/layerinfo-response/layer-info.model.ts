export interface LayerSpecificInfo {
  id: number;
  name: string;
  defaultVisibility: boolean;
  drawingInfo: LayerDrawingInfo;
  geometryType: string;
  displayField: string;
}

export interface LayerDrawingInfo {
  renderer: LayerRendererInfo;
}

export interface LayerRendererInfo {
  field1: string;
  uniqueValueInfos: LayerUniqueValueInfo[];
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
