import { NgModule } from '@angular/core';
import { NgxLocationViewerComponent } from './components/ngx-location-viewer.component';
import { LeafletModule } from '@acpaas-ui/ngx-components/map';
import { CommonModule } from '@angular/common';
import { MAP_SERVICE_PROVIDER } from './map.provider';

@NgModule({
  declarations: [NgxLocationViewerComponent],
  imports: [
    CommonModule,
    LeafletModule
  ],
  exports: [NgxLocationViewerComponent],
  providers: [
    MAP_SERVICE_PROVIDER
  ]
})
export class LocationViewerModule { }
