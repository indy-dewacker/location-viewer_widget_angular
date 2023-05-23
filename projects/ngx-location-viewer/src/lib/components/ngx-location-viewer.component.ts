import { baseMapAntwerp, baseMapWorldGray } from '@acpaas-ui/ngx-leaflet';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { forkJoin, from, Observable, of, Subject } from 'rxjs';
import { combineAll, map, take, takeUntil, tap } from 'rxjs/operators';
import { isEqual } from 'lodash-es';
import { LocationViewerMap } from '../classes/location-viewer-map';
import { LayerService } from '../services/layer.service';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { MapServerService } from '../services/mapserver.service';
import { Layer } from '../types/layer.model';
import { SupportingLayerOptions } from '../types/supporting-layer-options.model';
import area from '@turf/area';
import { DrawEvents, InteractionEvents, RasterEvents } from '../types/leaflet.types';
import { GeoApiService } from '../services/geoapi.service';
import { Shapes } from '../types/geoman/geoman.types';
import { ButtonActions } from '../types/button-actions.enum';
import { OperationalLayerOptions, OperationalMarker } from '../types/operational-layer-options.model';
import { LayerTypes } from '../types/layer-types.enum';
import { FilterLayerOptions } from '../types/filter-layer-options.model';
import { LocationViewerHelper } from '../services/location-viewer.helper';
import { GeofeatureDetail } from '../types/geoapi/geofeature-detail.model';
import { LeafletTileLayerModel, LeafletTileLayerType } from '../types/leaflet-tile-layer.model';
import { Translations } from '../types/translations.model';
import { LatLngExpression } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'aui-location-viewer',
  templateUrl: './ngx-location-viewer.component.html',
  styleUrls: ['./ngx-location-viewer.component.scss'],
})
export class NgxLocationViewerComponent implements OnInit, OnChanges, OnDestroy {
  /* Url to the backend-for-frontend (bff) Should function as pass through to the Geo API. */
  @Input() geoApiBaseUrl: string;
  /* The default zoom level on map load. */
  @Input() defaultZoom = 14;
  /* The initial map center on load. */
  @Input() mapCenter: LatLngExpression = [51.215, 4.425];
  /* Shows button to open sidebar if true. A sidebar can contain any additional info you like. */
  @Input() hasSidebar = false;
  /* If hasSidebar is true this will show whether the sidebar should be visible from the start */
  @Input() showSidebar = false;
  /* Shows layermangement inside the sidebar. Layermanagement is used to add or remove featurelayers. */
  @Input() showLayerManagement = true;
  /* Show selection tools */
  @Input() showSelectionTools = true;
  /* Show measure tools */
  @Input() showMeasureTools = true;
  /* show whatishere button */
  @Input() showWhatIsHereButton = true;
  /* Add supporting layers. If provided will be added as DynamicMapLayer to leaflet */
  @Input() supportingLayerOptions: SupportingLayerOptions;
  /* Add operationalLayer. If provided will be added as FeaturLayer(clustered) to leaflet */
  @Input() operationalLayerOptions: OperationalLayerOptions;
  /* Adds filter layer. If provided will be added as FeatureLayer to leaflet. Is used to filter operationallayer by geometry */
  @Input() filterLayers: FilterLayerOptions[];
  /* Leafletmap instance. If null will be initialized .*/
  @Input() leafletMap: LocationViewerMap;
  /* Default tile layer button label */
  @Input() defaultTileLayerLabel = 'Kaart';
  /* Custom leaflet tile layer, if provided, shows actions on the leaflet to toggle between default and custom tile layer. */
  @Input() tileLayer: LeafletTileLayerModel;
  /**
   * The zoom level when a marker is selected.
   * If null the zoomlevel won't change after marker selection.
   */
  @Input() zoomOnMarkerSelect?= 16;
  /* */
  @Input() translations: Translations = {
    closeSidebar: 'Sluit zijbalk',
    openSidebar: 'Open zijbalk',
    select: 'Selecteren',
    selectRectangle: 'Selecteer met een rechthoek',
    selectPolygon: 'Selecteer met een veelhoek',
    selectFilterLayer: 'Selecteer met filterlaag',
    measure: 'Meten',
    measureArea: 'Meten oppervlakte en omtrek',
    measureDistance: 'Meten afstand',
    whatIsHere: 'Wat is hier',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom uit'
  }
  /* HasSideBar change */
  @Output() hasSidebarChange = new EventEmitter<boolean>();
  /* AddPolygon event */
  @Output() addPolygon = new EventEmitter<any>();
  /* AddLine event */
  @Output() addLine = new EventEmitter<any>();
  /* EditFeature event */
  @Output() editFeature = new EventEmitter<any>();
  /* Operational layer filtered: fired when using selection tools rectangle/polygon, using filter layer or clicking on marker of operational layer*/
  @Output() filteredResult = new EventEmitter<GeofeatureDetail[] | OperationalMarker[] | any>();
  /* Operational layer clicked: fired when clicking on marker of operational layer */
  @Output() markerClicked = new EventEmitter<any>();
  /* supporting layer config */
  supportingLayers: Layer[];
  /* operational layer config */
  operationalLayer: Layer;
  /* filterLayers */
  filterLayers$: Observable<FilterLayerOptions[]>;

  buttonActions = ButtonActions;
  /* Current tile layer type default or custom */
  tileLayerType: LeafletTileLayerType = LeafletTileLayerType.DEFAULT;

  // Selected button
  currentButton = '';

  // Selected filter layer
  currentFilterLayer: FilterLayerOptions;

  private destroyed$ = new Subject<boolean>();
  /* Current active tile layers */
  private activeTileLayers = [];
  /* Check if current operational layer is created with custom markers */
  private customOperationalLayer: boolean;

  /**
   * Check if current tile layer is the default one.
   */
  get isDefaultTileLayer(): boolean {
    return this.tileLayerType === LeafletTileLayerType.DEFAULT;
  }

  /**
   * Check if current tile layer is user defined.
   */
  get isCustomTileLayer(): boolean {
    return this.tileLayerType === LeafletTileLayerType.CUSTOM;
  }

  constructor(
    private mapService: LocationViewerMapService,
    private layerService: LayerService,
    private mapserverService: MapServerService,
    private geoApiService: GeoApiService,
    private locationViewerHelper: LocationViewerHelper,
  ) { }

  ngOnInit() {
    this.initLocationViewer();
  }

  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: forin
    for (const propName in changes) {
      const change = changes[propName];

      // only handle changes after first cycle, first cycle need to wait for leafletmap init, check if value changes (not the reference)
      if (!change.firstChange && !isEqual(change.previousValue, change.currentValue)) {
        switch (propName) {
          case 'supportingLayerOptions':
            this.initiateSupportingLayer();
            break;
          case 'operationalLayerOptions':
            this.initiateOperationalLayer();
            break;
          case 'filterLayers':
            this.initiateFilterLayers();
            break;
          default:
            break;
        }
      }
    }
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

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    this.hasSidebarChange.emit(this.showSidebar);
    // recalculates leaflet map size
    setTimeout(() => {
      this.leafletMap.map.invalidateSize();
    })
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
      case ButtonActions.selectPolygon:
        this.leafletMap.map.pm.disableDraw(Shapes.Polygon);
        break;
      case ButtonActions.selectRectangle:
        this.leafletMap.map.pm.disableDraw(Shapes.Rectangle);
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

  /**
   * Toggle tile layer when a custom tile layer is provided
   */
  toggleTileLayer(custom: boolean = false) {
    this.resetCurrentTileLayers();

    this.tileLayerType = custom ? LeafletTileLayerType.CUSTOM : LeafletTileLayerType.DEFAULT;

    if (custom) {
      this.activeTileLayers.push(this.leafletMap.addTileLayer(this.tileLayer.layer));
    } else {
      this.activeTileLayers.push(this.leafletMap.addTileLayer(baseMapWorldGray));
      this.activeTileLayers.push(this.leafletMap.addTileLayer(baseMapAntwerp));
    }
  }

  /**
   * Handle change select-filterlayer
   */
  onChangeFilterLayer() {
    if (this.locationViewerHelper.isValidMapServer(this.currentFilterLayer.url)) {
      this.leafletMap.addFilterLayer(this.currentFilterLayer);
      this.leafletMap.setVisibilityFilterLayer(true);
    }
  }

  /**
   * Handles layerchange
   * @param layerType
   */
  handleLayerVisibilityChange(layerType: LayerTypes) {
    switch (layerType) {
      case LayerTypes.supporting:
        const ids = this.layerService.getVisibleLayerIds(this.supportingLayers);
        this.leafletMap.setVisibleLayersSupportingLayer(ids);
        break;
      case LayerTypes.operational:
        this.leafletMap.setVisibilityOperationalLayer(this.operationalLayer.visible);
        break;
    }
  }

  /**
   * Register operational layer click event
   */
   public registerOperationalLayerClickEvent(): void {
    // listen for events on operational layer
    if (this.leafletMap.operationalLayer) {
      this.leafletMap.operationalLayer.on(InteractionEvents.click, (event) => {
        //emit the event 
        this.markerClicked.emit(event);
        // if custommarker return data under options object
        if (this.customOperationalLayer) {
          const latLng = event.layer.getLatLng();
          let marker: OperationalMarker = {
            coordinate: {
              lat: latLng.lat,
              lon: latLng.lng,
            },
            data: event.layer.options.data,
            icon: '',
          };
          this.filteredResult.emit([marker]);
        } else {
          this.filteredResult.emit([event.layer.feature.properties]);
        }

        // Centers map on marker coordinates and sets view level to zoomOnMarkerSelect
        if (this.zoomOnMarkerSelect) {
          this.leafletMap.setView(event.latlng, this.zoomOnMarkerSelect);
        }
      });
    }
  }

  /**
   * Resets the current tile layers
   */
  private resetCurrentTileLayers() {
    if (this.activeTileLayers.length > 0) {
      this.activeTileLayers.map((layer) => {
        this.leafletMap.removeLayer(layer);
      });
    }

    this.activeTileLayers = [];
  }

  private initLocationViewer() {
    if (!this.leafletMap) {
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
    }

    this.leafletMap.onInit.subscribe(() => {
      this.activeTileLayers.push(this.leafletMap.addTileLayer(baseMapWorldGray));
      this.activeTileLayers.push(this.leafletMap.addTileLayer(baseMapAntwerp));

      // sets geoman language to nl (tooltips for drawing)
      this.leafletMap.map.pm.setLang('nl');

      this.initiateSupportingLayer();
      this.initiateOperationalLayer();
      this.initiateFilterLayers();
      this.initiateEvents();

      // set hasSidebar true if showlayermanagement is true because this is inside the sidebar
      if (this.showLayerManagement && !this.hasSidebar) {
        this.hasSidebar = true;
      }
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
          this.supportingLayers = this.layerService.buildSupportingLayersFromInfoAndLegend(
            info,
            legend,
            this.supportingLayerOptions.layerIds,
            this.supportingLayerOptions.visible
          );
          const ids = this.layerService.getVisibleLayerIds(this.supportingLayers);
          const layer = this.leafletMap.addSupportingLayers(this.supportingLayerOptions.url, ids);
          layer.on(RasterEvents.loading, () => {
            this.supportingLayers.forEach((x) => (x.isLoading = true));
          });
          layer.on(RasterEvents.load, () => {
            this.supportingLayers.forEach((x) => (x.isLoading = false));
          });
        });
    }
  }

  private initiateOperationalLayer() {
    if (this.operationalLayerOptions) {
      //check if required settings for esri feature layer are provided
      if (this.locationViewerHelper.isValidOperationalFeatureLayerConfiguration(this.operationalLayerOptions)) {
        forkJoin([
          this.mapserverService.getMapserverLayerInfo(this.operationalLayerOptions.url, this.operationalLayerOptions.layerId),
          this.mapserverService.getMapserverLegend(this.operationalLayerOptions.url),
        ])
          .pipe(take(1))
          .subscribe(([layerInfo, legend]) => {
            this.operationalLayer = this.layerService.getLayerFromLayerInfo(layerInfo, legend);
            this.leafletMap.addOperationalLayer(this.operationalLayerOptions, this.operationalLayer, this.operationalLayerOptions.tooltipField ? this.operationalLayerOptions.tooltipField : layerInfo.displayField);
            this.customOperationalLayer = false;
            this.registerOperationalLayerClickEvent();
          });
      } else if (
        this.operationalLayerOptions.markers &&
        this.operationalLayerOptions.markers.length > 0 &&
        this.operationalLayerOptions.name &&
        this.operationalLayerOptions.isVisible
      ) {
        this.leafletMap.addOperationalMarkers(this.operationalLayerOptions.markers, this.operationalLayerOptions.enableClustering);
        this.operationalLayer = {
          name: this.operationalLayerOptions.name,
          visible: this.operationalLayerOptions.isVisible,
        };
        this.customOperationalLayer = true;
        this.registerOperationalLayerClickEvent();
      } else {
        throw new Error('Invalid operationalLayerOptions! Check readme for examples.');
      }
    }
  }

  private initiateFilterLayers() {
    // if no default data is provided fetch layer data from mapserver
    if (this.filterLayers) {
      this.leafletMap.setVisibilityFilterLayer(false);
      this.filterLayers$ = from(this.filterLayers)
        .pipe(
          map((layer: FilterLayerOptions) => {
            if (layer.name == null || layer.popupLabel == null || layer.propertyToDisplay == null) {
              return this.mapserverService.getMapserverLayerInfo(layer.url, layer.layerId).pipe(
                map((layerInfo) => {
                  let filterLayer = layer;
                  filterLayer.name = filterLayer.name ? filterLayer.name : layerInfo.name;
                  filterLayer.popupLabel = filterLayer.popupLabel ? filterLayer.popupLabel : layerInfo.displayField;
                  filterLayer.propertyToDisplay = filterLayer.propertyToDisplay
                    ? filterLayer.propertyToDisplay
                    : layerInfo.displayField;
                  return filterLayer;
                }),
              );
            } else {
              return of(layer);
            }
          }),
          combineAll(),
          tap((filterLayers: FilterLayerOptions[]) => {
            if (
                filterLayers &&
                filterLayers.length == 1 &&
                this.locationViewerHelper.isValidMapServer(filterLayers[0].url)
              ) {
                this.leafletMap.addFilterLayer(filterLayers[0]);
              }
          })
        )
    }

    //register on filterlayer click
    this.leafletMap.filterLayerClicked.pipe(takeUntil(this.destroyed$)).subscribe((x) => {
      this.filterOperationalLayer(x.target.feature);
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
            .getAddressesByCoordinates(this.geoApiBaseUrl, e.marker.getLatLng())
            .pipe(take(1))
            .subscribe((x) => {
              if (x.addressDetail.length > 0) {
                const address = x.addressDetail[0];
                const marker = this.leafletMap.addHtmlMarker(
                  address.addressPosition.wgs84,
                  this.leafletMap.getHtmlMarker('#000000', 'ai-location-target-1', '16px', { top: '-3px', left: '2px' }),
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
    if (this.operationalLayerOptions) {
      if (this.locationViewerHelper.isValidOperationalFeatureLayerConfiguration(this.operationalLayerOptions)) {
        this.geoApiService
          .getGeofeaturesByGeometry(
            this.geoApiBaseUrl,
            this.operationalLayerOptions.url,
            [this.operationalLayerOptions.layerId],
            feature,
          )
          .pipe(take(1))
          .subscribe((geoFeatureRespone) => {
            this.filteredResult.emit(geoFeatureRespone.results);
          });
      } else if (this.locationViewerHelper.isValidOpertionalMarkerLayerConfiguration(this.operationalLayerOptions)) {
        const filteredMarkers = this.locationViewerHelper.filterOperationalMarkersByGeometries(
          this.operationalLayerOptions.markers,
          feature.geometry.coordinates,
        );
        this.filteredResult.emit(filteredMarkers);
      }
    }
  }
}
