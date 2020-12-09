import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LayerService } from '../../services/layer.service';
import { LayerLegendComponent } from './layer-legend/layer-legend.component';

import { LayerManagementComponent } from './layer-management.component';
import { LayerComponent } from './layer/layer.component';

describe('LayerManagementComponent', () => {
  let component: LayerManagementComponent;
  let fixture: ComponentFixture<LayerManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerManagementComponent, LayerComponent, LayerLegendComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        LayerService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
