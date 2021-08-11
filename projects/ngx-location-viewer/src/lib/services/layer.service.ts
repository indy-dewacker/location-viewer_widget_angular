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
  constructor() { }

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
  buildSupportingLayersFromInfoAndLegend(info: MapserverInfo, legend: MapserverLegend, layerIds: number[], visible?: boolean): Layer[] {
    // get selected layers from info
    let selectedLayers = info.layers.filter((layer) => layerIds.includes(layer.id));

    let layers: Layer[] = [];
    selectedLayers.forEach((selectedLayer) => {
      const layer = this.buildLayerFromInfoAndLegend(selectedLayer, legend.layers, visible);
      layer.layers = this.buildChildLayer(layer.id, info.layers, legend.layers, visible);
      layers.push(layer);
    });

    layers = this.buildLayerTree(layers, info.layers, legend, visible);

    return layers;
  }

  /* Fetch visible layerids of layer object */
  getVisibleLayerIds(layers: Layer[]): number[] {
    let visibleLayerIds: number[] = [];
    layers
      .filter((x) => x.visible)
      .forEach((layer) => {
        // Only return id if there are no sublayers, otherwise if parent id is returned, all sub layers will be shown
        if (layer.layers.length === 0) {
          visibleLayerIds.push(layer.id);
        } else {
          visibleLayerIds = [...visibleLayerIds, ...this.getVisibleLayerIds(layer.layers)];
        }
      });

    return visibleLayerIds;
  }

  private buildLayerTree(layers: Layer[], layersInfo: LayerInfo[], legend: MapserverLegend, visible?: boolean): Layer[] {
    let layerTree: Layer[] = [];
    layers.forEach(layer => {
      const layerInfo = layersInfo.find(x => x.id === layer.id);
      if (layerInfo && layerInfo.parentLayerId !== -1) {
        //check if parent layer already present in layer array, add it to layer
        const parentLayer = layerTree.find(x => x.id === layerInfo.parentLayerId);
        if (parentLayer) {
          //check if layer already exists in parentlayern if not add layer
          if (!parentLayer.layers.some(l => l.id === layer.id)) {
            parentLayer.layers.push(layer);
          }
        } else {
          //if parent layer does not exists add new parent layer and add it to layertree
          const parentLayerInfo = layersInfo.find(x => x.id === layerInfo.parentLayerId);
          if (parentLayerInfo) {
            const newParentLayer: Layer = this.buildLayerFromInfoAndLegend(parentLayerInfo, legend.layers, visible);

            newParentLayer.layers = [layer]
            layerTree.push(newParentLayer);
          }
        }
      } else {
        layerTree.push(layer);
      }
    });

    // if there are still layers with parent repeat this function
    if (layersInfo.filter(x => layerTree.map(x => x.id).includes(x.id) && x.parentLayerId !== -1).length > 0) {
      layerTree = this.buildLayerTree(layerTree, layersInfo, legend, visible);
    }

    return layerTree;
  }

  private buildLayerFromInfoAndLegend(info: LayerInfo, legend: LayerLegend[], visible?: boolean): Layer {
    let layer: Layer;
    if (info) {
      layer = {
        id: info.id,
        name: info.name,
        visible: visible != null ? visible : info.defaultVisibility,
        layers: []
      };

      const layerLegend = legend.filter((x) => x.layerId === layer.id);
      if (layerLegend.length === 1) {
        layer.legend = layerLegend[0].legend;
      }
    }

    return layer;
  }
  private buildChildLayer(parentLayerId: number, layers: LayerInfo[], layerLegend: LayerLegend[], visible?: boolean): Layer[] {
    const childLayers: Layer[] = [];
    layers
      .filter((x) => x.parentLayerId === parentLayerId)
      .forEach((childLayer) => {
        const layer = this.buildLayerFromInfoAndLegend(childLayer, layerLegend, visible);

        if (layers.filter((x) => x.parentLayerId === childLayer.id).length > 0) {
          layer.layers = this.buildChildLayer(childLayer.id, layers, layerLegend);
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
