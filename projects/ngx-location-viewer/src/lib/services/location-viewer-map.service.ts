import { MapService } from '@acpaas-ui/ngx-leaflet';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import 'leaflet.markercluster';
import '@geoman-io/leaflet-geoman-free';
import * as esriLeafletCluster from 'esri-leaflet-cluster';

@Injectable()
export class LocationViewerMapService extends MapService {
    // tslint:disable-next-line: ban-types
    constructor(@Inject(PLATFORM_ID) private PlatformId: Object) {
        super(PlatformId);
        this.requireDependencies();
    }

    requireDependencies() {
        if (this.isAvailable()) {
            this.esri.Cluster = esriLeafletCluster;
        }
    }
}
