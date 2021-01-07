import { Injectable } from '@angular/core';
import { GeometryTypes } from '../types/geometry-types.enum';
import { Layer } from '../types/layer.model';
import { LayerInfo } from '../types/mapserver/info-response/layer-info.model';
import { MapserverInfo } from '../types/mapserver/info-response/mapserver-info.model';
import { LayerSpecificInfo } from '../types/mapserver/layerinfo-response/layer-info.model';
import { LayerLegend } from '../types/mapserver/legend-response/layer-legend.model';
import { MapserverLegend } from '../types/mapserver/legend-response/mapserver-legend.model';

@Injectable()
export class LayerService {
    constructor() {}

    // get specific layer from info and legend
    getLayerFromLayerInfo(layerInfo: LayerSpecificInfo, legend: MapserverLegend): Layer {
        const layerLegend = legend.layers.find((x) => x.layerId === layerInfo.id);

        if (!layerLegend) {
            throw new Error(`Could not retrieve legend info for layer with id: ${layerInfo.id}`);
        }

        const layer: Layer = {
            id: layerInfo.id,
            name: layerInfo.name,
            visible: layerInfo.defaultVisibility,
            layers: [],
            legend: layerLegend.legend,
            styleField: layerInfo.drawingInfo.renderer.field1,
        };

        if (layerInfo.geometryType !== GeometryTypes.esriGeometryPoint) {
            layer.colors = layerInfo.drawingInfo.renderer.uniqueValueInfos.map((uniqueValue) => {
                let fillColor = '';
                let color = '';
                let fill = false;
                let weight = 1;
                switch (layerInfo.geometryType) {
                    case GeometryTypes.esriGeometryPolyline:
                        color = this.RGBToHex(uniqueValue.symbol.color[0], uniqueValue.symbol.color[1], uniqueValue.symbol.color[2]);
                        weight = uniqueValue.symbol.width;
                        break;
                    case GeometryTypes.esriGeometryPolygon:
                        if (uniqueValue.symbol.color) {
                            fillColor = this.RGBToHex(
                                uniqueValue.symbol.color[0],
                                uniqueValue.symbol.color[1],
                                uniqueValue.symbol.color[2],
                            );
                            fill = uniqueValue.symbol.color[3] > 0 ? true : false;
                        }
                        color = this.RGBToHex(
                            uniqueValue.symbol.outline.color[0],
                            uniqueValue.symbol.outline.color[1],
                            uniqueValue.symbol.outline.color[2],
                        );
                        weight = uniqueValue.symbol.outline.width;
                        break;
                }
                return {
                    value: uniqueValue.value,
                    weight,
                    color,
                    fillColor,
                    fill,
                };
            });
        }

        return layer;
    }

    // filter multiple layers by id
    buildLayerFromInfoAndLegend(info: MapserverInfo, legend: MapserverLegend, layerIds: number[]): Layer {
        // Build layermanagement from info (only 1 parent layer)
        // get parent layer from info layers
        const parentLayer = info.layers.filter((x) => x.parentLayerId === -1 && layerIds.indexOf(x.id) > -1);

        if (parentLayer.length === 1) {
            const layer: Layer = {
                id: parentLayer[0].id,
                name: parentLayer[0].name,
                visible: parentLayer[0].defaultVisibility,
                layers: [],
            };
            const layerLegend = legend.layers.filter((x) => x.layerId === layer.id);
            if (layerLegend.length === 1) {
                layer.legend = layerLegend[0].legend;
            }

            layer.layers = this.buildChildLayer(parentLayer[0].id, layerIds, info.layers, legend.layers);

            return layer;
        }

        return null;
    }

    /* Fetch visible layerids of layer object */
    getVisibleLayerIds(layer: Layer): number[] {
        let visibleLayerIds: number[] = [];
        if (layer.visible) {
            // Only return id if there are no sublayers, otherwise if parent id is returned, all sub layers will be shown
            if (layer.layers.length === 0) {
                visibleLayerIds.push(layer.id);
            }
            layer.layers
                .filter((x) => x.visible === true)
                .forEach((visibleSubLayer) => {
                    visibleLayerIds = [...visibleLayerIds, ...this.getVisibleLayerIds(visibleSubLayer)];
                });
        }

        return visibleLayerIds;
    }

    private buildChildLayer(parentLayerId: number, layerIds: number[], layers: LayerInfo[], layerLegend: LayerLegend[]): Layer[] {
        const childLayers: Layer[] = [];
        layers
            .filter((x) => x.parentLayerId === parentLayerId && layerIds.indexOf(x.id) > -1)
            .forEach((childLayer) => {
                // instantiate layer object
                const layer: Layer = {
                    id: childLayer.id,
                    name: childLayer.name,
                    visible: childLayer.defaultVisibility,
                    layers: [],
                };

                const childLegend = layerLegend.filter((x) => x.layerId === layer.id);
                if (childLegend.length === 1) {
                    layer.legend = childLegend[0].legend;
                }

                if (layers.filter((x) => x.parentLayerId === childLayer.id).length > 0) {
                    layer.layers = this.buildChildLayer(childLayer.id, layerIds, layers, layerLegend);
                }

                childLayers.push(layer);
            });

        return childLayers;
    }

    private RGBToHex(red: number, green: number, blue: number) {
        return `#${this.ColorToHex(red)}${this.ColorToHex(green)}${this.ColorToHex(blue)}`;
    }

    private ColorToHex(color: number) {
        const hex = color.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}
