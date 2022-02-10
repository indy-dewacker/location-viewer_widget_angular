import { Layer } from './layer.model';

export interface Layers {
  operationalLayer: Layer;
  supportingLayers: Layer[];
}
