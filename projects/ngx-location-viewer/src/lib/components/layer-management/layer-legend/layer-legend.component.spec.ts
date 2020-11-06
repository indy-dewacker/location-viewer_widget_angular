import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerLegendComponent } from './layer-legend.component';

describe('LayerLegendComponent', () => {
  let component: LayerLegendComponent;
  let fixture: ComponentFixture<LayerLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
