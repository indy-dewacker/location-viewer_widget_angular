import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLocationViewerComponent } from './ngx-location-viewer.component';

describe('NgxLocationViewerComponent', () => {
  let component: NgxLocationViewerComponent;
  let fixture: ComponentFixture<NgxLocationViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxLocationViewerComponent ]
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
