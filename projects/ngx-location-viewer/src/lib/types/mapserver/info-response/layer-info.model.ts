export interface LayerInfo {
  id: number;
  name: string;
  parentLayerId: number;
  defaultVisibility: boolean;
  subLayerIds: number[];
}
