import { TestBed } from '@angular/core/testing';

import { GeoCoordinatesService } from './geo-coordinates.service';

describe('GeoCoordinatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoCoordinatesService = TestBed.get(GeoCoordinatesService);
    expect(service).toBeTruthy();
  });
});
