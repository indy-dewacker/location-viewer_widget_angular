import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressResponse } from '../types/geoapi/address-response.model';
import { GeofeatureResponse } from '../types/geoapi/geofeature-response.model';
import { LatLng } from '../types/leaflet.types';

@Injectable()
export class GeoApiService {
    private baseUrl = 'https://geoapi-app1-a.antwerpen.be/v2/';
    constructor(private http: HttpClient) {

    }

    getAddressesByCoordinates(coords: LatLng): Observable<AddressResponse> {
        return this.http.get<AddressResponse>(`${this.baseUrl}addresses?sr=wgs84&x=${coords.lat}&y=${coords.lng}&buffer=50&count1`);
    }

    getGeofeaturesByGeometry(url: string, layerIds: number[], feature: any): Observable<GeofeatureResponse> {
        const body = feature.geometry.coordinates[0].map(([y, x]) => ({ x, y }));
        return this.http.post<GeofeatureResponse>(`${this.baseUrl}geofeatures?sr=wgs84&url=${url}&layerids=${layerIds}`, body);
    }
}
