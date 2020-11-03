import { LeafletMap, LeafletMapOptions, MapService } from '@acpaas-ui/ngx-components/map';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { ToolbarOptions } from '../types/toolbar-options.model';

export class LocationViewerMap extends LeafletMap {
    constructor(options: LeafletMapOptions, mapService: LocationViewerMapService) {
        super(options, mapService);
    }

    // Toolbar
    addToolbar(options: ToolbarOptions) {
        if (this.mapService.isAvailable()) {
            this.map.pm.addControls(options);
        }
    }
}
