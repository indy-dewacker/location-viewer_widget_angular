import { MapService } from '@acpaas-ui/ngx-components/map';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';


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
        }
    }
}
