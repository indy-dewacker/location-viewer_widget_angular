import { LeafletMap, LeafletMapOptions } from '@acpaas-ui/ngx-components/map';
import { Subject } from 'rxjs';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { FilterLayerOptions } from '../types/filter-layer-options.model';
import { Layer } from '../types/layer.model';
import { LatLng, PopupEvents } from '../types/leaflet.types';
import { OperationalLayerOptions } from '../types/operational-layer-options.model';
export class LocationViewerMap extends LeafletMap {
    public supportingLayer;
    public operationalLayer;
    public filterLayer;
    public filterLayerClicked = new Subject<any>();
    constructor(options: LeafletMapOptions, mapService: LocationViewerMapService) {
        super(options, mapService);
    }

    // Supporting layer
    addSupportingLayers(mapserverUrl: string, layerIds: number[]) {
        if (this.mapService.isAvailable()) {
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
    }

    // Supportinglayer will only show the provided layerids
    setVisibleLayersSupportingLayer(ids: number[]) {
        if (this.mapService.isAvailable() && this.supportingLayer) {
            this.supportingLayer.setLayers(ids);
        }
    }

    addOperationalLayer(operationalLayerOptions: OperationalLayerOptions, layer: Layer) {
        if (this.mapService.isAvailable()) {
            const featureLayerOptions = {
                url: `${operationalLayerOptions.url}/${operationalLayerOptions.layerId}/query`,
                where: layer.visible ? '' : '1 = -1',
                // style is used to style lines and polygons
                style: (feature) => {
                    if (layer.colors) {
                        const colorValue = feature.properties[layer.styleField];
                        const colorItem = layer.colors.find((x) => x.value === colorValue);
                        return colorItem;
                    }
                },
                // point to layer method is used to style points
                pointToLayer: (feature, latlng) => {
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
                },
            };
            if (operationalLayerOptions.enableClustering) {
                this.operationalLayer = new this.mapService.esri.Cluster.featureLayer(featureLayerOptions).addTo(this.map);
            } else {
                this.operationalLayer = this.mapService.esri.featureLayer(featureLayerOptions).addTo(this.map);
            }
        }
    }

    setVisibilityOperationalLayer(visible: boolean) {
        if (this.mapService.isAvailable && this.operationalLayer) {
            this.operationalLayer.setWhere(visible ? '' : '1 = -1');
        }
    }

    addFilterLayer(filterLayerOptions: FilterLayerOptions) {
        if (this.mapService.isAvailable()) {
            this.filterLayer = this.mapService.esri
                .featureLayer({
                    url: `${filterLayerOptions.url}/${filterLayerOptions.layerId}/query`,
                    where: '1 = -1',
                    onEachFeature: (feature, layerProp) => {
                        layerProp.on('click', (e) => {
                            this.filterLayerClicked.next(e);
                        });
                    },
                })
                .bindPopup((layerInfo) => {
                    return this.mapService.L.Util.template(
                        `<p>${filterLayerOptions.popupLabel}: {${filterLayerOptions.propertyToDisplay}}</p>`,
                        layerInfo.feature.properties,
                    );
                })
                .addTo(this.map);

            // removes default click behaviour ==> opening popup
            this.filterLayer.off('click');

            this.filterLayer.on('mouseover', (e) => {
                this.filterLayer.openPopup(e.layer || e.target);
            });
        }
    }

    setVisibilityFilterLayer(visible: boolean) {
        if (this.mapService.isAvailable && this.filterLayer) {
            this.filterLayer.setWhere(visible ? '' : '1 = -1');
            setTimeout(() => {
                this.filterLayer.closePopup();
            }, 200);
        }
    }

    // calculates distance between multiple LatLng points
    calculateDistance(arrayOfPoints: LatLng[]): number {
        let totalDistance = 0;
        for (let i = 0; i < arrayOfPoints.length - 1; i++) {
            const currPoint = arrayOfPoints[i];
            const nextPoint = arrayOfPoints[i + 1];
            totalDistance += currPoint.distanceTo(nextPoint);
        }
        return totalDistance;
    }

    // calculates perimeter of multiple LatLng points
    calculatePerimeter(arrayOfPoints: LatLng[]): number {
        let totalDistance = 0;
        for (let i = 0; i < arrayOfPoints.length; i++) {
            const currPoint = arrayOfPoints[i];
            // if it is the last point calculate distance to the first point
            if (i === arrayOfPoints.length - 1) {
                totalDistance += currPoint.distanceTo(arrayOfPoints[0]);
            } else {
                totalDistance += currPoint.distanceTo(arrayOfPoints[i + 1]);
            }
        }
        return totalDistance;
    }

    // adds Popup to layer
    addPopupToLayer(layer, popupContent: string, onCloseRemoveLayer: boolean, extraLayer = null) {
        const popup = layer.bindPopup(
            () => {
                return this.mapService.L.Util.template(popupContent);
            },
        );
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
}
