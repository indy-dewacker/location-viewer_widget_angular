import { Provider } from '@angular/core';
import { LocationViewerMapService } from './services/location-viewer-map.service';

export function locationViewerMapServiceFactory() {
  return new LocationViewerMapService('browser');
}

export const MAP_SERVICE_PROVIDER: Provider = {
  provide: LocationViewerMapService,
  useFactory: locationViewerMapServiceFactory
};
