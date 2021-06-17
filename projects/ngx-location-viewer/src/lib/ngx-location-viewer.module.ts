import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IconModule } from '@acpaas-ui/ngx-icon';
import { LeafletModule } from '@acpaas-ui/ngx-leaflet';

import { NgxLocationViewerComponent } from './components/ngx-location-viewer.component';
import { LayerManagementComponent } from './components/layer-management/layer-management.component';
import { MAP_SERVICE_PROVIDER } from './map.provider';
import { MapServerService } from './services/mapserver.service';
import { LayerService } from './services/layer.service';
import { LayerComponent } from './components/layer-management/layer/layer.component';
import { LayerLegendComponent } from './components/layer-management/layer-legend/layer-legend.component';
import { GeoApiService } from './services/geoapi.service';
import { LocationViewerHelper } from './services/location-viewer.helper';

@NgModule({
  declarations: [NgxLocationViewerComponent, LayerManagementComponent, LayerComponent, LayerLegendComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    IconModule,
    LeafletModule
  ],
  exports: [NgxLocationViewerComponent],
  providers: [
    MAP_SERVICE_PROVIDER,
    MapServerService,
    LayerService,
    GeoApiService,
    LocationViewerHelper
  ]
})
export class LocationViewerModule { }
