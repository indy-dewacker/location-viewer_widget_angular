import { MapService } from '@acpaas-ui/ngx-leaflet';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

// import * as Cluster from 'esri-leaflet-cluster'

@Injectable()
export class LocationViewerMapService extends MapService {
  // tslint:disable-next-line: ban-types
  constructor(@Inject(PLATFORM_ID) private PlatformId: Object) {
    super(PlatformId);
    this.requireDependencies();
  }

  requireDependencies() {
    if (this.isAvailable()) {
      require('@geoman-io/leaflet-geoman-free');
      require('leaflet.markercluster');
      this.esri.Cluster = require('esri-leaflet-cluster');
    }
  }
}
