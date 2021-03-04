import { Component, OnInit } from '@angular/core';
import {
    FilterLayerOptions,
    GeofeatureDetail,
    OperationalLayerOptions,
    OperationalMarker,
    SupportingLayerOptions,
} from 'projects/ngx-location-viewer/src/public-api';

import taken from './../assets/sluiksort-taken.json';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    result: GeofeatureDetail[];
    geoApiBaseUrl = 'https://geoapi-app1-o.antwerpen.be/v2/';
    showLayerManagement = true;
    supportingLayerOptions: SupportingLayerOptions = {
        url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_ToK/P_Tok_routeweek/Mapserver',
        layerIds: [143, 144, 145, 146, 147],
    };

    operationalLayerOptions: OperationalLayerOptions = {
        name: 'taken',
        isVisible: true,
        markers: taken._embedded.tasks.filter(x => x.locationDuringAssignment.xCoordinate !== null && x.locationDuringAssignment.xCoordinate !== '').map(x => {
            const marker: OperationalMarker = {
                data: x,
                icon: `fa fa-${x.icon}`,
                coordinate: {
                    lat: +x.locationDuringAssignment.xCoordinate,
                    lon: +x.locationDuringAssignment.yCoordinate
                },
                color: "#000000",
                size: "20px"
            };
            return marker;
        }),
        enableClustering: true,
    };

    filterLayers: FilterLayerOptions[] = [{
            url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_ToK/P_Tok_routeweek/Mapserver',
            layerId: 78,
            name: 'Routes',
            popupLabel: 'Routenaam',
            propertyToDisplay: 'Routenaam',
    },
        {
        url: 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Mobiliteit/Mapserver',
        layerId: 98,
        name: 'Tariefzones',
        popupLabel: 'Tariefzone',
        propertyToDisplay: 'TARIEFZONE',
    }]

    // supportingLayerOptions: SupportingLayerOptions = {
    //   url: 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Mobiliteit/Mapserver',
    //   layerIds: [38, 42, 65]
    // };

    ngOnInit() {
    }

    updateResult(result: GeofeatureDetail[]) {
        this.result = result;
    }

    changeSettings() {
        this.supportingLayerOptions = {
            url: 'http://geodata.antwerpen.be/arcgissql/rest/services/P_ToK/P_Tok_routeweek/Mapserver',
            layerIds: [143, 144, 147],
        };

        this.operationalLayerOptions = {
            url: 'https://geoint.antwerpen.be/arcgissql/rest/services/P_Stad/Mobiliteit/Mapserver',
            layerId: 2,
            enableClustering: false,
        };
    }
}
