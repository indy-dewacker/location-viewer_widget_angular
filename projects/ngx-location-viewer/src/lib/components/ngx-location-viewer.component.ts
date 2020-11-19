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
import area from '@turf/area';
import { DrawEvents } from '../types/leaflet.types';
import { GeoApiService } from '../services/geoapi.service';

@Component({
    selector: 'aui-location-viewer',
    templateUrl: './ngx-location-viewer.component.html',
    styleUrls: ['./ngx-location-viewer.component.scss'],
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
        private mapserverService: MapServerService,
        private geoApiService: GeoApiService,
    ) {}

    ngOnInit() {
        this.initLocationViewer();
    }

    ngOnDestroy() {
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
        this.leafletMap = new LocationViewerMap(
            {
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
            },
            this.mapService,
        );

        this.leafletMap.onInit.subscribe(() => {
            this.leafletMap.addTileLayer(baseMapWorldGray);
            this.leafletMap.addTileLayer(baseMapAntwerp);

            if (this.showToolbar) {
                this.leafletMap.addToolbar(this.toolbarOptions);
            }

            this.initiateSupportingLayer();
            this.initiateEvents();
        });
    }

    private initiateSupportingLayer() {
        if (this.supportingLayerOptions) {
            forkJoin([
                this.mapserverService.getMapserverInfo(this.supportingLayerOptions.url),
                this.mapserverService.getMapserverLegend(this.supportingLayerOptions.url),
            ])
                .pipe(take(1))
                .subscribe(([info, legend]) => {
                    this.supportingLayer = this.layerService.buildLayerFromInfoAndLegend(
                        info,
                        legend,
                        this.supportingLayerOptions.layerIds,
                    );
                    const ids = this.layerService.getVisibleLayerIds(this.supportingLayer);
                    this.leafletMap.addSupportingLayers(this.supportingLayerOptions.url, ids);
                });

            this.layerService.layerVisiblityChange$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
                const ids = this.layerService.getVisibleLayerIds(this.supportingLayer);
                this.leafletMap.setVisibleLayersSupportingLayer(ids);
            });
        }
    }

    private initiateEvents() {
        this.leafletMap.map.on(DrawEvents.create, (e) => {
            switch (e.shape) {
                case 'meten': {
                    const distance = this.leafletMap.calculateDistance(e.layer.editing.latlngs[0]);
                    this.leafletMap.addPopupToLayer(e.layer, `<p>Afstand(m): ${distance.toFixed(2)}</p>`, true);
                    break;
                }
                case 'omtrek': {
                    const perimeter = this.leafletMap.calculatePerimeter(e.layer.editing.latlngs[0][0]);
                    const calculatedArea = area(e.layer.toGeoJSON());
                    const content = `<p>Omtrek(m): ${perimeter.toFixed(2)}</p><p>Opp(m²): ${calculatedArea.toFixed(2)}</p>`;
                    this.leafletMap.addPopupToLayer(e.layer, content, true);
                    break;
                }
                case 'watishier': {
                    this.leafletMap.map.pm.disableDraw('watishier');
                    this.geoApiService
                        .getAddressesByCoordinates(e.marker.getLatLng())
                        .pipe(take(1))
                        .subscribe((x) => {
                            const address = x.addressDetail[0];
                            this.leafletMap.addHtmlMarker(address.addressPosition.wgs84, this.createMarker(
                                '#000000',
                                'fa-circle',
                                '10px',
                                {top: '-3px', left: '2px'}
                              ));
                            const content =
                              '<div class="container">' +
                              '<div class="row">' +
                              '<div class="col-sm-3" >' +
                              '<a href="http://maps.google.com/maps?q=&layer=c&cbll=' + address.addressPosition.wgs84.lat + ',' + address.addressPosition.wgs84.lon + '" + target="_blank" >' +
                              '<img title="Ga naar streetview" src="https://seeklogo.com/images/G/google-street-view-logo-665165D1A8-seeklogo.com.png" style="max-width: 100%; max-height: 100%;"/>' +
                              '</a>' +
                              '</div>' +
                              '<div class="col-sm-8">' +
                              '<div class="col-sm-12"><b>' + address.formattedAddress + '</b></div>' +
                              '<div class="col-sm-3">WGS84:</div><div id="wgs" class="col-sm-8" style="text-align: left;">' + address.addressPosition.wgs84.lat + ', ' + address.addressPosition.wgs84.lon + '</div><div class="col-sm-1"><i class="fa fa-files-o coordinate-pointer" ng-click="CopyWGS()"></i></div>' +
                              '<div class="col-sm-3">Lambert:</div><div id="lambert" class="col-sm-8" style="text-align: left;">' + address.addressPosition.lambert72.x + ', ' + address.addressPosition.lambert72.y + '</div><div class="col-sm-1"><i class="fa fa-files-o coordinate-pointer"  ng-click="CopyLambert()"></i></div>' +
                              '</div>' +
                              '</div>' +
                              '</div>';
                            this.leafletMap.addPopupToLayer(e.marker, content, true);
                            console.log(x);
                        });
                }
            }
        });
    }

    /**
     * Defines the custom marker markup.
     */
    private createMarker(
        color: string = '#0064b4',
        icon: string = 'fa-map-marker',
        size: string = '40px',
        position: { top: string; left: string } = {
            top: '-36px',
            left: '-5px',
        },
    ) {
        const markerStyle = `color: ${color}; font-size: ${size}; top: ${position.top}; left: ${position.left}`;
        const markerIcon = `<span class="fa ${icon}" aria-hidden="true"></span>`;

        return `<span style="${markerStyle}" class="ngx-location-picker-marker">${markerIcon}</span>`;
    }
}
