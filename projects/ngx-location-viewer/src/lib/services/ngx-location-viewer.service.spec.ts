import { TestBed } from '@angular/core/testing';

import { NgxLocationViewerService } from './ngx-location-viewer.service';

describe('NgxLocationViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxLocationViewerService = TestBed.get(NgxLocationViewerService);
    expect(service).toBeTruthy();
  });
});
