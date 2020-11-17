"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NgxLocationViewerComponent = void 0;
var map_1 = require("@acpaas-ui/ngx-components/map");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var location_viewer_map_1 = require("../classes/location-viewer-map");
var toolbar_position_enum_1 = require("../types/toolbar-position.enum");
var NgxLocationViewerComponent = /** @class */ (function () {
    function NgxLocationViewerComponent(mapService, layerService, mapserverService) {
        this.mapService = mapService;
        this.layerService = layerService;
        this.mapserverService = mapserverService;
        /* The default zoom level on map load. */
        this.defaultZoom = 14;
        /* The zoom level when a location is selected. */
        this.onSelectZoom = 16;
        /* The initial map center on load. */
        this.mapCenter = [51.215, 4.425];
        /* Show geoman toolbar. Toolbar options can be configured with the toolbar options input parameter */
        this.showToolbar = true;
        /* Configures toolbar options. If toolbar is shown these options will configure the toolbar */
        this.toolbarOptions = { position: toolbar_position_enum_1.ToolbarPosition.TopRight };
        /* Shows layermangement inside the sidebar. Layermanagement is used to add or remove featurelayers. */
        this.showLayerManagement = false;
        /* If showLayerManagement is enabled. Define if layermanagement is default visible */
        this.layerManagementVisible = false;
        /* AddPolygon event */
        this.addPolygon = new core_1.EventEmitter();
        /* AddLine event */
        this.addLine = new core_1.EventEmitter();
        /* EditFeature event */
        this.editFeature = new core_1.EventEmitter();
        /* Sets the sidebar of leaflet map to visible/invisible */
        this.hasSidebar = false;
        this.destroyed$ = new rxjs_1.Subject();
    }
    NgxLocationViewerComponent.prototype.ngOnInit = function () {
        this.initLocationViewer();
    };
    NgxLocationViewerComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * Zooms the map in
     */
    NgxLocationViewerComponent.prototype.zoomIn = function () {
        this.leafletMap.zoomIn();
    };
    /**
     * Zooms the map out
     */
    NgxLocationViewerComponent.prototype.zoomOut = function () {
        this.leafletMap.zoomOut();
    };
    NgxLocationViewerComponent.prototype.toggleLayermanagement = function () {
        this.hasSidebar = !this.hasSidebar;
    };
    NgxLocationViewerComponent.prototype.initLocationViewer = function () {
        var _this = this;
        this.leafletMap = new location_viewer_map_1.LocationViewerMap({
            zoom: this.defaultZoom,
            center: this.mapCenter,
            onAddPolygon: function (layer) {
                _this.addPolygon.emit(layer);
            },
            onAddLine: function (layer) {
                _this.addLine.emit(layer);
            },
            onEditFeature: function (feature) {
                _this.editFeature.emit(feature);
            }
        }, this.mapService);
        this.leafletMap.onInit.subscribe(function () {
            _this.leafletMap.addTileLayer(map_1.baseMapWorldGray);
            _this.leafletMap.addTileLayer(map_1.baseMapAntwerp);
            if (_this.showToolbar) {
                _this.leafletMap.addToolbar(_this.toolbarOptions);
                var actions = [
                    // uses the default 'cancel' action
                    'cancel',
                    // creates a new action that has text, no click event
                    { text: 'Custom text, no click' },
                    // creates a new action with text and a click event
                    {
                        text: 'click me',
                        onClick: function () {
                            alert('🙋‍♂️');
                        }
                    },
                ];
                _this.leafletMap.map.pm.Toolbar.createCustomControl({ name: 'meten', className: 'location-viewer-measure', actions: actions });
            }
            _this.initiateSupportingLayer();
            _this.leafletMap.addOperationalLayer();
        });
    };
    NgxLocationViewerComponent.prototype.initiateSupportingLayer = function () {
        var _this = this;
        if (this.supportingLayerOptions) {
            rxjs_1.forkJoin([
                this.mapserverService.getMapserverInfo(this.supportingLayerOptions.url),
                this.mapserverService.getMapserverLegend(this.supportingLayerOptions.url),
            ])
                .pipe(operators_1.take(1))
                .subscribe(function (_a) {
                var info = _a[0], legend = _a[1];
                _this.supportingLayer = _this.layerService.buildLayerFromInfoAndLegend(info, legend, _this.supportingLayerOptions.layerIds);
                var ids = _this.layerService.getVisibleLayerIds(_this.supportingLayer);
                _this.leafletMap.addSupportingLayers(_this.supportingLayerOptions.url, ids);
            });
            this.layerService.layerVisiblityChange$.pipe(operators_1.takeUntil(this.destroyed$)).subscribe(function () {
                var ids = _this.layerService.getVisibleLayerIds(_this.supportingLayer);
                _this.leafletMap.setVisibleLayersSupportingLayer(ids);
            });
        }
    };
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "defaultZoom");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "onSelectZoom");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "mapCenter");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "showToolbar");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "toolbarOptions");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "showLayerManagement");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "layerManagementVisible");
    __decorate([
        core_1.Input()
    ], NgxLocationViewerComponent.prototype, "supportingLayerOptions");
    __decorate([
        core_1.Output()
    ], NgxLocationViewerComponent.prototype, "addPolygon");
    __decorate([
        core_1.Output()
    ], NgxLocationViewerComponent.prototype, "addLine");
    __decorate([
        core_1.Output()
    ], NgxLocationViewerComponent.prototype, "editFeature");
    NgxLocationViewerComponent = __decorate([
        core_1.Component({
            selector: 'aui-location-viewer',
            templateUrl: './ngx-location-viewer.component.html',
            styleUrls: ['./ngx-location-viewer.component.scss']
        })
    ], NgxLocationViewerComponent);
    return NgxLocationViewerComponent;
}());
exports.NgxLocationViewerComponent = NgxLocationViewerComponent;
