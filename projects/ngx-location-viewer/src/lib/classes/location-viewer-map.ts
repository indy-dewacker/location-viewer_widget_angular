import { LeafletMap, LeafletMapOptions } from '@acpaas-ui/ngx-components/map';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { ToolbarOptions } from '../types/toolbar-options.model';

export class LocationViewerMap extends LeafletMap {
    public supportingLayer;
    constructor(options: LeafletMapOptions, mapService: LocationViewerMapService) {
        super(options, mapService);
    }

    // Toolbar
    addToolbar(options: ToolbarOptions) {
        if (this.mapService.isAvailable()) {
            this.map.pm.addControls(options);
        }
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

    // Operational layer
    addOperationalLayer() {
        if (this.mapService.isAvailable()) {
            const layer = new this.mapService.esri.featureLayer({
                // url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_ToK/P_Tok_routeweek/MapServer/145',
                url: 'https://geoint-a.antwerpen.be/arcgissql/rest/services/A_DA/Locaties_Cascade/MapServer/28',
                onEachFeature: (feature, layerProp) => {
                    layerProp.on('click', (e) => {
                        this.registerOnclick(feature);
                    });
                }
            }).bindPopup((layerInfo) => {
                return this.mapService.L.Util.template('<p>Naam: {naam}</p>', layerInfo.feature.properties);
            }).addTo(this.map);

            // removes default click behaviour ==> opening popup
            layer.off('click');

            layer.on('mouseover', (e) => {
                layer.openPopup(e.layer || e.target, e.layer.getBounds().getCenter());
            });

            layer.on('mouseout', () => {
                layer.closePopup();
            });
        }
    }

    registerOnclick(feature) {
        console.log(feature);
    }
}
