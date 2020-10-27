import { baseMapAntwerp, baseMapWorldGray, LeafletMap, MapService } from '@acpaas-ui/ngx-components/map';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aui-location-viewer',
  templateUrl: './ngx-location-viewer.component.html',
  styleUrls: ['./ngx-location-viewer.component.scss']
})
export class NgxLocationViewerComponent implements OnInit {
  /* Leaflet instance */
  leafletMap: LeafletMap;
  constructor(
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.initLocationViewer();
  }

  private initLocationViewer() {
    this.leafletMap = new LeafletMap({
      zoom: 14,
      center: [51.215, 4.425],
      onAddPolygon: (layer) => {
        // TODO: emit event
      },
      onAddLine: (layer) => {
        // TODO: emit event
      },
      onEditFeature: (feature) => {
        // TODO: emit event
      },
    }, this.mapService);

    this.leafletMap.onInit.subscribe(() => {
      this.leafletMap.addTileLayer(baseMapWorldGray);
      this.leafletMap.addTileLayer(baseMapAntwerp);
    });
  }

}
