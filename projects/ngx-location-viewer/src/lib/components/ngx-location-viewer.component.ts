import { baseMapAntwerp, baseMapWorldGray, MapService } from '@acpaas-ui/ngx-components/map';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { forkJoin, Subject, throwError } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { LocationViewerMap } from '../classes/location-viewer-map';
import { LayerService } from '../services/layer.service';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { MapServerService } from '../services/mapserver.service';
import { Layer } from '../types/layer.model';
import { SupportingLayerOptions } from '../types/supporting-layer-options.model';
import { ToolbarOptions } from '../types/toolbar-options.model';
import { ToolbarPosition } from '../types/toolbar-position.enum';

@Component({
  selector: 'aui-location-viewer',
  templateUrl: './ngx-location-viewer.component.html',
  styleUrls: ['./ngx-location-viewer.component.scss']
})
export class NgxLocationViewerComponent implements OnInit, OnDestroy {
  /* The default zoom level on map load. */
  @Input() defaultZoom = 14;
  /* The zoom level when a location is selected. */
  @Input() onSelectZoom = 16;
  /* The initial map center on load. */
  @Input() mapCenter: Array<number> = [51.215, 4.425];
  /* Show geoman toolbar. Toolbar options can be configured with the toolbar options input parameter */
  @Input() showToolbar = true;
  /* Configures toolbar options. If toolbar is shown these options will configure the toolbar */
  @Input() toolbarOptions: ToolbarOptions = { position: ToolbarPosition.TopRight };
  /* Shows layermangement inside the sidebar. Layermanagement is used to add or remove featurelayers. */
  @Input() showLayerManagement = false;
  /* If showLayerManagement is enabled. Define if layermanagement is default visible */
  @Input() layerManagementVisible = false;
  /* Add supporting layers. If provided will be added as DynamicMapLayer to leaflet */
  @Input() supportingLayerOptions: SupportingLayerOptions;
  /* AddPolygon event */
  @Output() addPolygon = new EventEmitter<any>();
  /* AddLine event */
  @Output() addLine = new EventEmitter<any>();
  /* EditFeature event */
  @Output() editFeature = new EventEmitter<any>();

  /* Leaflet instance */
  leafletMap: LocationViewerMap;

  /* supporting layer config */
  supportingLayer: Layer;

  /* Sets the sidebar of leaflet map to visible/invisible */
  hasSidebar = false;

  private destroyed$ = new Subject<boolean>();

  constructor(
    private mapService: LocationViewerMapService,
    private layerService: LayerService,
    private mapserverService: MapServerService
  ) { }

  ngOnInit() {
    this.initLocationViewer();
  }

  ngOnDestroy()  {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Zooms the map in
   */
  zoomIn() {
    this.leafletMap.zoomIn();
  }

  /**
   * Zooms the map out
   */
  zoomOut() {
    this.leafletMap.zoomOut();
  }

  toggleLayermanagement() {
    this.hasSidebar = !this.hasSidebar;
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

      if (this.showToolbar) {
        this.leafletMap.addToolbar(this.toolbarOptions);
      }

      this.initiateSupportingLayer();
    });
  }

  private initiateSupportingLayer() {
    if (this.supportingLayerOptions) {
      forkJoin(
        [
          this.mapserverService.getMapserverInfo(this.supportingLayerOptions.url),
          this.mapserverService.getMapserverLegend(this.supportingLayerOptions.url)
        ]).pipe(take(1)).subscribe(([info, legend]) => {
          this.supportingLayer = this.layerService.buildLayerFromInfoAndLegend(info, legend, this.supportingLayerOptions.layerIds);
          const ids = this.layerService.getVisibleLayerIds(this.supportingLayer);
          this.leafletMap.addSupportingLayers(this.supportingLayerOptions.url, ids);
      });

      this.layerService.layerVisiblityChange$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        const ids = this.layerService.getVisibleLayerIds(this.supportingLayer);
        this.leafletMap.setVisibleLayersSupportingLayer(ids);
      });

    }
  }
}
