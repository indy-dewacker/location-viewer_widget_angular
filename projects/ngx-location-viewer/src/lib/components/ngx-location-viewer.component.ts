import { baseMapAntwerp, baseMapWorldGray } from '@acpaas-ui/ngx-components/map';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LocationViewerMap } from '../classes/location-viewer-map';
import { LayerService } from '../services/layer.service';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { MapServerService } from '../services/mapserver.service';
import { Layer } from '../types/layer.model';
import { SupportingLayerOptions } from '../types/supporting-layer-options.model';
import area from '@turf/area';
import { DrawEvents } from '../types/leaflet.types';
import { GeoApiService } from '../services/geoapi.service';
import { Shapes } from '../types/geoman/geoman.types';
import { ButtonActions } from '../types/button-actions.enum';
import { OperationalLayerOptions } from '../types/operational-layer-options.model';
import { LayerTypes } from '../types/layer-types.enum';
import { FilterLayerOptions } from '../types/filter-layer-options.model';
import { LocationViewerHelper } from '../services/location-viewer.helper';
import { GeofeatureDetail } from '../types/geoapi/geofeature-detail.model';

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
    /* Shows layermangement inside the sidebar. Layermanagement is used to add or remove featurelayers. */
    @Input() showLayerManagement = false;
    /* If showLayerManagement is enabled. Define if layermanagement is default visible */
    @Input() layerManagementVisible = false;
    /* Add supporting layers. If provided will be added as DynamicMapLayer to leaflet */
    @Input() supportingLayerOptions: SupportingLayerOptions;
    /* Add operationalLayer. If provided will be added as FeaturLayer(clustered) to leaflet */
    @Input() operationalLayerOptions: OperationalLayerOptions;
    /* Adds filter layer. If provided will be added as FeatureLayer to leaflet. Is used to filter operationallayer by geometry */
    @Input() filterLayerOptions: FilterLayerOptions;
    /* AddPolygon event */
    @Output() addPolygon = new EventEmitter<any>();
    /* AddLine event */
    @Output() addLine = new EventEmitter<any>();
    /* EditFeature event */
    @Output() editFeature = new EventEmitter<any>();
    /* Operational layer filtered: fired when using selection tools rectangle/polygon or using filter layer */
    @Output() filteredResult = new EventEmitter<GeofeatureDetail[]>();

    /* Leaflet instance */
    leafletMap: LocationViewerMap;

    /* supporting layer config */
    supportingLayer: Layer;
    /* operational layer config */
    operationalLayer: Layer;

    /* Sets the sidebar of leaflet map to visible/invisible */
    hasSidebar = false;
    buttonActions = ButtonActions;

    // Selected button
    currentButton = '';

    private destroyed$ = new Subject<boolean>();

    constructor(
        private mapService: LocationViewerMapService,
        private layerService: LayerService,
        private mapserverService: MapServerService,
        private geoApiService: GeoApiService,
        private locationViewerHelper: LocationViewerHelper
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

    activeButtonChange(action: ButtonActions) {
        switch (this.currentButton) {
            case ButtonActions.whatishere:
                this.leafletMap.map.pm.disableDraw(Shapes.Marker);
                break;
            case ButtonActions.distance:
                this.leafletMap.map.pm.disableDraw(Shapes.Line);
                break;
            case ButtonActions.area:
                this.leafletMap.map.pm.disableDraw(Shapes.Polygon);
                break;
            case ButtonActions.selectZone:
                this.leafletMap.setVisibilityFilterLayer(false);
                break;
        }

        // if the button action is the same as currentButton reset button
        if (this.currentButton === action) {
            this.currentButton = '';
            return;
        }

        this.currentButton = action;
        switch (action) {
            case ButtonActions.whatishere:
                this.leafletMap.map.pm.enableDraw(Shapes.Marker);
                break;
            case ButtonActions.distance:
                this.leafletMap.map.pm.enableDraw(Shapes.Line);
                break;
            case ButtonActions.area:
            case ButtonActions.selectPolygon:
                this.leafletMap.map.pm.enableDraw(Shapes.Polygon);
                break;
            case ButtonActions.selectRectangle:
                this.leafletMap.map.pm.enableDraw(Shapes.Rectangle);
                break;
            case ButtonActions.selectZone:
                this.leafletMap.setVisibilityFilterLayer(true);
                break;
        }
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

            this.leafletMap.map.pm.setLang('nl');

            this.initiateSupportingLayer();
            this.initiateOperationalLayer();
            this.initiateFilterLayer();
            this.handleLayerVisibilityChange();
            this.initiateEvents();
        });
    }

    private initiateSupportingLayer() {
        if (this.supportingLayerOptions && this.locationViewerHelper.isValidMapServer(this.supportingLayerOptions.url)) {
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
        }
    }

    private initiateOperationalLayer() {
        if (this.operationalLayerOptions && this.locationViewerHelper.isValidMapServer(this.operationalLayerOptions.url)) {
            forkJoin([
                this.mapserverService.getMapserverLayerInfo(this.operationalLayerOptions.url, this.operationalLayerOptions.layerId),
                this.mapserverService.getMapserverLegend(this.operationalLayerOptions.url),
            ])
                .pipe(take(1))
                .subscribe(([layerInfo, legend]) => {
                    this.operationalLayer = this.layerService.getLayerFromLayerInfo(layerInfo, legend);
                    this.leafletMap.addOperationalLayer(this.operationalLayerOptions, this.operationalLayer);
                });
        }
    }

    private initiateFilterLayer() {
        if (this.filterLayerOptions && this.locationViewerHelper.isValidMapServer(this.filterLayerOptions.url)) {
            this.leafletMap.addFilterLayer(this.filterLayerOptions);
            this.leafletMap.filterLayerClicked.pipe(takeUntil(this.destroyed$)).subscribe((x) => {
                this.filterOperationalLayer(x.target.feature);
            });
        }
    }

    private handleLayerVisibilityChange() {
        this.layerService.layerVisiblityChange$.pipe(takeUntil(this.destroyed$)).subscribe((layerType: LayerTypes) => {
            switch (layerType) {
                case LayerTypes.supporting:
                    const ids = this.layerService.getVisibleLayerIds(this.supportingLayer);
                    this.leafletMap.setVisibleLayersSupportingLayer(ids);
                    break;
                case LayerTypes.operational:
                    this.leafletMap.setVisibilityOperationalLayer(this.operationalLayer.visible);
                    break;
            }
        });
    }

    private initiateEvents() {
        this.leafletMap.map.on(DrawEvents.create, (e) => {
            switch (e.shape) {
                case Shapes.Line: {
                    const distance = this.locationViewerHelper.calculateDistance(e.layer.editing.latlngs[0]);
                    const content = this.locationViewerHelper.getDistancePopupContent(distance);
                    this.leafletMap.addPopupToLayer(e.layer, content, true);
                    break;
                }
                case Shapes.Polygon: {
                    switch (this.currentButton) {
                        case ButtonActions.area:
                            const perimeter = this.locationViewerHelper.calculatePerimeter(e.layer.editing.latlngs[0][0]);
                            const calculatedArea = area(e.layer.toGeoJSON());
                            const content = this.locationViewerHelper.getAreaPopupContent(perimeter, calculatedArea);
                            this.leafletMap.addPopupToLayer(e.layer, content, true);
                            break;
                        case this.buttonActions.selectPolygon:
                            this.filterOperationalLayer(e.layer.toGeoJSON());
                            this.leafletMap.map.removeLayer(e.layer);
                            break;
                        default:
                            break;
                    }
                    break;
                }
                case Shapes.Rectangle: {
                    this.filterOperationalLayer(e.layer.toGeoJSON());
                    this.leafletMap.map.removeLayer(e.layer);
                    break;
                }
                case Shapes.Marker: {
                    this.geoApiService
                        .getAddressesByCoordinates(e.marker.getLatLng())
                        .pipe(take(1))
                        .subscribe((x) => {
                            if (x.addressDetail.length > 0) {
                                const address = x.addressDetail[0];
                                const marker = this.leafletMap.addHtmlMarker(
                                    address.addressPosition.wgs84,
                                    this.createMarker('#000000', 'fa-circle', '10px', { top: '-3px', left: '2px' }),
                                );
                                const content = this.locationViewerHelper.getWhatisherePopupContent(address);
                                this.leafletMap.addPopupToLayer(e.marker, content, true, marker);
                            } else {
                                this.leafletMap.addPopupToLayer(e.marker, '<p>Geen adres gevonden.</p>', true);
                            }
                        });
                }
            }

            // after finished intake reset current button
            this.activeButtonChange(ButtonActions.none);
        });
    }

    private filterOperationalLayer(feature) {
        this.geoApiService
            .getGeofeaturesByGeometry(this.operationalLayerOptions.url, [this.operationalLayerOptions.layerId], feature)
            .pipe(take(1))
            .subscribe((geoFeatureRespone) => {
                this.filteredResult.emit(geoFeatureRespone.results);
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
