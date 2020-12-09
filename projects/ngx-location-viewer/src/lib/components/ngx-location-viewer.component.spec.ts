import { LeafletModule } from '@acpaas-ui/ngx-components/map';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAP_SERVICE_PROVIDER } from '../map.provider';
import { GeoApiService } from '../services/geoapi.service';
import { LayerService } from '../services/layer.service';
import { MapServerService } from '../services/mapserver.service';
import { LayerLegendComponent } from './layer-management/layer-legend/layer-legend.component';
import { LayerManagementComponent } from './layer-management/layer-management.component';
import { LayerComponent } from './layer-management/layer/layer.component';

import { NgxLocationViewerComponent } from './ngx-location-viewer.component';

describe('NgxLocationViewerComponent', () => {
  let component: NgxLocationViewerComponent;
  let fixture: ComponentFixture<NgxLocationViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxLocationViewerComponent, LayerManagementComponent, LayerComponent, LayerLegendComponent ],
      imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        LeafletModule],
        providers: [
          MAP_SERVICE_PROVIDER,
          MapServerService,
          LayerService,
          GeoApiService
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxLocationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
