import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LayerService } from '../../../services/layer.service';
import { LayerLegendComponent } from '../layer-legend/layer-legend.component';

import { LayerComponent } from './layer.component';

describe('LayerComponent', () => {
  let component: LayerComponent;
  let fixture: ComponentFixture<LayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayerComponent, LayerLegendComponent],
      imports: [FormsModule],
      providers: [LayerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
