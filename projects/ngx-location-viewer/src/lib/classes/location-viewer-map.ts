import { LeafletMap, LeafletMapOptions } from '@acpaas-ui/ngx-leaflet';
import { Subject } from 'rxjs';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { FeatureLayerOptions } from '../types/esri/featurelayer-options.model';
import { FilterLayerOptions } from '../types/filter-layer-options.model';
import { GeometryTypes } from '../types/geometry-types.enum';
import { Layer, LayerColor } from '../types/layer.model';
import { PopupEvents } from '../types/leaflet.types';
import { OperationalLayerOptions, OperationalMarker } from '../types/operational-layer-options.model';
import * as L from 'leaflet';
export class LocationViewerMap extends LeafletMap {
  public supportingLayer: any;
  public operationalLayer: any;
  public filterLayer: any;
  public filterLayerClicked = new Subject<any>();
  constructor(options: LeafletMapOptions, mapService: LocationViewerMapService) {
    super(options, mapService);
  }

  // Supporting layer
  addSupportingLayers(mapserverUrl: string, layerIds: number[]) {
    if (this.mapService.isAvailable()) {
      this.removeLayer(this.supportingLayer);
      this.supportingLayer = new this.mapService.esri.dynamicMapLayer({
        maxZoom: 20,
        minZoom: 0,
        url: mapserverUrl,
        opacity: 1,
        layers: layerIds,
        continuousWorld: true,
        useCors: false,
        f: 'image',
      }).addTo(this.map);
    }

    return this.supportingLayer;
  }

  // Removes layer
  removeLayer(layer: any) {
    if (this.mapService.isAvailable() && layer) {
      this.map.removeLayer(layer);
    }
  }

  // Supportinglayer will only show the provided layerids
  setVisibleLayersSupportingLayer(ids: number[]) {
    if (this.mapService.isAvailable() && this.supportingLayer) {
      this.supportingLayer.setLayers(ids);
    }
  }

  addOperationalLayer(operationalLayerOptions: OperationalLayerOptions, layer: Layer, defaultDisplayField?: string) {
    if (this.mapService.isAvailable()) {
      this.removeLayer(this.operationalLayer);
      let featureLayerOptions: FeatureLayerOptions = {
        url: `${operationalLayerOptions.url}/${operationalLayerOptions.layerId}/query`,
        minZoom: operationalLayerOptions.minZoom,
        maxZoom: operationalLayerOptions.maxZoom,
        style: null,
        pointToLayer: null,
        onEachFeature: (feature, layer) => {
          if (operationalLayerOptions.showTooltip) {
            layer.bindTooltip(this.mapService.L.Util.template(
              `{${defaultDisplayField}}`,
              feature.properties,
            ));
          }
        },
      };

      if (layer.geometryType === GeometryTypes.esriGeometryPolygon || layer.geometryType === GeometryTypes.esriGeometryPolyline)
      {
        // style is used to style lines and polygons
        featureLayerOptions.style = (feature) => {
          if (layer.colors && layer.colors.length > 0) {
            let colorItem = layer.colors[0];
            
            // check if more coloritems are avaiable to check for custom style by value
            if (layer.colors.length > 1)
            {
              const colorValue = feature.properties[layer.styleField];
              colorItem = layer.colors.find((x) => x.value === colorValue);
            }

            return  {...colorItem, ...operationalLayerOptions.layerColor};
          }
        }
      } else {
        // point to layer method is used to style points
        featureLayerOptions.pointToLayer = (feature, latlng) => {
          const legendValue = feature.properties[layer.styleField];
          const legendItem = layer.legend.find((x) => x.values && x.values.includes(legendValue));
          let iconUrl = '';
          if (legendItem) {
            iconUrl = `data:${legendItem.contentType};base64, ${legendItem.imageData}`;
          } else {
            iconUrl = `data:${layer.legend[0].contentType};base64, ${layer.legend[0].imageData}`;
          }

          const icon = this.mapService.L.icon({
            iconUrl,
            iconAnchor: [10, 10],
          });
          return this.mapService.L.marker(latlng, { icon });
        }
      }

      if (operationalLayerOptions.where != null)
        featureLayerOptions.where = operationalLayerOptions.where;

      if (operationalLayerOptions.enableClustering) {
        this.operationalLayer = new this.mapService.esri.Cluster.featureLayer(featureLayerOptions);
      } else {
        this.operationalLayer = this.mapService.esri.featureLayer(featureLayerOptions);
      }

      //update layer visibility
      if (operationalLayerOptions.isVisible != null)
        layer.visible = operationalLayerOptions.isVisible;

      if (layer.visible) {
        this.map.addLayer(this.operationalLayer);
      }
    }
  }

  addOperationalMarkers(markers: OperationalMarker[], enableClustering: boolean) {
    if (this.mapService.isAvailable()) {
      this.removeLayer(this.operationalLayer);
      if (enableClustering) {
        this.operationalLayer = this.mapService.L.markerClusterGroup();
      } else {
        this.operationalLayer = this.mapService.L.featureGroup();
      }
      markers.forEach((marker) => {
        if (marker.coordinate && marker.coordinate.lat && marker.coordinate.lon) {
          const htmlIcon = this.getHtmlMarker(marker.color, marker.icon ? `ai-${marker.icon}` : undefined, marker.size, undefined);
          const icon = this.mapService.L.divIcon({ html: htmlIcon, className: 'aui-leaflet__html-icon' });
          const leafletMarker = this.mapService.L.marker([marker.coordinate.lat, marker.coordinate.lon], { icon });
          leafletMarker.options.data = marker.data;
          this.operationalLayer.addLayer(leafletMarker);
        }
      });

      this.map.addLayer(this.operationalLayer);
    }
  }

  setVisibilityOperationalLayer(visible: boolean) {
    if (this.mapService.isAvailable && this.operationalLayer) {
      this.setVisibilityLayer(this.operationalLayer, visible);
    }
  }

  addFilterLayer(filterLayerOptions: FilterLayerOptions) {
    if (this.mapService.isAvailable()) {
      this.removeLayer(this.filterLayer);
      this.filterLayer = this.mapService.esri
        .featureLayer({
          url: `${filterLayerOptions.url}/${filterLayerOptions.layerId}/query`,
          onEachFeature: (feature, layerProp) => {
            layerProp.on('click', (e) => {
              this.filterLayerClicked.next(e);
            });
          },
        })
        .bindPopup(
          (layerInfo) => {
            return this.mapService.L.Util.template(
              `<p>${filterLayerOptions.popupLabel}: {${filterLayerOptions.propertyToDisplay}}</p>`,
              layerInfo.feature.properties,
            );
          },
          {
            closeButton: false,
          },
        );

      // removes default click behaviour ==> opening popup
      this.filterLayer.off('click');

      this.filterLayer.on('mouseover', (e) => {
        this.filterLayer.openPopup(e.layer || e.target);
      });
    }
  }

  setVisibilityFilterLayer(visible: boolean) {
    if (this.mapService.isAvailable && this.filterLayer) {
      this.setVisibilityLayer(this.filterLayer, visible);
      setTimeout(() => {
        this.filterLayer.closePopup();
      }, 200);
    }
  }

  // adds Popup to layer
  addPopupToLayer(layer, popupContent: string, onCloseRemoveLayer: boolean, extraLayer = null) {
    const popup = layer.bindPopup(() => {
      return this.mapService.L.Util.template(popupContent);
    });
    if (onCloseRemoveLayer) {
      popup.on(PopupEvents.popupclose, () => {
        this.map.removeLayer(layer);
        if (extraLayer) {
          this.map.removeLayer(extraLayer);
        }
      });
    }

    layer.openPopup();
  }

  /**
   * Defines the custom marker markup.
   */
  getHtmlMarker(
    color: string = '#0057b7',
    icon: string = 'ai-pin-3',
    size: string = '40px',
    position: { top: string; left: string } = {
      top: '-36px',
      left: '-5px',
    },
  ) {
    const markerStyle = `color: ${color}; font-size: ${size}; top: ${position.top}; left: ${position.left}`;
    const markerIcon = `<svg aria-hidden="true"><use href="#${icon}" /></svg>`;

    return `<span style="${markerStyle}" class="ai ngx-location-viewer-marker">${markerIcon}</span>`;
  }

  private setVisibilityLayer(layer, visible: boolean) {
    if (visible) {
      if (!this.map.hasLayer(layer)) {
        this.map.addLayer(layer);
      }
    } else {
      this.map.removeLayer(layer);
    }
  }
}
