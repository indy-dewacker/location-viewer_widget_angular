import { LeafletModule } from '@acpaas-ui/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Button } from 'protractor';
import { LocationViewerMap } from '../classes/location-viewer-map';
import { MAP_SERVICE_PROVIDER } from '../map.provider';
import { GeoApiService } from '../services/geoapi.service';
import { LayerService } from '../services/layer.service';
import { LocationViewerMapService } from '../services/location-viewer-map.service';
import { LocationViewerHelper } from '../services/location-viewer.helper';
import { MapServerService } from '../services/mapserver.service';
import { ButtonActions } from '../types/button-actions.enum';
import { Shapes } from '../types/geoman/geoman.types';
import { LayerLegendComponent } from './layer-management/layer-legend/layer-legend.component';
import { LayerManagementComponent } from './layer-management/layer-management.component';
import { LayerComponent } from './layer-management/layer/layer.component';

import { NgxLocationViewerComponent } from './ngx-location-viewer.component';

describe('NgxLocationViewerComponent', () => {
    let component: NgxLocationViewerComponent;
    let fixture: ComponentFixture<NgxLocationViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NgxLocationViewerComponent, LayerManagementComponent, LayerComponent, LayerLegendComponent],
            imports: [CommonModule, HttpClientModule, FormsModule, LeafletModule],
            providers: [MAP_SERVICE_PROVIDER, MapServerService, LayerService, GeoApiService, LocationViewerHelper],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NgxLocationViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should instantiate leaflet', () => {
        component.ngOnInit();
        expect(component.leafletMap).toBeDefined();
    });

    it('should use passed leaflet instance', () => {
        const locationViewerMapService = new LocationViewerMapService('test');
        const leafletMap: LocationViewerMap = new LocationViewerMap(
            {
                zoom: 16,
                center: [51.215, 4.425],
            },
            locationViewerMapService,
        );
        component.leafletMap = leafletMap;
        component.ngOnInit();

        expect(component.leafletMap).toEqual(leafletMap);
    });

    describe('activeButtonChangeTests', () => {
        // testcase has new action, current action, expected current action, expected geoman active draw
        const testCases = [
            {
                newAction: ButtonActions.area,
                currentAction: ButtonActions.none,
                expectedAction: ButtonActions.area,
                activeDraw: Shapes.Polygon,
            },
            { newAction: ButtonActions.area, currentAction: ButtonActions.area, expectedAction: ButtonActions.none, activeDraw: undefined },
            {
                newAction: ButtonActions.distance,
                currentAction: ButtonActions.none,
                expectedAction: ButtonActions.distance,
                activeDraw: Shapes.Line,
            },
            {
                newAction: ButtonActions.distance,
                currentAction: ButtonActions.distance,
                expectedAction: ButtonActions.none,
                activeDraw: undefined,
            },
            {
                newAction: ButtonActions.measurement,
                currentAction: ButtonActions.none,
                expectedAction: ButtonActions.measurement,
                activeDraw: undefined,
            },
            {
                newAction: ButtonActions.measurement,
                currentAction: ButtonActions.measurement,
                expectedAction: ButtonActions.none,
                activeDraw: undefined,
            },
            {
                newAction: ButtonActions.select,
                currentAction: ButtonActions.none,
                expectedAction: ButtonActions.select,
                activeDraw: undefined,
            },
            {
                newAction: ButtonActions.select,
                currentAction: ButtonActions.select,
                expectedAction: ButtonActions.none,
                activeDraw: undefined,
            },
            {
                newAction: ButtonActions.selectPolygon,
                currentAction: ButtonActions.none,
                expectedAction: ButtonActions.selectPolygon,
                activeDraw: Shapes.Polygon,
            },
            {
              newAction: ButtonActions.selectPolygon,
              currentAction: ButtonActions.none,
              expectedAction: ButtonActions.selectPolygon,
              activeDraw: Shapes.Polygon,
            },
            {
              newAction: ButtonActions.selectPolygon,
              currentAction: ButtonActions.selectPolygon,
              expectedAction: ButtonActions.none,
              activeDraw: undefined,
            },
            {
              newAction: ButtonActions.selectRectangle,
              currentAction: ButtonActions.none,
              expectedAction: ButtonActions.selectRectangle,
              activeDraw: Shapes.Rectangle,
            },
            {
              newAction: ButtonActions.selectRectangle,
              currentAction: ButtonActions.selectRectangle,
              expectedAction: ButtonActions.none,
              activeDraw: undefined,
            },
            {
              newAction: ButtonActions.whatishere,
              currentAction: ButtonActions.none,
              expectedAction: ButtonActions.whatishere,
              activeDraw: Shapes.Marker,
            },
            {
              newAction: ButtonActions.whatishere,
              currentAction: ButtonActions.whatishere,
              expectedAction: ButtonActions.none,
              activeDraw: undefined,
            }
        ];

        testCases.forEach((test, index) => {
            it(`should handle activeButtonChange correctly with new button: ${test.newAction}, currentAction: ${
                test.currentAction
            } (testcase: ${index + 1})`, (done) => {
                component.ngOnInit();
                component.currentButton = test.currentAction;
                // initiate leafletmap on init and after leafletmap is initialized run tests
                component.ngOnInit();
                component.leafletMap.onInit.subscribe(() => {
                    component.activeButtonChange(test.newAction);
                    expect(component.currentButton).toEqual(test.expectedAction);
                    expect(component.leafletMap.map.pm.Draw.getActiveShape()).toEqual(test.activeDraw);
                    done();
                });
            });
        });
    });
});
