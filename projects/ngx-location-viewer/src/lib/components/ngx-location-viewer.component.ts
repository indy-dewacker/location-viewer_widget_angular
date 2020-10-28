import { baseMapAntwerp, baseMapWorldGray, MapService } from '@acpaas-ui/ngx-components/map';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocationViewerMap } from '../types/location-viewer.map';

@Component({
  selector: 'aui-location-viewer',
  templateUrl: './ngx-location-viewer.component.html',
  styleUrls: ['./ngx-location-viewer.component.scss']
})
export class NgxLocationViewerComponent implements OnInit {
  /* The default zoom level on map load. */
  @Input() defaultZoom = 14;
  /* The zoom level when a location is selected. */
  @Input() onSelectZoom = 16;
  /* The initial map center on load. */
  @Input() mapCenter: Array<number> = [51.215, 4.425];
  /* Show a sidebar next to the map leaflet. A sidebar can contain any additional info you like. */
  @Input() hasSidebar = false;
  /* Shows layermangement inside the sidebar. Layermanagement is used to add or remove featurelayers. */
  @Input() showLayerManagement = false;
  /* AddPolygon event */
  @Output() addPolygon = new EventEmitter<any>();
  /* AddLine event */
  @Output() addLine = new EventEmitter<any>();
  /* EditFeature event */
  @Output() editFeature = new EventEmitter<any>();


  /* Leaflet instance */
  leafletMap: LocationViewerMap;
  constructor(
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.initLocationViewer();
  }

  private initLocationViewer() {
    this.leafletMap = new LocationViewerMap({
      zoom: this.defaultZoom,
      center: this.mapCenter,
      onAddPolygon: (layer) => {
        this.addPolygon.emit(layer);
      },
      onAddLine: (layer) => {
        this.addLine.emit(layer);
      },
      onEditFeature: (feature) => {
        this.editFeature.emit(feature);
      },
    }, this.mapService);

    this.leafletMap.onInit.subscribe(() => {
      this.leafletMap.addTileLayer(baseMapWorldGray);
      this.leafletMap.addTileLayer(baseMapAntwerp);
      this.leafletMap.map.pm.addControls({
        position: 'topright'
      });
    });
  }

}
