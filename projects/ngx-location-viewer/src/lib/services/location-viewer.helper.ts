import { Injectable } from '@angular/core';
import { AddressDetail } from '../types/geoapi/address-detail.model';
import { LatLng } from '../types/leaflet.types';

@Injectable({
    providedIn: 'root'
})
/**
 * Provide helper functions
 */
export class LocationViewerHelper {
    /**
     *
     */
    constructor() {
    }

    /**
     * Calculates the distance between multiple LatLng objects
     *
     * @param arrayOfPoints (array containing LatLng to calculate distance between)
     *
     * @return number
     */
    calculateDistance(arrayOfPoints: LatLng[]): number {
        let totalDistance = 0;
        for (let i = 0; i < arrayOfPoints.length - 1; i++) {
            const currPoint = arrayOfPoints[i];
            const nextPoint = arrayOfPoints[i + 1];
            totalDistance += currPoint.distanceTo(nextPoint);
        }
        return totalDistance;
    }

    /**
     * Calculates the perimeter multiple LatLng objects
     *
     * @param arrayOfPoints (array containing LatLng to calculate perimeter)
     *
     * @return number
     */
    calculatePerimeter(arrayOfPoints: LatLng[]): number {
        let totalDistance = 0;
        for (let i = 0; i < arrayOfPoints.length; i++) {
            const currPoint = arrayOfPoints[i];
            // if it is the last point calculate distance to the first point
            if (i === arrayOfPoints.length - 1) {
                totalDistance += currPoint.distanceTo(arrayOfPoints[0]);
            } else {
                totalDistance += currPoint.distanceTo(arrayOfPoints[i + 1]);
            }
        }
        return totalDistance;
    }


    /**
     * Builds the html for area popup
     *
     * @param perimeter the calculated perimeter
     * @param area the calculated area
     *
     * @return string
     */
    getAreaPopupContent(perimeter: number, area: number): string {
        return `<p>Omtrek(m): ${perimeter.toFixed(2)}</p><p>Opp(m²): ${area.toFixed(2)}</p>`;
    }

    /**
     * Builds the html for the distance popup
     *
     * @param distance the calculated distance
     *
     * @return string
     */
    getDistancePopupContent(distance: number): string {
        return `<p>Afstand(m): ${distance.toFixed(2)}</p>`;
    }

    /**
     * Builds the html for the whatishere popup
     *
     *
     */
    getWhatisherePopupContent(address: AddressDetail): string {
        return '<div class="whatishere-wrapper">' + '<div class="whatishere-title"><b>' + address.formattedAddress + '</b></div>' +
        '<div class="whatishere-content">' +
        '<div class="whatishere-type">WGS84:</div><div>' + address.addressPosition.wgs84.lat +
        ', ' +
        address.addressPosition.wgs84.lon + '</div>' +
        '<div class="whatishere-type">Lambert:</div><div> ' + address.addressPosition.lambert72.x +
        ', ' +
        address.addressPosition.lambert72.y + '</div>' +
        '</div><div class="whatishere-image"> ' +
        '<a href="http://maps.google.com/maps?q=&layer=c&cbll=' +
        address.addressPosition.wgs84.lat +
        ',' +
        address.addressPosition.wgs84.lon +
        '" + target="_blank" >' +
        '<img title="Ga naar streetview" src="https://seeklogo.com/images/G/google-street-view-logo-665165D1A8-seeklogo.com.png" style="max-width: 100%; max-height: 100%;"/>' +
        '</a></div></div>';
    }

}
