export interface SupportingLayerOptions {
    url: string;
    layerIds: number[];
    //overrides the default visibility property of layer on mapserver: for all layers (true: visible, false:hidden)
    visible?: boolean;
}
