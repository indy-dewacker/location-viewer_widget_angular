import { LeafletMap, LeafletMapOptions, MapService } from '@acpaas-ui/ngx-components/map';

export class LocationViewerMap extends LeafletMap {
    public pm;

    constructor(options: LeafletMapOptions, mapService: MapService) {
        super(options, mapService);
        this.pm = require('@geoman-io/leaflet-geoman-free');
    }
}
