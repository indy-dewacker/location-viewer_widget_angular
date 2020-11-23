import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressResponse } from '../types/geoapi/address-response.model';
import { LatLng } from '../types/leaflet.types';

@Injectable()
export class GeoApiService {
    private baseUrl = 'https://geoapi-app1-a.antwerpen.be/v2/';
    constructor(private http: HttpClient) {

    }

    getAddressesByCoordinates(coords: LatLng): Observable<AddressResponse> {
        return this.http.get<AddressResponse>(`${this.baseUrl}addresses?sr=wgs84&x=${coords.lat}&y=${coords.lng}&buffer=50&count1`);
    }
}
