import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MapserverInfo } from '../types/mapserver/info-response/mapserver-info.model';
import { MapserverLegend } from '../types/mapserver/legend-response/mapserver-legend.model';

@Injectable()
export class MapServerService {
    constructor(private http: HttpClient) {}

    private responseQueryParam = 'f=pjson';

    getMapserverLegend(url: string): Observable<MapserverLegend> {
        return this.http.get<MapserverLegend>(`${url}/legend?${this.responseQueryParam}`);
    }

    getMapserverInfo(url: string): Observable<MapserverInfo> {
        return this.http.get<MapserverInfo>(`${url}?${this.responseQueryParam}`);
    }
}
