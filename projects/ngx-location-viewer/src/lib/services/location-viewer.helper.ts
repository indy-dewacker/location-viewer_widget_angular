import { Injectable } from '@angular/core';
import { AddressDetail } from '../types/geoapi/address-detail.model';
import { LatLng } from '../types/leaflet.types';
import { OperationalLayerOptions, OperationalMarker } from '../types/operational-layer-options.model';

@Injectable()
/**
 * Provide helper functions
 */
export class LocationViewerHelper {
  /**
   *
   */
  constructor() { }

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
   * Check if required settings are provided in OperationalLayerOptions to build operational layer as esri feature layer
   * @param operationalLayerOptions
   *
   * @return boolean
   */
  isValidOperationalFeatureLayerConfiguration(operationalLayerOptions: OperationalLayerOptions): boolean {
    return operationalLayerOptions.url && operationalLayerOptions.layerId && this.isValidMapServer(operationalLayerOptions.url);
  }

  /**
   * Check if required settings are provided in OperationalLayerOptions to build operational layer as custom marker layer
   * @param operationalLayerOptions
   *
   * @return boolean
   */
  isValidOpertionalMarkerLayerConfiguration(operationalLayerOptions: OperationalLayerOptions): boolean {
    return operationalLayerOptions.markers && operationalLayerOptions.markers.length > 0 && operationalLayerOptions.name && operationalLayerOptions.isVisible;
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
   * @param address AddressDetail object with address info
   *
   * @return string
   */
  getWhatisherePopupContent(address: AddressDetail): string {
    return `<div class="whatishere-wrapper">
        <div class="whatishere-title"><b>${address.formattedAddress}</b></div>
        <div class="whatishere-content">
        <div class="whatishere-type">WGS84:</div>
        <div>${address.addressPosition.wgs84.lat}, ${address.addressPosition.wgs84.lon}</div>
        <div class="whatishere-type">Lambert:</div>
        <div>${address.addressPosition.lambert72.x}, ${address.addressPosition.lambert72.y}</div>
        </div><div class="whatishere-image">
        <a href="https://maps.google.com/maps?q=&layer=c&cbll=${address.addressPosition.wgs84.lat},${address.addressPosition.wgs84.lon}"
        target="_blank" ><img title="Ga naar streetview"
        src="https://seeklogo.com/images/G/google-street-view-logo-665165D1A8-seeklogo.com.png"
        style="max-width: 100%; max-height: 100%;"/></a></div></div>`;
  }

  /**
   * Check for valid mapserver url
   *
   * @param url mapserver url
   *
   * @return boolean
   */
  isValidMapServer(url: string): boolean {
    let validUrl: URL;

    // first check for valid url
    try {
      validUrl = new URL(url);
    } catch (error) {
      throw new Error(`Provided url is not a valid url: ${url}`);
    }

    // check if url is http or https protocol
    if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
      throw new Error(`Provided url does not follow http(s) protocol: ${url}`);
    }

    // we expect mapserver url to end with 'mapserver' this is to build the correct urls
    if (!validUrl.href.toLowerCase().endsWith('mapserver')) {
      throw new Error(`Provided mapserver url has to end with \'mapserver\': ${url}`);
    }

    return true;
  }

  /**
   * Filter markers by geometry
   *
   * @param markers Operationalmarker array to filter
   * @param geometries Array of polygons
   *
   * @returns OperationalMarker[]
   */
  filterOperationalMarkersByGeometries(markers: OperationalMarker[], geometries: any[]): OperationalMarker[] {
    let filteredMarkers: OperationalMarker[] = [];
    // flatten geometries to polygons, geometry could be polygon or collection of polygons
    const polygons = geometries.map(g => {
      if (g[0] && g[0][0] && isNaN(g[0][0])) {
        return g.reduce((a, b) => a.concat(b)).map(([y, x]) => [x, y])
      } else {
        return g.map(([y, x]) => [x, y]);
      }
    });

    polygons.forEach(polygon => {
      const polyMarkers = markers.filter((marker) => {
        return this.isCoordinateInsideGeometry(marker.coordinate.lat, marker.coordinate.lon, polygon);
      });
      filteredMarkers.push(...polyMarkers);
    });

    return filteredMarkers;
  }

  /**
   * Check if coordinate is inside geometry, based on ray casting algorithm
   * Code is based on: https://github.com/substack/point-in-polygon
   *
   * @param lattitude lattitude
   * @param longitude longitude
   * @param geometry Array of 2 based number arrays, check if markers are inside this geometry
   *
   * @returns boolean
   */
  isCoordinateInsideGeometry(lattitude: number, longitude: number, geometry: number[][]): boolean {
    let inside = false;
    for (let i = 0, j = geometry.length - 1; i < geometry.length; j = i++) {
      const currentPointX = geometry[i][0];
      const currentPointY = geometry[i][1];
      const lastPointX = geometry[j][0];
      const lastPointY = geometry[j][1];

      const intersect =
        currentPointY > longitude != lastPointY > longitude &&
        lattitude <
        ((lastPointX - currentPointX) * (longitude - currentPointY)) / (lastPointY - currentPointY) +
        currentPointX;

      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
}
