import { LeafletMap, LeafletMapOptions, MapService } from '@acpaas-ui/ngx-components/map';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { SupportingLayerOptions } from '../types/supporting-layer-options.model';
import { ToolbarOptions } from '../types/toolbar-options.model';

export class LocationViewerMap extends LeafletMap {
    public operationalLayer;
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
    addSupportingLayers(options: SupportingLayerOptions) {
        if (this.mapService.isAvailable()) {
            this.operationalLayer = new this.mapService.esri.dynamicMapLayer({
                maxZoom: 20,
                minZoom: 0,
                url: options.url,
                opacity: 1,
                layers: options.layerIds,
                continuousWorld: true,
                useCors: false,
                f: 'image'
            }).addTo(this.map);
        }
    }
}

