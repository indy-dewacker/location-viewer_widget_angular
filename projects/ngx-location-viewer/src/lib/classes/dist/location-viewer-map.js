"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.LocationViewerMap = void 0;
var map_1 = require("@acpaas-ui/ngx-components/map");
var LocationViewerMap = /** @class */ (function (_super) {
    __extends(LocationViewerMap, _super);
    function LocationViewerMap(options, mapService) {
        return _super.call(this, options, mapService) || this;
    }
    // Toolbar
    LocationViewerMap.prototype.addToolbar = function (options) {
        if (this.mapService.isAvailable()) {
            this.map.pm.addControls(options);
        }
    };
    // Supporting layer
    LocationViewerMap.prototype.addSupportingLayers = function (mapserverUrl, layerIds) {
        if (this.mapService.isAvailable()) {
            this.supportingLayer = new this.mapService.esri.dynamicMapLayer({
                maxZoom: 20,
                minZoom: 0,
                url: mapserverUrl,
                opacity: 1,
                layers: layerIds,
                continuousWorld: true,
                useCors: false,
                f: 'image'
            }).addTo(this.map);
        }
    };
    // Supportinglayer will only show the provided layerids
    LocationViewerMap.prototype.setVisibleLayersSupportingLayer = function (ids) {
        if (this.mapService.isAvailable() && this.supportingLayer) {
            this.supportingLayer.setLayers(ids);
        }
    };
    // Operational layer
    LocationViewerMap.prototype.addOperationalLayer = function () {
        var _this = this;
        if (this.mapService.isAvailable()) {
            var layer_1 = new this.mapService.esri.featureLayer({
                // url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_ToK/P_Tok_routeweek/MapServer/145',
                url: 'https://geoint-a.antwerpen.be/arcgissql/rest/services/A_DA/Locaties_Cascade/MapServer/28',
                onEachFeature: function (feature, layerProp) {
                    layerProp.on('click', function (e) {
                        _this.registerOnclick(feature);
                    });
                }
            }).bindPopup(function (layerInfo) {
                return _this.mapService.L.Util.template('<p>Naam: {naam}</p>', layerInfo.feature.properties);
            }).addTo(this.map);
            // removes default click behaviour ==> opening popup
            layer_1.off('click');
            layer_1.on('mouseover', function (e) {
                layer_1.openPopup(e.layer || e.target, e.layer.getBounds().getCenter());
            });
            layer_1.on('mouseout', function () {
                layer_1.closePopup();
            });
        }
    };
    LocationViewerMap.prototype.registerOnclick = function (feature) {
        console.log(feature);
    };
    return LocationViewerMap;
}(map_1.LeafletMap));
exports.LocationViewerMap = LocationViewerMap;
