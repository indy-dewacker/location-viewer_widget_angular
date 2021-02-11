import { TestBed } from '@angular/core/testing';

import { LocationViewerHelper } from './location-viewer.helper';

describe('LocationViewerHelper', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [LocationViewerHelper]
    }));

    it('should be created', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);
        expect(service).toBeTruthy();
    });

    it('isValidMapServer should throw error if url is invalid', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);
        const url = 'test';
        expect(() => service.isValidMapServer(url)).toThrowError(`Provided url is not a valid url: ${url}`);
    });

    it('isValidMapServer should throw error if url is not http/https', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);
        const url = 'htt://www.google.be';
        expect(() => service.isValidMapServer(url)).toThrowError(`Provided url does not follow http(s) protocol: ${url}`);
    });

    it('isValidMapServer should throw error if url does not end on mapserver', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);
        const url = 'https://www.google.be';
        expect(() => service.isValidMapServer(url)).toThrowError(`Provided mapserver url has to end with 'mapserver': ${url}`);
    });

    it('isValidMapServer should return true with valid mapserver url', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);
        const url = 'https://www.google.be/mapserver';
        expect(() => service.isValidMapServer(url)).toBeTruthy();
    });

    it('isCoordinateInsideGeometry should return true if coordinate is inside geometry', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);

        const lat = 51.4;
        const lon = 4.4;

        const geometry = [
            [51.39, 4.39],
            [51.39, 4.41],
            [51.41, 4.41],
            [51.41, 4.39],
        ];
        expect(service.isCoordinateInsideGeometry(lat, lon, geometry)).toBeTruthy();
    });

    it('isCoordinateInsideGeometry should return false if latitude is outside geometry', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);

        const lat = 51.389999999;
        const lon = 4.4;

        const geometry = [
            [51.39, 4.39],
            [51.39, 4.41],
            [51.41, 4.41],
            [51.41, 4.39],
        ];
        expect(service.isCoordinateInsideGeometry(lat, lon, geometry)).toBeFalsy();
    })

    it('isCoordinateInsideGeometry should return false if longitude is outside geometry', () => {
        const service: LocationViewerHelper = TestBed.get(LocationViewerHelper);

        const lat = 51.4;
        const lon = 4.389999999;

        const geometry = [
            [51.39, 4.39],
            [51.39, 4.41],
            [51.41, 4.41],
            [51.41, 4.39],
        ];
        expect(service.isCoordinateInsideGeometry(lat, lon, geometry)).toBeFalsy();
    });
});
