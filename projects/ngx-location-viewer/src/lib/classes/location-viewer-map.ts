import { LeafletMap, LeafletMapOptions } from '@acpaas-ui/ngx-components/map';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { LatLng, PopupEvents } from '../types/leaflet.types';
export class LocationViewerMap extends LeafletMap {
    public supportingLayer;
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
    addPopupToLayer(layer, popupContent: string, onCloseRemoveLayer: boolean, extraLayer = null, minWidth = 50) {
        const popup = layer.bindPopup(() => {
            return this.mapService.L.Util.template(popupContent);
        }, { minWidth});
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
